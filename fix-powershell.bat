@echo off
echo ========================================
echo Fix PowerShell Execution Policy
echo ========================================
echo.
echo This will fix the npm PowerShell script error.
echo.
echo You need to run PowerShell as Administrator.
echo.
echo Press any key to open PowerShell as Administrator...
pause >nul

echo.
echo Opening PowerShell as Administrator...
echo.
echo Please run this command in the Administrator PowerShell window:
echo.
echo     Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
echo.
echo Then type Y when prompted.
echo.
echo After that, close and reopen PowerShell, then run:
echo     npm --version
echo.

REM Try to open PowerShell as admin
powershell -Command "Start-Process powershell -Verb RunAs -ArgumentList '-NoExit', '-Command', 'Write-Host \"Run this command:\"; Write-Host \"Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser\"; Write-Host \"\"; Write-Host \"Then type Y and press Enter.\"; Write-Host \"After that, close this window and test: npm --version\"'"

echo.
echo ========================================
echo Alternative: Use Command Prompt Instead
echo ========================================
echo.
echo Command Prompt doesn't have this restriction.
echo You can use cmd.exe instead of PowerShell.
echo.
pause

