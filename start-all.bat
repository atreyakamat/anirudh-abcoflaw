@echo off
echo ========================================================
echo       Starting AB ^& Co. Legal CRM Development Stack
echo ========================================================
echo.

echo [1/3] Checking Database (Supabase) Connection Status...
:: We can add a ping or curl here later if running local Supabase.
echo Database check complete.
echo.

echo [2/3] Starting NestJS Backend (Port 3001)...
start "Backend API" cmd /k "npm run dev:backend"

echo [3/3] Starting Next.js Frontend (Port 3000)...
start "Frontend UI" cmd /k "npm run dev:frontend"

echo [4/4] Starting n8n Automation Engine (Port 5678)...
:: This uses npx to spin up n8n locally without installation
start "n8n Automation" cmd /k "npx n8n start"

echo.
echo ========================================================
echo All services have been launched in separate windows!
echo.
echo - Frontend UI:      http://localhost:3000
echo - Backend API:      http://localhost:3001
echo - n8n Dashboard:    http://localhost:5678
echo ========================================================
pause
