param(
  [Parameter(Mandatory = $true)]
  [string]$Title,

  [string]$SummaryText = '',

  [string[]]$ValidationCommands = @(),

  [string[]]$ExtraFiles = @(),

  [ValidateSet('auto', 'staged', 'changed', 'explicit')]
  [string]$FileMode = 'auto',

  [bool]$OpenInNotepad = $false
)

$scriptVersion = '1.0-lite'
$projectRoot = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $projectRoot 'tmp'

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$stamp = Get-Date -Format 'yyyy-MM-dd_HH-mm'
$reportPath = Join-Path $outDir "codex_report_$stamp.md"

function Get-CleanText {
  param([AllowNull()][string]$Text)

  if ($null -eq $Text) { return '' }

  $ansiPattern = [string]([char]27) + '\[[0-9;?]*[ -/]*[@-~]'
  $clean = [regex]::Replace($Text, $ansiPattern, '')
  return $clean.TrimEnd()
}

function Invoke-GitText {
  param([Parameter(Mandatory = $true)][string[]]$Arguments)

  $output = & git @Arguments 2>&1 | Out-String
  $exitCode = if ($null -ne $LASTEXITCODE) { [int]$LASTEXITCODE } else { 0 }
  $cleanOutput = Get-CleanText $output

  if ($exitCode -ne 0) {
    $details = if ([string]::IsNullOrWhiteSpace($cleanOutput)) { '[no output]' } else { $cleanOutput }
    throw "git $($Arguments -join ' ') failed with exit code $exitCode.`n$details"
  }

  return $cleanOutput
}

function Get-PathListFromGit {
  param([Parameter(Mandatory = $true)][string[]]$Arguments)

  $text = Invoke-GitText -Arguments $Arguments
  if ([string]::IsNullOrWhiteSpace($text)) { return @() }

  return $text -split "`r?`n" | Where-Object { $_.Trim().Length -gt 0 }
}

function Normalize-List {
  param([AllowNull()][string[]]$Items)

  if ($null -eq $Items -or $Items.Count -eq 0) { return @() }

  return @(
    $Items |
    Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
    ForEach-Object { $_.Replace('\\', '/').Trim() } |
    Sort-Object -Unique
  )
}

function Test-IncludedPath {
  param([Parameter(Mandatory = $true)][string]$Path)

  $p = $Path.Replace('\\', '/').Trim()
  if ([string]::IsNullOrWhiteSpace($p)) { return $false }
  if ($p -match '^tmp/') { return $false }
  if ($p -match '^omatmuistiinpanot/') { return $false }
  if ($p -match '^node_modules/') { return $false }
  if ($p -match '^dist/') { return $false }
  if ($p -match '^build/') { return $false }
  if ($p -match '^coverage/') { return $false }
  if ($p -match '^\.git/') { return $false }
  if ($p -match '^\.vs/') { return $false }
  return $true
}

function Get-SelectedFiles {
  param(
    [string]$Mode,
    [string[]]$Extra
  )

  $staged = Get-PathListFromGit -Arguments @('diff', '--cached', '--name-only')
  $changed = Get-PathListFromGit -Arguments @('diff', '--name-only')
  $untracked = Get-PathListFromGit -Arguments @('ls-files', '--others', '--exclude-standard')

  $selected = @()

  switch ($Mode) {
    'staged' { $selected += $staged }
    'changed' {
      $selected += $changed
      $selected += $untracked
    }
    'explicit' { $selected += $Extra }
    default {
      $selected += $staged
      $selected += $changed
      $selected += $untracked
    }
  }

  if ($Mode -ne 'explicit') {
    $selected += $Extra
  }

  return @(
    $selected |
    ForEach-Object { $_.Replace('\\', '/') } |
    Where-Object { Test-IncludedPath $_ } |
    Sort-Object -Unique
  )
}

function New-BulletBlock {
  param([string[]]$Items)

  if (-not $Items -or $Items.Count -eq 0) { return '- None' }

  return ($Items | ForEach-Object { "- $_" }) -join "`r`n"
}

function New-FencedSectionLines {
  param(
    [Parameter(Mandatory = $true)][string]$Heading,
    [AllowNull()][string]$Content
  )

  $safeContent = if ([string]::IsNullOrWhiteSpace($Content)) { '[empty]' } else { $Content }
  return @(
    ''
    "## $Heading"
    ''
    '```text'
  ) + ($safeContent -split "`r?`n") + @(
    '```'
  )
}

function Invoke-ValidationCommands {
  param([string[]]$Commands)

  $commands = Normalize-List -Items $Commands
  if ($commands.Count -eq 0) {
    return [pscustomobject]@{ Status = 'not run'; Results = @() }
  }

  $results = @()
  $overallStatus = 'success'

  foreach ($command in $commands) {
    $output = & pwsh -NoProfile -ExecutionPolicy Bypass -Command $command 2>&1 | Out-String
    $exitCode = if ($null -ne $LASTEXITCODE) { [int]$LASTEXITCODE } else { 0 }
    $cleanOutput = Get-CleanText $output

    $results += [pscustomobject]@{
      Command = $command
      ExitCode = $exitCode
      Status = $(if ($exitCode -eq 0) { 'success' } else { 'failed' })
      Output = $cleanOutput
    }

    if ($exitCode -ne 0) {
      $overallStatus = 'failed'
      break
    }
  }

  return [pscustomobject]@{ Status = $overallStatus; Results = $results }
}

Push-Location $projectRoot

$branch = Invoke-GitText -Arguments @('rev-parse', '--abbrev-ref', 'HEAD')
$head = Invoke-GitText -Arguments @('rev-parse', '--short', 'HEAD')
$selectedFiles = Get-SelectedFiles -Mode $FileMode -Extra $ExtraFiles
$validationResult = Invoke-ValidationCommands -Commands $ValidationCommands
$gitStatus = Invoke-GitText -Arguments @('status', '--short')
$gitDiffStat = Invoke-GitText -Arguments @('diff', '--stat')
$gitCachedStat = Invoke-GitText -Arguments @('diff', '--cached', '--stat')

$reportLines = @(
  '# Codex report'
  ''
  '## Script version'
  $scriptVersion
  ''
  '## Task'
  $Title
  ''
  '## Timestamp'
  $stamp
  ''
  '## Branch'
  $branch
  ''
  '## HEAD'
  $head
  ''
  '## File selection mode'
  $FileMode
  ''
  '## Codex summary'
  $(if ([string]::IsNullOrWhiteSpace($SummaryText)) { '[no summary]' } else { $SummaryText })
  ''
  '## Files included'
  (New-BulletBlock -Items $selectedFiles)
  ''
  '## Validation overall status'
  $validationResult.Status
)

foreach ($validation in $validationResult.Results) {
  $reportLines += @(
    ''
    "### Validation: $($validation.Status)"
    ''
    ('**Command:** ' + $validation.Command)
    ''
  )

  $reportLines += New-FencedSectionLines -Heading 'Validation output' -Content $validation.Output
}

$reportLines += New-FencedSectionLines -Heading 'git status --short' -Content $gitStatus
$reportLines += New-FencedSectionLines -Heading 'git diff --stat' -Content $gitDiffStat
$reportLines += New-FencedSectionLines -Heading 'git diff --cached --stat' -Content $gitCachedStat

$reportLines | Set-Content -Path $reportPath -Encoding UTF8

if ($OpenInNotepad) {
  notepad $reportPath
}

Write-Host ('Created report: ' + $reportPath) -ForegroundColor Green

if ($validationResult.Status -eq 'failed') {
  Pop-Location
  exit 1
}

Pop-Location
