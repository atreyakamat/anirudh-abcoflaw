@echo off
echo ========================================================
echo Starting AB & Co. Legal - Docker Environment
echo ========================================================

echo.
echo Building and starting containers via Docker Compose...
docker compose up --build -d

echo.
echo Containers are starting in the background.
echo You can view logs with: docker compose logs -f
echo.
echo Services will be available at:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:3001/api/v1
echo - Backend Swagger Docs: http://localhost:3001/api/v1/docs
