@echo off
echo ========================================
echo  CAP NHAT PRIVATE KEY CUA BAN
echo ========================================
echo.
echo Dia chi vi hien tai: 0xb83b1af256f277a697504427c9cb9191b0ec8f71
echo Balance: 0.05 ETH
echo.
echo De su dung vi nay, ban can:
echo 1. Mo MetaMask
echo 2. Chon account 0xb83b1af256f277a697504427c9cb9191b0ec8f71
echo 3. Click 3 dots -^> Account Details -^> Export Private Key
echo 4. Copy private key (bat dau bang 0x...)
echo.
echo Sau do mo file .env va cap nhat dong:
echo SEPOLIA_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_FROM_METAMASK
echo.
echo LUU Y: Private key phai co dang 0x + 64 ky tu hex
echo Vi du: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
echo.
pause
notepad .env