@echo off
echo ========================================
echo   V3: Modo Hibrido (Recomendado)
echo ========================================
echo.
echo Modo: Inteligente com fallback automatico
echo 1. Tenta workflow real do ChatKit
echo 2. Se falhar, usa chat.completions
echo Status: RECOMENDADO
echo.
echo VANTAGENS:
echo - Usa workflow real se disponivel
echo - Fallback automatico se nao funcionar
echo - Zero downtime
echo - Melhor experiencia possivel
echo.
echo O bot vai tentar usar o workflow real primeiro.
echo Se der erro (404/400), automaticamente usa
echo a simulacao via chat.completions.
echo.
echo Pressione qualquer tecla para iniciar...
pause > nul
echo.

REM Define a variável de ambiente para este modo
set USE_REAL_WORKFLOW=true

echo Iniciando bot em modo HIBRIDO (V3)...
echo Tentando workflow real, fallback para simulacao...
echo.

npm run dev

pause
