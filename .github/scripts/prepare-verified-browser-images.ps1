$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($env:GITHUB_ENV)) {
    throw 'GITHUB_ENV is required'
}

$python = if ($IsWindows) { 'python' } else { 'python3' }

$manifest = 'assets/images.manifest.json'
$data = Get-Content -LiteralPath $manifest -Raw | ConvertFrom-Json -AsHashtable
if ($env:IMAGE_CI_PUBLIC_ONLY -eq 'true') {
    $env:IMAGE_CI_ACCESS_KEY_ID = ''
    $env:IMAGE_CI_SECRET_ACCESS_KEY = ''
    $env:IMAGE_CI_SESSION_TOKEN = ''
    $data['ci']['mode'] = 'public'
    $manifest = Join-Path $env:RUNNER_TEMP 'browser-public-image-inputs.json'
    [IO.File]::WriteAllText($manifest, ($data | ConvertTo-Json -Depth 100), [Text.UTF8Encoding]::new($false))
}

$json = & $python -B site/scripts/restore-image-inputs.py --manifest $manifest --project ozirix-dev/Reseptit --auto-root kuvat
if ($LASTEXITCODE -ne 0) {
    $json | Write-Host
    exit $LASTEXITCODE
}

$result = ($json -join "`n") | ConvertFrom-Json
if ($result.status -ne 'PASS' -or [string]::IsNullOrWhiteSpace($result.imageRoot) -or $result.imageRoot -match "[`r`n]") {
    throw 'Image inputs did not return a safe verified root'
}

& $python -B site/scripts/verified_image_overlay.py --manifest assets/images.tracked-overlays.json --source-root kuvat --image-root $result.imageRoot --mode apply
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Add-Content -LiteralPath $env:GITHUB_ENV -Value "PROJECT_IMAGE_ROOT=$($result.imageRoot)"
Write-Host "Verified $($result.files) manifest image inputs (mode=$($data['ci']['mode']))"
