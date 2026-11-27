#Requires -Version 7.0
[CmdletBinding()]
param(
    [Parameter(Mandatory)][ValidateRange(1, [int]::MaxValue)][int] $PullRequest,
    [Parameter(Mandatory)][ValidatePattern('^[0-9a-f]{40}$')][string] $HeadSha,
    [Parameter(Mandatory)][ValidatePattern('^[0-9a-f]{40}$')][string] $BaseSha,
    [Parameter(Mandatory)][ValidateRange(1, [long]::MaxValue)][long] $ReleaseRun,
    [Parameter(Mandatory)][ValidateRange(1, [int]::MaxValue)][int] $ReleaseAttempt,
    [Parameter(Mandatory)][ValidateRange(1, [long]::MaxValue)][long] $CiRun,
    [Parameter(Mandatory)][ValidateRange(1, [int]::MaxValue)][int] $CiAttempt,
    [ValidateRange(0, 3600)][int] $WaitSeconds = 0
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $false
$repo = 'ozirix-dev/Reseptit'
$api = "repos/$repo"
$gh = (Get-Command gh -CommandType Application | Select-Object -First 1).Source
$baseUrl = "https://github.com/$repo"
$receiptRoot = Join-Path ([Environment]::GetFolderPath('LocalApplicationData')) 'Recipavo/Flow/v1'
$null = [IO.Directory]::CreateDirectory($receiptRoot)
$key = "$PullRequest-$HeadSha-$BaseSha-$ReleaseRun-$ReleaseAttempt-$CiRun-$CiAttempt"
$receiptPath = Join-Path $receiptRoot "$key.json"
$lockPath = Join-Path $receiptRoot "$PullRequest.lock"

function Read-GitHub {
    $arguments = $args
    foreach ($delay in @(0, 2, 5)) {
        if ($delay) { Start-Sleep -Seconds $delay }
        $lines = & $gh @arguments 2>$null
        if ($LASTEXITCODE -eq 0) { return ($lines -join [char]10) }
    }
    throw "GitHub read failed after three attempts ($($arguments[0])). Check connectivity and gh authentication."
}

function Read-Api([string] $Path) {
    Read-GitHub api --hostname github.com --method GET "$api/$Path" | ConvertFrom-Json
}

function Assert-CurrentRevision {
    $main = Read-Api 'git/ref/heads/main'
    $pr = Read-Api "pulls/$PullRequest"
    # GitHub's pull endpoint can retain an earlier base snapshot.
    if ($main.object.sha -cne $BaseSha -or $pr.state -ne 'open' -or
        $pr.head.sha -cne $HeadSha -or $pr.head.repo.full_name -ne $repo -or
        $pr.base.ref -ne 'main' -or $pr.base.repo.full_name -ne $repo) {
        throw "PR #$PullRequest or main changed. Obtain new pins from GitHub before retrying."
    }
}

function Read-Release {
    $run = Read-Api "actions/runs/$ReleaseRun"
    if ($run.repository.full_name -ne $repo -or
        $run.path -ne '.github/workflows/recipavo-production-manual.yml' -or
        $run.event -ne 'workflow_dispatch' -or $run.head_branch -ne 'main' -or
        $run.head_sha -cne $BaseSha -or $run.run_attempt -ne $ReleaseAttempt) {
        throw 'Production run does not match the pinned workflow, main SHA and attempt.'
    }
    return $run
}

function Read-RecipeSite {
    $run = Read-Api "actions/runs/$CiRun"
    if ($run.repository.full_name -ne $repo -or $run.head_repository.full_name -ne $repo -or
        $run.path -ne '.github/workflows/pages.yml' -or $run.event -ne 'pull_request' -or
        $run.head_sha -cne $HeadSha -or $run.run_attempt -ne $CiAttempt -or
        $PullRequest -notin @($run.pull_requests | ForEach-Object { $_.number })) {
        throw 'Recipe site run does not match the pinned workflow, PR, HEAD and attempt.'
    }
    return $run
}

function Get-LoggedSha([string] $Log, [string] $Name) {
    $pattern = '(?m)^build\tSelect risk-based checks\t[^\r\n]*[ \t]' + $Name + ':[ \t]+([0-9a-f]{40})[ \t]*\r?$'
    $matches = [regex]::Matches($Log, $pattern)
    if ($matches.Count -ne 1) { throw "Recipe site logs do not identify a unique $Name." }
    return $matches[0].Groups[1].Value
}

function Wait-ForSuccess([scriptblock] $ReadRun, [string] $WaitingState, [datetime] $Deadline) {
    do {
        $run = & $ReadRun
        if ($run.status -eq 'completed') {
            if ($run.conclusion -ne 'success') {
                throw "$WaitingState ended with GitHub conclusion '$($run.conclusion)'."
            }
            return $run
        }
        # Protected deployments wait for the existing Environment reviewer.
        if ($run.status -in @('waiting', 'action_required')) { return }
        $remaining = [Math]::Ceiling(($Deadline - [DateTime]::UtcNow).TotalSeconds)
        if ($remaining -le 0) { return }
        Start-Sleep -Seconds ([Math]::Min(10, $remaining))
    } while ($true)
}

try {
    $lock = [IO.File]::Open($lockPath, 'OpenOrCreate', 'ReadWrite', 'None')
} catch [IO.IOException] {
    if (($_.Exception.HResult -band 0xffff) -notin @(32, 33)) { throw }
    @{ state = 'BUSY'; pullRequest = $PullRequest } | ConvertTo-Json -Compress
    exit 3
}

try {
    Assert-CurrentRevision
    $deadline = [DateTime]::UtcNow.AddSeconds($WaitSeconds)
    $release = Wait-ForSuccess { Read-Release } 'Production release' $deadline
    if ($null -eq $release) {
        @{ state = 'WAITING_RELEASE'; run = "$baseUrl/actions/runs/$ReleaseRun/attempts/$ReleaseAttempt" } | ConvertTo-Json -Compress
        exit 3
    }

    $ci = Wait-ForSuccess { Read-RecipeSite } 'Recipe site' $deadline
    if ($null -eq $ci) {
        @{ state = 'WAITING_CI'; run = "$baseUrl/actions/runs/$CiRun/attempts/$CiAttempt" } | ConvertTo-Json -Compress
        exit 3
    }

    if (Test-Path -LiteralPath $receiptPath) {
        $receipt = Get-Content -LiteralPath $receiptPath -Raw | ConvertFrom-Json -AsHashtable
        if ($receipt.key -cne $key -or $receipt.state -ne 'CI_VERIFIED' -or
            $receipt.testedCommit -cnotmatch '^[0-9a-f]{40}$') {
            throw 'Existing receipt is invalid. Inspect it before trying again.'
        }
        Assert-CurrentRevision
        $receipt.reused = $true
        $receipt | ConvertTo-Json -Depth 4
        exit 0
    }

    $startedAt = [DateTime]::UtcNow.ToString('o')
    Write-Verbose "Checking GitHub release verification and exact Recipe site evidence for PR #$PullRequest."
    $releaseJobs = Read-Api "actions/runs/$ReleaseRun/attempts/$ReleaseAttempt/jobs"
    $promotion = @($releaseJobs.jobs | Where-Object name -EQ 'Approved production build and Wrangler promotion')
    $verification = @($promotion | ForEach-Object { $_.steps } |
        Where-Object name -EQ 'Verify production pages, SEO, assets, SHA and Functions GET 405')
    if ($promotion.Count -ne 1 -or $promotion[0].conclusion -ne 'success' -or
        $verification.Count -ne 1 -or $verification[0].conclusion -ne 'success') {
        throw 'Production verification did not run successfully in the pinned attempt.'
    }

    $log = Read-GitHub run view $CiRun --repo "github.com/$repo" --attempt $CiAttempt --log
    $testedBase = Get-LoggedSha $log 'BASE_SHA'
    $testedCommit = Get-LoggedSha $log 'HEAD_SHA'
    if ($testedBase -cne $BaseSha) { throw 'Recipe site tested a different main SHA.' }

    if ((Read-RecipeSite).conclusion -ne 'success' -or (Read-Release).conclusion -ne 'success') {
        throw 'One of the pinned attempts changed during verification.'
    }
    Assert-CurrentRevision

    $receipt = [ordered]@{
        state = 'CI_VERIFIED'
        key = $key
        pullRequest = "$baseUrl/pull/$PullRequest"
        headSha = $HeadSha
        baseSha = $BaseSha
        testedCommit = $testedCommit
        release = "$baseUrl/actions/runs/$ReleaseRun/attempts/$ReleaseAttempt"
        ci = "$baseUrl/actions/runs/$CiRun/attempts/$CiAttempt"
        releaseUpdatedAt = $release.updated_at
        startedAt = $startedAt
        verifiedAt = [DateTime]::UtcNow.ToString('o')
    }
    $json = $receipt | ConvertTo-Json -Depth 4
    [IO.File]::WriteAllText("$receiptPath.tmp", $json)
    [IO.File]::Move("$receiptPath.tmp", $receiptPath)
    $receipt.reused = $false
    $receipt | ConvertTo-Json -Depth 4
} finally {
    $lock.Dispose()
}
