$BASE = "http://localhost:3001/api/v1"
Write-Host "===================================================="
Write-Host "  AB & CO. CRM MASTER CHAOS & EDGE CASE TEST SUITE  "
Write-Host "===================================================="

function Test-Endpoint {
    param (
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [string]$Body = $null,
        [hashtable]$Headers = @{},
        [int]$ExpectedStatus
    )
    try {
        $p = @{
            Uri = $Url
            Method = $Method
            ContentType = "application/json"
            UseBasicParsing = $true
        }
        if ($Body) { $p.Body = $Body }
        if ($Headers.Count -gt 0) { $p.Headers = $Headers }

        $res = Invoke-WebRequest @p
        $code = [int]$res.StatusCode
    } catch {
        if ($_.Exception.Response) {
            $code = [int]$_.Exception.Response.StatusCode
        } else {
            $code = 500
        }
    }
    $pass = if ($code -eq $ExpectedStatus) { "PASS" } else { "FAIL" }
    Write-Host "[$pass] $Name -> Got HTTP $code (Expected: $ExpectedStatus)"
}

# 1. SQL Injection Attack Payload Test
$sqliBody = @{ username = "' OR 1=1 --"; password = "password123" } | ConvertTo-Json
Test-Endpoint -Name "Phase 1: SQL Injection Login Payload" -Url "$BASE/auth/login" -Method POST -Body $sqliBody -ExpectedStatus 401

# 2. Empty Body Validation Test
Test-Endpoint -Name "Phase 1: Empty Auth Payload" -Url "$BASE/auth/login" -Method POST -Body "{}" -ExpectedStatus 400

# 3. Invalid Appointment Booking Payload Test
$badBooking = @{ firstName = ""; email = "not-an-email" } | ConvertTo-Json
Test-Endpoint -Name "Phase 2: Invalid Booking Payload" -Url "$BASE/appointments" -Method POST -Body $badBooking -ExpectedStatus 400

# 4. Valid Appointment Booking Payload Test
$bookingObj = @{
    firstName = "ChaosClient"
    lastName = "Tester"
    email = "chaos.test@example.com"
    phone = "+919999222333"
    description = "Legal request test payload"
    preferredDate = "2026-09-15"
    preferredTime = "11:00"
    practiceArea = "Corporate Law"
} | ConvertTo-Json
Test-Endpoint -Name "Phase 2 & 3: Valid Booking & Client Creation" -Url "$BASE/appointments" -Method POST -Body $bookingObj -ExpectedStatus 201

# 5. Malformed JWT Token Test
Test-Endpoint -Name "Phase 1 & 9: Malformed Bearer Token" -Url "$BASE/appointments/nonexistent-id" -Method GET -Headers @{ Authorization = "Bearer malformed.jwt.fake" } -ExpectedStatus 401

# 6. Unauthenticated Admin Action Test (IDOR Protection)
Test-Endpoint -Name "Phase 12 & 13: Unauthenticated Admin Clients Access" -Url "$BASE/clients" -Method GET -ExpectedStatus 401

Write-Host "===================================================="
Write-Host "  CHAOS TEST SUITE COMPLETED SUCCESSFULLY          "
Write-Host "===================================================="
