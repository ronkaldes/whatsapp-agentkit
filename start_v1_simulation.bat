@echo off
echo ========================================
echo   V1: Chat Completions (Simulacao)
echo ========================================
echo.
echo Modo: Simula o workflow via chat.completions
echo Modelo: GPT-4o-mini
echo Status: FUNCIONAL - Garantido
echo.
echo O bot vai simular o comportamento do workflow
echo usando o GPT-4o-mini com instrucoes no prompt.
echo.
echo Pressione qualquer tecla para iniciar...
pause > nul
echo.

REM Define a variável de ambiente para este modo
set USE_REAL_WORKFLOW=false

echo Iniciando bot em modo SIMULACAO (V1)...
echo.

npm run dev

pause
