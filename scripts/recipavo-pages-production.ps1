# [Chat 1] SHA-locked Recipavo Pages deploy; inspection is the default.
# Run in PowerShell 7 with an authenticated existing Wrangler account.
# Never turns on feedback/D1/Turnstile/Cron/WAF.
[CmdletBinding(SupportsShouldProcess=$true, ConfirmImpact='High')]
param(
  [Parameter(Mandatory=$true)][ValidatePattern('^[a-f0-9]{40}$')][string]$ExpectedSha,
  [string]$Repo = 'D:\Projects\Products\Reseptit',
  [string]$Project = 'recipavo-site',
  [string]$ExpectedProductionBranch = 'production',
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
function Wrangler-Json([string[]]$Arguments) {
  $text = Run-External 'npx.cmd' (@('--yes','wrangler@4.165.0') + $Arguments + @('--json'))
  try { return ConvertFrom-Json -InputObject $text -Depth 80 }
  catch { throw 'HOLD: Cloudflare Wrangler returned non-JSON; verify login and account locally without exposing tokens.' }
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
$assets=@(Get-ChildItem -LiteralPath $dist -File -Recurse -Force)
Need ($assets.Count -gt 0 -and $assets.Count -le 20000) "Invalid Pages artifact count: $($assets.Count)"
foreach($file in $assets) {
  Need ($file.Length -le 25MB) ("Pages asset exceeds 25 MiB: " + $file.Name)
}
$projects=Get-Items (Wrangler-Json @('pages','project','list'))
$selection=@($projects | Where-Object { (Property $_ @('name','Name')) -eq $Project })
Need ($selection.Count -eq 1) "Cloudflare project '$Project' not found uniquely in authenticated account"
$productionBranch=[string](Property $selection[0] @('production_branch','productionBranch','Production Branch'))
Need ($productionBranch -eq $ExpectedProductionBranch) "Cloudflare production branch is '$productionBranch', expected '$ExpectedProductionBranch'. Do NOT deploy."
$deployments=Get-Items (Wrangler-Json @('pages','deployment','list','--project-name',$Project))
$prod=@($deployments | Where-Object { (Property $_ @('Environment','environment')) -eq 'Production' })
Need ($prod.Count -gt 0) "No existing Production deployment; refuse to bootstrap a project silently."
$recent=$prod | Select-Object -First 1
$meta=Property (Property $recent @('deployment_trigger','deploymentTrigger')) @('metadata','Metadata')
$cloudSha=[string](Property $meta @('commit_hash','commitHash','commit'))
$liveSha=Revision 'https://www.recipavo.com/'
Write-Host "Repository main : $remoteSha"
Write-Host "Artifact stamp  : $($matches[0].Groups[1].Value)"
Write-Host "Pages project   : $Project"
Write-Host "Production branch: $productionBranch"
Write-Host "Cloudflare listed SHA: $cloudSha"
Write-Host "Live www SHA    : $liveSha"
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
