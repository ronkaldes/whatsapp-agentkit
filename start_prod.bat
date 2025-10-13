@echo off
echo ========================================
echo   AgentKit WhatsApp Bot - Modo PROD
echo ========================================
echo.
echo Compilando projeto...
call npm run build
echo.
echo Iniciando bot em modo producao...
echo.

npm start

pause
