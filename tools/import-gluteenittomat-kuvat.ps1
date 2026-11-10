#requires -Version 7.0
<#
.SYNOPSIS
  Import the 5 approved illustration bytes from gluteenittomat_viisi_kuvaa.zip
  to this PR's GitHub branch in ONE atomic commit.
.DESCRIPTION
  Safe for the PR owner (one writer): checks repo, branch and exact source hashes,
  verifies WebP 1500x1000 headers and creates one Git tree+commit using gh CLI.
  Never touches main or modifies checked-out files.
.EXAMPLE
  pwsh tools/import-gluteenittomat-kuvat.ps1 -ZipPath C:\Users\YOU\Downloads\gluteenittomat_viisi_kuvaa.zip
#>
param(
  [Parameter(Mandatory = $true)] [string] $ZipPath,
  [string] $Branch = "editorial/gf-five-drafts-20261110"
)
$ErrorActionPreference = "Stop"
$repo = "ozirix-dev/Reseptit"
$prNumber = 422
$expected = [ordered]@{
  "gluteeniton-perunajauhokakkupohja.webp" = "f9fa50e561f3803554829a6a6c1c77fcf1b609785a38a2d993d3d83e8e045637"
  "gluteeniton-siemenvuokaleipa.webp" = "903cbd3252b22ba58cd03d7d0edcd4f61dda58cc4e3e76f4e4ce3a416cb0cc99"
  "gluteeniton-uunipannukakku.webp" = "b28b2c7eff01ea475553b44205ed6d4c941d02afa12dbe8636be7473a6405b1b"
  "gluteenittomat-kauralesesampylat.webp" = "251d501a36f7f78fe9501a864cd60e53f441a03bb63de51aab4afed38b350e25"
  "gluteeniton-durrapizzapohja.webp" = "ec6154968f21d7c690308daad623244c1dda66d154c46d6da9a4b5653eaf7c0f"
}
if (-not (Test-Path -LiteralPath $ZipPath -PathType Leaf)) { throw "ZIP not found: $ZipPath" }
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw "GitHub CLI (gh) is required. Install and authenticate it first." }
$origin = & git remote get-url origin
if ($LASTEXITCODE -ne 0 -or $origin -notmatch '(^|[:/])ozirix-dev/Reseptit(\.git)?$') { throw "Wrong Git origin; expected $repo" }
$localBranch = & git branch --show-current
if ($localBranch -ne $Branch) { throw "Wrong local branch $localBranch; use an isolated worktree of $Branch" }
function Read-Gh([string] $path) {
  $raw = & gh api $path
  if ($LASTEXITCODE -ne 0) { throw "gh api GET failed: $path" }
  return ($raw | ConvertFrom-Json)
}
function Write-Gh([string] $path, [string] $method, [object] $payload) {
  $tmp = [IO.Path]::GetTempFileName()
  try {
    $json = $payload | ConvertTo-Json -Depth 12 -Compress
    [IO.File]::WriteAllText($tmp,$json,[Text.UTF8Encoding]::new($false))
    $raw = & gh api -X $method $path --input $tmp
    if ($LASTEXITCODE -ne 0) { throw "gh api $method failed: $path" }
    return ($raw | ConvertFrom-Json)
  } finally { Remove-Item -LiteralPath $tmp -ErrorAction SilentlyContinue }
}
$pr = Read-Gh "repos/$repo/pulls/$prNumber"
if ($pr.state -ne "open" -or -not $pr.draft -or $pr.head.ref -ne $Branch) { throw "PR ownership/stage changed; stop" }
$ref = Read-Gh "repos/$repo/git/ref/heads/$Branch"
$headSha = [string]$ref.object.sha
if ($headSha -ne [string]$pr.head.sha) { throw "PR HEAD differs from branch head; stop" }
$commit = Read-Gh "repos/$repo/git/commits/$headSha"
$treeSha = [string]$commit.tree.sha
Add-Type -AssemblyName System.IO.Compression
$zip = [IO.Compression.ZipFile]::OpenRead((Resolve-Path $ZipPath).Path)
$entries = [System.Collections.Generic.List[object]]::new()
$shaAlgo = [System.Security.Cryptography.SHA256]::Create()
try {
  foreach ($file in $expected.Keys) {
    $member = $zip.GetEntry($file)
    if ($null -eq $member) { throw "Missing ZIP entry: $file" }
    $stream = $member.Open()
    $memory = [IO.MemoryStream]::new()
    try { $stream.CopyTo($memory); $bytes=$memory.ToArray() }
    finally { $memory.Dispose();$stream.Dispose() }
    $hash=([BitConverter]::ToString($shaAlgo.ComputeHash($bytes))).Replace('-','').ToLowerInvariant()
    if ($hash -ne $expected[$file]) { throw "SHA-256 mismatch: $file" }
    if ($bytes.Length -lt 30 -or [Text.Encoding]::ASCII.GetString($bytes,0,4) -ne 'RIFF' -or
        [Text.Encoding]::ASCII.GetString($bytes,8,4) -ne 'WEBP' -or
        [Text.Encoding]::ASCII.GetString($bytes,12,4) -ne 'VP8 ' -or
        $bytes[23] -ne 0x9d -or $bytes[24] -ne 0x01 -or $bytes[25] -ne 0x2a) {
      throw "Invalid or unsupported VP8 WebP header: $file"
    }
    $width=([BitConverter]::ToUInt16($bytes,26) -band 0x3fff)
    $height=([BitConverter]::ToUInt16($bytes,28) -band 0x3fff)
    if ($width -ne 1500 -or $height -ne 1000) { throw "Image dimensions invalid: $file $width x $height" }
    $dest="kuvat/" + ($(if ($file -match 'pizzapohja|vuokaleipa|sampylat') {'leivonnaiset'} else {'jalkiruoat'})) + "/" + $file
    # Avoid overwriting existing images; the archive is a one-shot source package.
    $existing=& gh api "repos/$repo/contents/$dest" 2>$null
    if ($LASTEXITCODE -eq 0) { throw "Image already exists at $dest; no overwrite" }
    $blob=Write-Gh "repos/$repo/git/blobs" "POST" @{content=[Convert]::ToBase64String($bytes);encoding="base64"}
    $entries.Add(@{path=$dest;mode="100644";type="blob";sha=[string]$blob.sha})
    Write-Host "Verified / prepared $file ($width x $height)"
  }
} finally { $zip.Dispose();$shaAlgo.Dispose() }
$remote=Read-Gh "repos/$repo/git/ref/heads/$Branch"
if ([string]$remote.object.sha -ne $headSha) { throw "Branch moved during upload; stop without updating ref" }
$newTree=Write-Gh "repos/$repo/git/trees" "POST" @{base_tree=$treeSha;tree=@($entries.ToArray())}
$newCommit=Write-Gh "repos/$repo/git/commits" "POST" @{message="assets: add five vetted gluten-free WebP illustrations";tree=[string]$newTree.sha;parents=@($headSha)}
$last=Read-Gh "repos/$repo/git/ref/heads/$Branch"
if ([string]$last.object.sha -ne $headSha) { throw "Branch moved before commit; stop" }
$updated=Write-Gh "repos/$repo/git/refs/heads/$Branch" "PATCH" @{sha=[string]$newCommit.sha;force=$false}
if (-not $updated.object.sha -or [string]$updated.object.sha -ne [string]$newCommit.sha) { throw "Could not verify branch update" }
Write-Host "Done: $($newCommit.sha). Check GitHub Actions on PR #$prNumber. Do not merge until nutrition/product and recipe review gates pass."
