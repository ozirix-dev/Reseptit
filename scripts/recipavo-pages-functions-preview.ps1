# [Chat 1] Guarded Cloudflare Pages Functions preview. Production must not be modified.
[CmdletBinding(SupportsShouldProcess=$true, ConfirmImpact='High')]
param(
  [Parameter(Mandatory=$true)][ValidatePattern('^[a-f0-9]{40}$')][string]$ExpectedSha,
  [string]$Repo = 'D:\Projects\Products\Reseptit',
  [ValidatePattern('^preview-chat1-functions-[a-z0-9-]+$')][string]$PreviewBranch = 'preview-chat1-functions-20261121',
  [switch]$Apply
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
function Need([bool]$Test, [string]$Message) {
  if (-not $Test) { throw "HOLD: $Message" }
}
function Run([string]$Program,[string[]]$CommandArgs) {
  # $args is a PowerShell automatic variable; do not use it for named parameters.
  $out = & $Program @CommandArgs 2>&1
  $commandName = if ($CommandArgs.Count -gt 0) { $CommandArgs[0] } else { '<no-args>' }
  Need ($LASTEXITCODE -eq 0) ("Command failed: " + $Program + " " + $commandName)
  return ($out | Out-String).Trim()
}
function PagesJson([string[]]$WranglerArgs) {
  $raw = Run 'npx.cmd' (@('--yes','wrangler@4.165.0') + $WranglerArgs + @('--json'))
  try { return ConvertFrom-Json -InputObject $raw -Depth 80 }
  catch { throw 'HOLD: Wrangler did not return JSON. Verify existing Cloudflare login locally.' }
}
function Items($Obj) {
  if ($Obj -is [array]) { return @($Obj) }
  foreach ($key in @('result','projects','deployments','items')) {
    if ($null -ne $Obj -and $Obj.PSObject.Properties[$key]) { return Items $Obj.$key }
  }
  return @($Obj)
}
function Prop($Obj,[string]$Name) {
  if ($null -eq $Obj) { return $null }
  $p = $Obj.PSObject.Properties | Where-Object { $_.Name -ieq $Name } | Select-Object -First 1
  if ($p) { return $p.Value }
  return $null
}
function LiveSha {
  try {
    $r = Invoke-WebRequest -Uri 'https://www.recipavo.com/' -Method Get -MaximumRedirection 0 -TimeoutSec 20 -UseBasicParsing
    Need ([int]$r.StatusCode -eq 200) 'Production HTTP status was not 200'
    $v = [string]$r.Headers['x-recipavo-commit']
    Need ($v -match '^[a-f0-9]{40}$') 'Production revision header is missing'
    return $v
  } catch { throw 'HOLD: Production SHA could not be verified; no preview deployment allowed.' }
}
Need ($PreviewBranch -ne 'production' -and $PreviewBranch -ne 'main') 'Refusing a production/main branch'
$root = (Resolve-Path -LiteralPath $Repo).Path
Need (Test-Path (Join-Path $root '.git')) 'Missing Git worktree'
$site = Join-Path $root 'site'
$dist = Join-Path $site 'dist'
Need (Test-Path (Join-Path $site 'functions\api\feedback.ts')) 'Pages Functions source is missing'
Need (Test-Path (Join-Path $dist '_headers')) 'Missing stamped dist'
$origin = Run 'git' @('-C',$root,'remote','get-url','origin')
Need ($origin -match '(?i)github\.com[:/]ozirix-dev/Reseptit(?:\.git)?$') 'Wrong origin'
$head = Run 'git' @('-C',$root,'rev-parse','HEAD')
Need ($head -eq $ExpectedSha) 'Checkout does not match expected SHA'
$remote = Run 'git' @('-C',$root,'ls-remote','origin','refs/heads/main')
$remoteSha = ($remote -split '\s+')[0]
Need ($remoteSha -match '^[a-f0-9]{40}$') 'Remote main SHA could not be read'
# A pinned main ancestor is valid for preview even when other chats merge later.
$trackedMain = Run 'git' @('-C',$root,'rev-parse','refs/remotes/origin/main')
Need ($trackedMain -eq $remoteSha) 'Local origin/main is stale; fetch origin main first'
& git -C $root merge-base --is-ancestor $ExpectedSha $trackedMain
Need ($LASTEXITCODE -eq 0) 'Pinned preview SHA is not an ancestor of remote main'
Need (-not (Run 'git' @('-C',$root,'status','--porcelain','--untracked-files=no'))) 'Tracked worktree is dirty'
$headers = Get-Content -LiteralPath (Join-Path $dist '_headers') -Raw
$stamps = [regex]::Matches($headers,'(?im)^\s*X-Recipavo-Commit:[ \t]*([a-f0-9]{40})\s*$')
Need ($stamps.Count -eq 1 -and $stamps[0].Groups[1].Value -eq $ExpectedSha) 'dist SHA stamp differs'
$assets = @(Get-ChildItem -LiteralPath $dist -Recurse -File -Force)
Need ($assets.Count -gt 0 -and $assets.Count -le 20000) 'Pages asset count out of range'
Need (-not @($assets | Where-Object { $_.Length -gt 25MB }).Count) 'A Pages asset is over 25 MiB'
Push-Location $site
try {
  $projects = Items (PagesJson @('pages','project','list'))
  $matches = @($projects | Where-Object { (Prop $_ 'name') -eq 'recipavo-site' })
  Need ($matches.Count -eq 1) 'Expected exactly one recipavo-site project'
  Need ((Prop $matches[0] 'production_branch') -eq 'production') 'Unexpected Cloudflare production branch'
  $before = LiveSha
  $preview = "https://$PreviewBranch.recipavo-site.pages.dev/"
  Write-Host "Preflight PASS; project=recipavo-site; preview=$preview; sha=$ExpectedSha; live=$before"
  if (-not $Apply) {
    Write-Host 'HOLD: read-only preflight finished. Preview was NOT uploaded. Re-run with -Apply after approval.'
    return
  }
  if (-not $PSCmdlet.ShouldProcess($preview, "Deploy Pages Functions preview at $ExpectedSha")) {
    Write-Host 'HOLD: preview deployment declined.'
    return
  }
  # Running inside site/ makes Wrangler discover site/functions automatically.
  & npx.cmd --yes wrangler@4.165.0 pages deploy $dist --project-name recipavo-site --branch $PreviewBranch --commit-hash $ExpectedSha
  Need ($LASTEXITCODE -eq 0) 'Wrangler preview deployment failed'
  & node scripts/feedback-cloudflare-preview-probe.mjs --url $preview --sha $ExpectedSha
  Need ($LASTEXITCODE -eq 0) 'Preview HTTP/Functions/noindex smoke test failed'
  $after = LiveSha
  Need ($after -eq $before) 'Production revision changed while preview was tested'
  Write-Host "PASS: Preview functions test and production SHA unchanged ($after). POST was not sent."
} finally { Pop-Location }
) 'Remote main SHA could not be read'
# A preview may safely test a pinned, already CI-tested main ancestor while other
# Chat N owners continue merging. Do not require the main tip to stand still.
$trackedMain = Run 'git' @('-C',$root,'rev-parse','refs/remotes/origin/main')
Need ($trackedMain -eq $remoteSha) 'Local origin/main is stale; run git fetch origin main in the isolated preview worktree'
& git -C $root merge-base --is-ancestor $ExpectedSha $trackedMain
Need ($LASTEXITCODE -eq 0) 'Approved preview SHA is not an ancestor of remote main'
Need (-not (Run 'git' @('-C',$root,'status','--porcelain','--untracked-files=no'))) 'Tracked worktree is dirty'
$headers = Get-Content -LiteralPath (Join-Path $dist '_headers') -Raw
$stamps = [regex]::Matches($headers,'(?im)^\s*X-Recipavo-Commit:[ \t]*([a-f0-9]{40})\s*$')
Need ($stamps.Count -eq 1 -and $stamps[0].Groups[1].Value -eq $ExpectedSha) 'dist SHA stamp differs'
$assets = @(Get-ChildItem -LiteralPath $dist -Recurse -File -Force)
Need ($assets.Count -gt 0 -and $assets.Count -le 20000) 'Pages asset count out of range'
Need (-not @($assets | Where-Object { $_.Length -gt 25MB }).Count) 'A Pages asset is over 25 MiB'
Push-Location $site
try {
  $projects = Items (PagesJson @('pages','project','list'))
  $matches = @($projects | Where-Object { (Prop $_ 'name') -eq 'recipavo-site' })
  Need ($matches.Count -eq 1) 'Expected exactly one recipavo-site project'
  Need ((Prop $matches[0] 'production_branch') -eq 'production') 'Unexpected Cloudflare production branch'
  $before = LiveSha
  $preview = "https://$PreviewBranch.recipavo-site.pages.dev/"
  Write-Host "Preflight PASS; project=recipavo-site; preview=$preview; sha=$ExpectedSha; live=$before"
  if (-not $Apply) {
    Write-Host 'HOLD: read-only preflight finished. Preview was NOT uploaded. Re-run with -Apply after approval.'
    return
  }
  if (-not $PSCmdlet.ShouldProcess($preview, "Deploy Pages Functions preview at $ExpectedSha")) {
    Write-Host 'HOLD: preview deployment declined.'
    return
  }
  # Running inside site/ makes Wrangler discover site/functions automatically.
  & npx.cmd --yes wrangler@4.165.0 pages deploy $dist --project-name recipavo-site --branch $PreviewBranch --commit-hash $ExpectedSha
  Need ($LASTEXITCODE -eq 0) 'Wrangler preview deployment failed'
  & node scripts/feedback-cloudflare-preview-probe.mjs --url $preview --sha $ExpectedSha
  Need ($LASTEXITCODE -eq 0) 'Preview HTTP/Functions/noindex smoke test failed'
  $after = LiveSha
  Need ($after -eq $before) 'Production revision changed while preview was tested'
  Write-Host "PASS: Preview functions test and production SHA unchanged ($after). POST was not sent."
} finally { Pop-Location }
) 'Remote main SHA could not be read'
# Main may move after the pinned preview build; require the pinned SHA to remain an ancestor.
$trackedMain = Run 'git' @('-C',$root,'rev-parse','refs/remotes/origin/main')
Need ($trackedMain -eq $remoteSha) 'Local origin/main is stale; fetch origin main first'
& git -C $root merge-base --is-ancestor $ExpectedSha $trackedMain
Need ($LASTEXITCODE -eq 0) 'Pinned preview SHA is not an ancestor of remote main'
Need (-not (Run 'git' @('-C',$root,'status','--porcelain','--untracked-files=no'))) 'Tracked worktree is dirty'
$headers = Get-Content -LiteralPath (Join-Path $dist '_headers') -Raw
$stamps = [regex]::Matches($headers,'(?im)^\s*X-Recipavo-Commit:[ \t]*([a-f0-9]{40})\s*$')
Need ($stamps.Count -eq 1 -and $stamps[0].Groups[1].Value -eq $ExpectedSha) 'dist SHA stamp differs'
$assets = @(Get-ChildItem -LiteralPath $dist -Recurse -File -Force)
Need ($assets.Count -gt 0 -and $assets.Count -le 20000) 'Pages asset count out of range'
Need (-not @($assets | Where-Object { $_.Length -gt 25MB }).Count) 'A Pages asset is over 25 MiB'
Push-Location $site
try {
  $projects = Items (PagesJson @('pages','project','list'))
  $matches = @($projects | Where-Object { (Prop $_ 'name') -eq 'recipavo-site' })
  Need ($matches.Count -eq 1) 'Expected exactly one recipavo-site project'
  Need ((Prop $matches[0] 'production_branch') -eq 'production') 'Unexpected Cloudflare production branch'
  $before = LiveSha
  $preview = "https://$PreviewBranch.recipavo-site.pages.dev/"
  Write-Host "Preflight PASS; project=recipavo-site; preview=$preview; sha=$ExpectedSha; live=$before"
  if (-not $Apply) {
    Write-Host 'HOLD: read-only preflight finished. Preview was NOT uploaded. Re-run with -Apply after approval.'
    return
  }
  if (-not $PSCmdlet.ShouldProcess($preview, "Deploy Pages Functions preview at $ExpectedSha")) {
    Write-Host 'HOLD: preview deployment declined.'
    return
  }
  # Running inside site/ makes Wrangler discover site/functions automatically.
  & npx.cmd --yes wrangler@4.165.0 pages deploy $dist --project-name recipavo-site --branch $PreviewBranch --commit-hash $ExpectedSha
  Need ($LASTEXITCODE -eq 0) 'Wrangler preview deployment failed'
  & node scripts/feedback-cloudflare-preview-probe.mjs --url $preview --sha $ExpectedSha
  Need ($LASTEXITCODE -eq 0) 'Preview HTTP/Functions/noindex smoke test failed'
  $after = LiveSha
  Need ($after -eq $before) 'Production revision changed while preview was tested'
  Write-Host "PASS: Preview functions test and production SHA unchanged ($after). POST was not sent."
} finally { Pop-Location }
) 'Remote main SHA could not be read'
# A preview may safely test a pinned, already CI-tested main ancestor while other
# Chat N owners continue merging. Do not require the main tip to stand still.
$trackedMain = Run 'git' @('-C',$root,'rev-parse','refs/remotes/origin/main')
Need ($trackedMain -eq $remoteSha) 'Local origin/main is stale; run git fetch origin main in the isolated preview worktree'
& git -C $root merge-base --is-ancestor $ExpectedSha $trackedMain
Need ($LASTEXITCODE -eq 0) 'Approved preview SHA is not an ancestor of remote main'
Need (-not (Run 'git' @('-C',$root,'status','--porcelain','--untracked-files=no'))) 'Tracked worktree is dirty'
$headers = Get-Content -LiteralPath (Join-Path $dist '_headers') -Raw
$stamps = [regex]::Matches($headers,'(?im)^\s*X-Recipavo-Commit:[ \t]*([a-f0-9]{40})\s*$')
Need ($stamps.Count -eq 1 -and $stamps[0].Groups[1].Value -eq $ExpectedSha) 'dist SHA stamp differs'
$assets = @(Get-ChildItem -LiteralPath $dist -Recurse -File -Force)
Need ($assets.Count -gt 0 -and $assets.Count -le 20000) 'Pages asset count out of range'
Need (-not @($assets | Where-Object { $_.Length -gt 25MB }).Count) 'A Pages asset is over 25 MiB'
Push-Location $site
try {
  $projects = Items (PagesJson @('pages','project','list'))
  $matches = @($projects | Where-Object { (Prop $_ 'name') -eq 'recipavo-site' })
  Need ($matches.Count -eq 1) 'Expected exactly one recipavo-site project'
  Need ((Prop $matches[0] 'production_branch') -eq 'production') 'Unexpected Cloudflare production branch'
  $before = LiveSha
  $preview = "https://$PreviewBranch.recipavo-site.pages.dev/"
  Write-Host "Preflight PASS; project=recipavo-site; preview=$preview; sha=$ExpectedSha; live=$before"
  if (-not $Apply) {
    Write-Host 'HOLD: read-only preflight finished. Preview was NOT uploaded. Re-run with -Apply after approval.'
    return
  }
  if (-not $PSCmdlet.ShouldProcess($preview, "Deploy Pages Functions preview at $ExpectedSha")) {
    Write-Host 'HOLD: preview deployment declined.'
    return
  }
  # Running inside site/ makes Wrangler discover site/functions automatically.
  & npx.cmd --yes wrangler@4.165.0 pages deploy $dist --project-name recipavo-site --branch $PreviewBranch --commit-hash $ExpectedSha
  Need ($LASTEXITCODE -eq 0) 'Wrangler preview deployment failed'
  & node scripts/feedback-cloudflare-preview-probe.mjs --url $preview --sha $ExpectedSha
  Need ($LASTEXITCODE -eq 0) 'Preview HTTP/Functions/noindex smoke test failed'
  $after = LiveSha
  Need ($after -eq $before) 'Production revision changed while preview was tested'
  Write-Host "PASS: Preview functions test and production SHA unchanged ($after). POST was not sent."
} finally { Pop-Location }
