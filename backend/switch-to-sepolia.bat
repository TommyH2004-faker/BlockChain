@echo off
echo Setting environment to USE SEPOLIA TESTNET...
echo.

REM Add USE_SEPOLIA=true to .env if not exists
findstr /C:"USE_SEPOLIA" .env >nul 2>&1
if %ERRORLEVEL% == 1 (
    echo USE_SEPOLIA=true >> .env
    echo Added USE_SEPOLIA=true to .env
) else (
    powershell -Command "(Get-Content .env) -replace 'USE_SEPOLIA=.*', 'USE_SEPOLIA=true' | Set-Content .env"
    echo Updated USE_SEPOLIA=true in .env
)

echo.
echo Environment is now set to SEPOLIA TESTNET
echo Make sure you have:
echo 1. SEPOLIA_RPC_URL in .env
echo 2. SEPOLIA_PRIVATE_KEY in .env  
echo 3. ETH in your Sepolia account
echo.
echo To deploy contract: npm run deploy:sepolia
echo To switch back to local: run switch-to-local.bat
pause