@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
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
call npm --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo  ERROR: npm is not available.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('call npm --version') do set NPM_VER=%%v
echo  OK: npm v%NPM_VER%

REM ─── Check environment ───────────────────────────────────────────────────────
echo  [3/5] Checking environment...
if not exist ".env.local" (
    color 0E
    echo  WARNING: .env.local not found. Creating from .env.example...
    if exist ".env.example" copy .env.example .env.local >nul 2>&1
    echo  Created .env.local. Add your Supabase credentials if needed.
    echo.
) else (
    echo  OK: .env.local present.
)

REM ─── Install dependencies ────────────────────────────────────────────────────
echo  [4/5] Checking dependencies...
if not exist "node_modules" (
    echo  node_modules not found. Installing dependencies...
    echo  This may take a few minutes on first run.
    echo.
    call npm install
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
start /b cmd /c "ping 127.0.0.1 -n 4 >nul && start http://localhost:3000"

call npm run dev

pause
