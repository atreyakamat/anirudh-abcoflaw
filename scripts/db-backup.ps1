# Database Backup Script for Law Practice CRM
# Performs logical pg_dump of Postgres database to local backup folder or S3

$ErrorActionPreference = "Stop"

$TIMESTAMP = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BACKUP_DIR = "./backups"
$BACKUP_FILE = "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
}

Write-Host "📦 Starting database backup to $BACKUP_FILE..." -ForegroundColor Cyan

# Check if pg_dump is available
if (Get-Command pg_dump -ErrorAction SilentlyContinue) {
    # If DATABASE_URL is set in environment
    if ($env:DIRECT_URL) {
        pg_dump $env:DIRECT_URL --clean --if-exists --file=$BACKUP_FILE
        Write-Host "✅ Database backup complete: $BACKUP_FILE" -ForegroundColor Green
    } else {
        Write-Host "⚠️ DIRECT_URL environment variable is not set. Please set it before running backup." -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️ pg_dump command not found on PATH. Ensure PostgreSQL client tools are installed." -ForegroundColor Yellow
}
