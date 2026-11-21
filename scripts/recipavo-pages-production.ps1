# [Chat 1] SHA-locked Recipavo Pages deploy; inspection is the default.
# Run in PowerShell 7 with an authenticated existing Wrangler account.
# Never turns on feedback/D1/Turnstile/Cron/WAF.
[CmdletBinding(SupportsShouldProcess=$true, ConfirmImpact='High')]
param(
  [Parameter(Mandatory=$true)][ValidatePattern('^[a-f0-9]{40}$')][string]$ExpectedSha,
  [string]$Repo = 'D:\Projects\Products\Reseptit',
  [string]$Project = 'recipavo-site',
  [string]$ExpectedProductionBranch = 'production',
  [switch]$ProductionBranchVerified,
  [switch]$FeedbackDisabledVerified,
  [switch]$Apply
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Need([bool]$Ok, [string]$Message) {
  if (-not $Ok) { throw "HOLD: $Message" }
}
function Run-External([string]$Program, [string[]]$Arguments) {
  # Capture only the exit code and required read-only output. Never print tokens.
  $output = & $Program @Arguments 2>&1
  Need ($LASTEXITCODE -eq 0) ("Command failed: " + $Program + " " + $Arguments[0])
  return ($output | Out-String).Trim()
}
function Wrangler-Json([string[]]$CommandArguments) {
  $rawOutput = @(& npx.cmd --yes wrangler@4.165.0 @CommandArguments --json 2>&1)
  Need ($LASTEXITCODE -eq 0) 'Wrangler read-only JSON command failed; check existing Cloudflare login locally'
  $rawText = ($rawOutput | Out-String).Trim()
  try { return ,(ConvertFrom-Json -InputObject $rawText -Depth 80 -NoEnumerate) }
  catch { throw 'HOLD: Wrangler JSON output could not be parsed. Do not deploy.' }
}
function Get-Items($Value) {
  if ($Value -is [array]) { return @($Value) }
  foreach ($property in @('result','projects','deployments','items')) {
    if ($null -ne $Value -and $null -ne $Value.PSObject.Properties[$property]) {
      return Get-Items $Value.$property
    }
  }
  return @($Value)
}
function Property($Object,[string[]]$Names) {
  if ($null -eq $Object) { return $null }
  foreach ($n in $Names) {
    $p = $Object.PSObject.Properties | Where-Object { $_.Name -ieq $n } | Select-Object -First 1
    if ($p) { return $p.Value }
  }
  return $null
}
function Revision([string]$Url) {
  try {
    $r=Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 20 -MaximumRedirection 0 -UseBasicParsing
    Need ([int]$r.StatusCode -eq 200) ("Live root returned " + $r.StatusCode)
    return [string]$r.Headers['x-recipavo-commit']
  } catch { throw "HOLD: Cannot establish live release SHA from $Url. $($_.Exception.Message)" }
}

$resolvedRepo=(Resolve-Path -LiteralPath $Repo).Path
Need (Test-Path -LiteralPath (Join-Path $resolvedRepo '.git')) 'Local Git checkout missing'
$site=Join-Path $resolvedRepo 'site'
$dist=Join-Path $site 'dist'
$headerFile=Join-Path $dist '_headers'
Need (Test-Path -LiteralPath (Join-Path $site 'functions\api\feedback.ts')) 'Pages Function is missing from site/functions'
Need (Test-Path -LiteralPath $headerFile) 'Stamped build missing: site/dist/_headers'
$origin=(Run-External 'git' @('-C',$resolvedRepo,'remote','get-url','origin')).Trim()
Need ($origin -match '(?i)(?:github\.com[:/])ozirix-dev/Reseptit(?:\.git)?$') 'Wrong Git origin'
$currentSha=(Run-External 'git' @('-C',$resolvedRepo,'rev-parse','HEAD')).Trim()
Need ($currentSha -eq $ExpectedSha) "Local HEAD is $currentSha, not expected $ExpectedSha"
$remote=(Run-External 'git' @('-C',$resolvedRepo,'ls-remote','origin','refs/heads/main'))
$remoteSha=($remote -split '\s+')[0]
Need ($remoteSha -eq $ExpectedSha) "Remote main changed: $remoteSha. Rebuild and approve exact SHA."
$trackedDirty=(Run-External 'git' @('-C',$resolvedRepo,'status','--porcelain','--untracked-files=no'))
Need ([string]::IsNullOrWhiteSpace($trackedDirty)) 'Tracked worktree changes exist; preserve other sessions and use a clean release worktree.'
$headers=Get-Content -LiteralPath $headerFile -Raw
$matches=[regex]::Matches($headers,'(?im)^\s*X-Recipavo-Commit:[ \t]*([a-f0-9]{40})\s*$')
Need ($matches.Count -eq 1) 'Expected exactly one X-Recipavo-Commit in dist/_headers'
Need ($matches[0].Groups[1].Value -eq $ExpectedSha) 'Build artifact SHA differs from approved main SHA'
# Production must be built with RECIPAVO_BUILD_TARGET=production.
# A preview dist is noindex and must NEVER be repurposed for production.
Need (-not ($headers -match '(?im)^\s*X-Robots-Tag:\s*noindex\b')) 'Preview noindex header is present; build production target from scratch'
$homeHtml=Get-Content -LiteralPath (Join-Path $dist 'index.html') -Raw
Need ($homeHtml -notmatch '(?i)<meta[^>]+(?:name=["'']robots["''][^>]+content=["'']noindex|content=["'']noindex[^>]+name=["'']robots)') 'Preview noindex meta tag present in homepage'
Need ($homeHtml -match 'https://www\.recipavo\.com/') 'Homepage does not identify the production canonical origin'
$robots=Get-Content -LiteralPath (Join-Path $dist 'robots.txt') -Raw
Need ($robots -match 'https://www\.recipavo\.com/sitemap\.xml') 'Production robots sitemap URL missing'
$sitemap=Get-Content -LiteralPath (Join-Path $dist 'sitemap.xml') -Raw
Need ($sitemap -match 'https://www\.recipavo\.com/') 'Production sitemap origin missing'
$assets=@(Get-ChildItem -LiteralPath $dist -File -Recurse -Force)
Need ($assets.Count -gt 0 -and $assets.Count -le 20000) "Invalid Pages artifact count: $($assets.Count)"
foreach($file in $assets) {
  Need ($file.Length -le 25MB) ("Pages asset exceeds 25 MiB: " + $file.Name)
}
$projects=@(Get-Items (Wrangler-Json @('pages','project','list')))
$selection=@($projects | Where-Object { (Property $_ @('Project Name')) -eq $Project })
Need ($selection.Count -eq 1) "Cloudflare project '$Project' not found uniquely in authenticated account"
Need ((Property $selection[0] @('Git Provider')) -eq 'No') 'Expected Direct Upload Pages project'
$deployments=@(Get-Items (Wrangler-Json @('pages','deployment','list','--project-name',$Project,'--environment','production')))
$prod=@($deployments | Where-Object { (Property $_ @('Environment')) -eq 'Production' -and (Property $_ @('Branch')) -eq $ExpectedProductionBranch })
Need ($prod.Count -gt 0) "No existing deployment with Production/$ExpectedProductionBranch; refuse to bootstrap silently"
$recent=$prod | Select-Object -First 1
$cloudSha=[string](Property $recent @('Deployment'))
# Wrangler project list does not return authoritative production_branch.
# The operator must separately verify the project's actual setting from Cloudflare
# before passing -ProductionBranchVerified for a real production deployment.
if($Apply) {
  Need ($ProductionBranchVerified -and $ExpectedProductionBranch -eq 'production') 'Production branch not independently verified. Require explicit -ProductionBranchVerified after Cloudflare project-settings inspection.'
  Need ($FeedbackDisabledVerified) 'Feedback intake OFF not independently verified in Cloudflare production settings. Require explicit -FeedbackDisabledVerified only after inspection.'
}
$liveSha=Revision 'https://www.recipavo.com/'
Write-Host "Repository main : $remoteSha"
Write-Host "Artifact stamp  : $($matches[0].Groups[1].Value)"
Write-Host "Pages project   : $Project"
Write-Host "Existing production deployment branch: $ExpectedProductionBranch"
Write-Host "Cloudflare deployment summary: $cloudSha"
Write-Host "Live www SHA    : $liveSha"
if(-not $Apply) { Write-Host "Project production_branch not exposed by Wrangler project list; independent verification required before Apply." }
Write-Host "Artifact files  : $($assets.Count)"
if($liveSha -eq $ExpectedSha) {
  Write-Host 'NOOP: live site already serves the approved SHA. No deploy performed.'
  exit 0
}
if(-not $Apply) {
  Write-Host 'HOLD: preflight passed, live release is different. Re-run with -Apply after approving this exact SHA.'
  exit 0
}
if(-not $PSCmdlet.ShouldProcess("$Project ($ExpectedProductionBranch), www.recipavo.com", "Deploy approved $ExpectedSha with Wrangler")) {
  Write-Host 'HOLD: operator declined deployment.'
  exit 0
}
Push-Location $site
try {
  # Site directory is the Pages project root: Wrangler must discover site/functions.
  # Never use --branch main: that is a Preview branch in this Direct Upload project.
  & npx.cmd --yes wrangler@4.165.0 pages deploy $dist --project-name $Project --branch $ExpectedProductionBranch --commit-hash $ExpectedSha
  Need ($LASTEXITCODE -eq 0) 'Wrangler production deployment failed. No success claim.'
  & npm.cmd run verify:production -- $ExpectedSha 'https://www.recipavo.com' $dist
  Need ($LASTEXITCODE -eq 0) 'Post-deploy production verification failed: review Cloudflare deployment and rollback plan.'
  $after=Revision 'https://www.recipavo.com/'
  Need ($after -eq $ExpectedSha) 'Live revision header did not match approved SHA after deployment.'
  $get=Invoke-WebRequest -Uri 'https://www.recipavo.com/api/feedback' -Method Get -SkipHttpErrorCheck -TimeoutSec 15 -MaximumRedirection 0
  Need ($get.StatusCode -eq 405 -and $get.Content -match '"method_not_allowed"') 'Pages Function GET route was not installed or routed correctly.'
  Write-Host "PASS: Recipavo production serves approved $ExpectedSha and feedback GET returns 405."
  Write-Host 'Feedback POST intake was NOT enabled or tested; production privacy gates remain closed.'
} finally { Pop-Location }
