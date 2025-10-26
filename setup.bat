@echo off
REM Bee Algorithm Platform - Windows Setup Script
REM This script automates the installation and setup process on Windows

echo 🐝 Bee Algorithm Platform - Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Please install Python 3.11+ from https://python.org/
    pause
    exit /b 1
)

REM Check if pip is installed
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] pip not found. Please install pip.
    pause
    exit /b 1
)

echo [SUCCESS] All prerequisites found
echo.

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
cd algoabcapp
if not exist package.json (
    echo [ERROR] package.json not found in algoabcapp directory
    pause
    exit /b 1
)

call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Frontend dependencies installed successfully
cd ..
echo.

REM Install backend dependencies
echo [INFO] Installing backend dependencies...
cd bee-fastapi
if not exist requirements.txt (
    echo [ERROR] requirements.txt not found in bee-fastapi directory
    pause
    exit /b 1
)

call pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Backend dependencies installed successfully
cd ..
echo.

REM Create environment file
echo [INFO] Creating environment configuration...
if not exist algoabcapp\.env.local (
    echo NEXT_PUBLIC_BEE_API=http://localhost:8001 > algoabcapp\.env.local
    echo [SUCCESS] Environment file created: algoabcapp\.env.local
) else (
    echo [WARNING] Environment file already exists: algoabcapp\.env.local
)
echo.

REM Verify installation
echo [INFO] Verifying installation...
if exist algoabcapp\node_modules (
    echo [SUCCESS] Frontend dependencies verified
) else (
    echo [ERROR] Frontend dependencies not found
    pause
    exit /b 1
)

python -c "import fastapi, uvicorn, pydantic, numpy" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Backend dependencies not found
    pause
    exit /b 1
) else (
    echo [SUCCESS] Backend dependencies verified
)
echo.

echo [SUCCESS] Setup completed successfully! 🎉
echo.
echo Next steps:
echo 1. Start the backend: cd bee-fastapi ^&^& uvicorn main:app --reload --port 8001
echo 2. Start the frontend: cd algoabcapp ^&^& npm run dev
echo 3. Or use: make dev (if you have Make installed)
echo.
echo Access the application:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8001
echo - API Docs: http://localhost:8001/docs
echo.
echo For more information, see REQUIREMENTS.md
echo.
pause
