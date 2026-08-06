$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "AB AND CO. LEGAL - LIVE RUNTIME VERIFICATION EXECUTION" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Health and Probes
Write-Host "`n1. Testing Health and Kubernetes Probes..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/health" -Method Get
Write-Host "   Health Status: $($health.status) | DB: $($health.services.database) | Uptime: $($health.uptime)s | Memory: $($health.memory.heapUsedMB)MB" -ForegroundColor Green

$live = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/health/live" -Method Get
Write-Host "   Liveness Probe: $($live.status)" -ForegroundColor Green

$ready = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/health/ready" -Method Get
Write-Host "   Readiness Probe: $($ready.status) | DB: $($ready.database)" -ForegroundColor Green

$version = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/health/version" -Method Get
Write-Host "   Version Metadata: $($version.name) v$($version.version) ($($version.environment))" -ForegroundColor Green

# 2. Public Visitor Booking Flow (Dynamic Time Slot)
Write-Host "`n2. Executing Public Visitor Booking Flow..." -ForegroundColor Yellow
$rand = Get-Random -Minimum 1000 -Maximum 9999
$bookingPayload = @{
    firstName = "Visual"
    lastName = "Verification"
    email = "visual$rand@example.com"
    phone = "+91987654$rand"
    practiceArea = "Corporate Law"
    preferredDate = "2026-08-20"
    preferredTime = "15:00"
    description = "Need corporate contract consultation"
} | ConvertTo-Json

$bookingRes = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/appointments" -Method Post -Body $bookingPayload -ContentType "application/json"
Write-Host "   Booking Created: ID $($bookingRes.data.id) | Ref: $($bookingRes.data.referenceNumber) | Status: $($bookingRes.data.status)" -ForegroundColor Green

# 3. Client Portal OTP Workflow
Write-Host "`n3. Executing Client Portal OTP Login Workflow..." -ForegroundColor Yellow
$otpPayload = @{ phone = "+91987654$rand" } | ConvertTo-Json
$otpRes = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/portal/send-otp" -Method Post -Body $otpPayload -ContentType "application/json"
Write-Host "   OTP Sent: Dev OTP Code is $($otpRes.data.devOtp)" -ForegroundColor Green

$verifyPayload = @{ phone = "+91987654$rand"; code = $otpRes.data.devOtp } | ConvertTo-Json
$verifyRes = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/portal/verify-otp" -Method Post -Body $verifyPayload -ContentType "application/json"
Write-Host "   Portal OTP Verified! Token issued for Client: $($verifyRes.data.client.firstName) $($verifyRes.data.client.lastName)" -ForegroundColor Green

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "ALL RUNTIME USER JOURNEYS AND AUTOMATION TESTS PASSED!" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
