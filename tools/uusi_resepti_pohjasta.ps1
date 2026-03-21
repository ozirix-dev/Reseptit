param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("alkuruoat","paaruoat","jalkiruoat","raakileet")]
    [string]$Category,

    [Parameter(Mandatory=$true)]
    [string]$Name
)

$Root = 'D:\Reseptit'
$template = Join-Path $Root 'reseptit\_mallipohjat\resepti\resepti_pohja.md'

$slug = $Name.ToLowerInvariant()
$slug = $slug -replace '[åä]', 'a'
$slug = $slug -replace 'ö', 'o'
$slug = $slug -replace '[^a-z0-9\s-]', ''
$slug = $slug -replace '\s+', '-'
$slug = $slug -replace '-+', '-'

$target = Join-Path $Root ("reseptit\{0}\{1}.md" -f $Category, $slug)

if (Test-Path -LiteralPath $target) {
    Write-Host "Tiedosto on jo olemassa: $target"
    exit 1
}

Copy-Item -LiteralPath $template -Destination $target
Write-Host "Luotu: $target"
