@echo off
cd /d "%~dp0"
title Arogyan Hospital — Stop Development Server

echo.
echo  ================================================
echo   AROGYAN NURSING HOSPITAL — Stopping Server
echo  ================================================
echo.

echo  Searching for Next.js development server processes...

REM Kill Node.js processes running next dev on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000"') do (
    set PID=%%a
    if defined PID (
        echo  Killing process on port 3000 (PID: %%a)
        taskkill /f /pid %%a >nul 2>&1
    )
)

REM Also try killing by process name (next-server)
taskkill /f /im node.exe /fi "WINDOWTITLE eq Arogyan*" >nul 2>&1

echo  Done. Development server stopped (if it was running).
echo.

timeout /t 2 /nobreak >nul
