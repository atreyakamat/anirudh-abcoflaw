@echo off
echo ========================================================
echo Starting AB & Co. Legal - Local Development Environment
echo ========================================================

echo.
echo Installing dependencies...
call npm install

echo.
echo Generating Prisma Client...
call npx prisma generate

echo.
echo Starting all services...
echo (This will start Frontend, Backend, and other necessary processes)
call npm run dev
