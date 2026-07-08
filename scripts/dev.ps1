param(
  [switch]$Backend,
  [switch]$Frontend
)

if (-not $Backend -and -not $Frontend) {
  Write-Host "Use -Backend or -Frontend to start a specific app."
  exit 1
}

if ($Backend) {
  npm run dev -w backend
}

if ($Frontend) {
  npm run dev -w frontend
}
