@echo off
echo Setting environment to USE HARDHAT LOCAL...
echo.

REM Set USE_SEPOLIA=false in .env
findstr /C:"USE_SEPOLIA" .env >nul 2>&1
if %ERRORLEVEL% == 1 (
    echo USE_SEPOLIA=false >> .env
    echo Added USE_SEPOLIA=false to .env
) else (
    powershell -Command "(Get-Content .env) -replace 'USE_SEPOLIA=.*', 'USE_SEPOLIA=false' | Set-Content .env"
    echo Updated USE_SEPOLIA=false in .env
)

echo.
echo Environment is now set to HARDHAT LOCAL
echo Make sure Hardhat node is running: npx hardhat node
echo To deploy contract: npm run deploy:local
echo To switch to Sepolia: run switch-to-sepolia.bat
pause