@echo off
title Wyvern Eye Overlay - Executando
cls

echo ======================================================
echo    INICIANDO WYVERN EYE OVERLAY
echo ======================================================
echo.

:: Verifica se a pasta node_modules existe
if not exist "node_modules\" (
    echo [ERRO] Dependencias nao encontradas!
    echo Por favor, execute o arquivo 'instalar.bat' primeiro.
    pause
    exit /b
)

:: Verifica a versao do node de novo por seguranca
node -v | findstr "v16." >nul
if %errorlevel% neq 0 (
    echo [ERRO] O NodeJS v16 nao foi detectado. 
    echo O programa pode nao funcionar corretamente.
    pause
)

echo [INFO] Certifique-se que o Citra e o MH3U ja estao abertos.
echo [INFO] Iniciando script principal...
echo.

npm start

:: Se o programa fechar sozinho, o pause evita que a janela suma
echo.
echo [AVISO] O processo foi encerrado.
pause