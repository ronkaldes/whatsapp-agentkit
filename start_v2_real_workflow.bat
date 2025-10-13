@echo off
echo ========================================
echo   V2: Workflow Real do ChatKit
echo ========================================
echo.
echo Modo: Chama o workflow real do Agent Builder
echo Endpoint: /v1/chatkit/workflows/{id}/runs
echo Status: EXPERIMENTAL
echo.
echo IMPORTANTE:
echo - Requer que o workflow esteja publicado
echo - Requer acesso a API ChatKit (beta)
echo - Se der erro 404, API pode nao estar disponivel
echo.
echo O bot vai tentar executar o workflow REAL
echo criado no Agent Builder da OpenAI.
echo.
echo Pressione qualquer tecla para iniciar...
pause > nul
echo.

REM Define a variável de ambiente para este modo
set USE_REAL_WORKFLOW=true

echo Iniciando bot em modo WORKFLOW REAL (V2)...
echo.

npm run dev

pause
