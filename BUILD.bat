@echo off
setlocal enabledelayedexpansion
title Arogyan Hospital — Production Build

color 0B
echo.
echo  ================================================
echo   AROGYAN NURSING HOSPITAL — Production Build
echo  ================================================
echo.

set BUILD_STATUS=0

REM ─── Check Node / npm ────────────────────────────────────────────────────────
echo  Checking prerequisites...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  ERROR: Node.js not found.
    set BUILD_STATUS=1
    goto :RESULT
)
echo  OK: Node.js found.

REM ─── Install / verify deps ───────────────────────────────────────────────────
if not exist "node_modules" (
    echo  Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo  ERROR: npm install failed.
        set BUILD_STATUS=1
        goto :RESULT
    )
)

REM ─── TypeScript check ─────────────────────────────────────────────────────────
echo.
echo  [1/3] Running TypeScript type check...
npx tsc --noEmit
if %errorlevel% neq 0 (
    color 0C
    echo  FAILED: TypeScript errors found.
    set BUILD_STATUS=1
    goto :RESULT
)
echo  PASSED: TypeScript check.

REM ─── Lint ─────────────────────────────────────────────────────────────────────
echo.
echo  [2/3] Running ESLint...
npm run lint
if %errorlevel% neq 0 (
    color 0C
    echo  FAILED: ESLint errors found.
    set BUILD_STATUS=1
    goto :RESULT
)
echo  PASSED: ESLint check.

REM ─── Production build ─────────────────────────────────────────────────────────
echo.
echo  [3/3] Building production bundle...
npm run build
if %errorlevel% neq 0 (
    color 0C
    echo  FAILED: Production build failed.
    set BUILD_STATUS=1
    goto :RESULT
)

:RESULT
echo.
echo  ================================================
if %BUILD_STATUS% equ 0 (
    color 0A
    echo   BUILD SUCCESSFUL
    echo   Output: .next/
    echo   To preview: npm run start
) else (
    color 0C
    echo   BUILD FAILED
    echo   Check the errors above and fix them.
)
echo  ================================================
echo.
pause
