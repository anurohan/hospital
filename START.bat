@echo off
setlocal enabledelayedexpansion
title Arogyan Hospital — Start Development Server

color 0B
echo.
echo  ================================================
echo   AROGYAN NURSING HOSPITAL — Dev Server
echo   Hospital Management SaaS
echo  ================================================
echo.

REM ─── Check Node.js ───────────────────────────────────────────────────────────
echo  [1/5] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo  ERROR: Node.js is not installed or not in PATH.
    echo  Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do set NODE_VER=%%v
echo  OK: Node.js %NODE_VER%

REM ─── Check npm ───────────────────────────────────────────────────────────────
echo  [2/5] Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo  ERROR: npm is not available.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('npm --version') do set NPM_VER=%%v
echo  OK: npm v%NPM_VER%

REM ─── Check environment ───────────────────────────────────────────────────────
echo  [3/5] Checking environment...
if not exist ".env.local" (
    color 0E
    echo  WARNING: .env.local not found.
    echo  Copy .env.example to .env.local and add your Supabase credentials.
    echo  The app will start but Supabase features will not work.
    echo.
)

REM ─── Install dependencies ────────────────────────────────────────────────────
echo  [4/5] Checking dependencies...
if not exist "node_modules" (
    echo  node_modules not found. Installing dependencies...
    echo  This may take a few minutes on first run.
    echo.
    npm install
    if %errorlevel% neq 0 (
        color 0C
        echo  ERROR: npm install failed. Check your network connection.
        pause
        exit /b 1
    )
    echo  Dependencies installed successfully.
) else (
    echo  OK: node_modules present.
)

REM ─── Start server ────────────────────────────────────────────────────────────
echo  [5/5] Starting Next.js development server...
echo.
color 0A
echo  ================================================
echo   Server starting at http://localhost:3000
echo   Press Ctrl+C to stop the server.
echo  ================================================
echo.

REM Open browser after a short delay
start /b cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

npm run dev

pause
