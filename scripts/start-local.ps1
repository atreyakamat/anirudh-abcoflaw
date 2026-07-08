Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Write-Host 'Preparing local database...'
npm run db:prepare

Write-Host 'Starting backend and frontend in separate windows...'
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'Set-Location ''G:\Projects\anirudh-abcoflaw''; npm run dev:backend'
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'Set-Location ''G:\Projects\anirudh-abcoflaw''; npm run dev:frontend'
