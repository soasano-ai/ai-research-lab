param([Parameter(Mandatory=$true)][string]$VaultPath)
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$source = Join-Path $repo 'obsidian'
$target = Join-Path $VaultPath 'AI_Research_Lab\00_GitHub_Materials'
if (-not (Test-Path -LiteralPath $VaultPath -PathType Container)) { throw 'Vault path does not exist' }
if (-not (Test-Path -LiteralPath (Join-Path $repo '.git'))) { throw 'Please clone repository with git before using this script' }
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git not installed' }
Push-Location $repo
try {
  git pull --ff-only
  if ($LASTEXITCODE -ne 0) { throw 'Git update failed. Sync stopped.' }
} finally { Pop-Location }
if (-not (Test-Path -LiteralPath $source)) { throw 'Source directory not found' }
New-Item -ItemType Directory -Path $target -Force | Out-Null
Get-ChildItem -LiteralPath $source -Filter '*.md' -File -Recurse | ForEach-Object {
  $relative = $_.FullName.Substring($source.Length).TrimStart([char]'\', [char]'/')
  $dest = Join-Path $target $relative
  New-Item -ItemType Directory -Path (Split-Path -Parent $dest) -Force | Out-Null
  Copy-Item -LiteralPath $_.FullName -Destination $dest -Force
}
Write-Output "Public learning materials synced to $target"
