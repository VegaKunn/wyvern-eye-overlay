@echo off
title Instalador - Wyvern Eye Overlay
setlocal enabledelayedexpansion

echo ======================================================
echo    INSTALADOR WYVERN EYE OVERLAY
echo ======================================================
echo.

:: Verifica se o Node.js existe
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] NodeJS nao encontrado! 
    echo Por favor, instale o NodeJS v16 antes de continuar.
    echo Link: https://nodejs.org/download/release/latest-v16.x/
    pause
    exit /b
)

:: Verifica se a versao e a 16
for /f "tokens=1" %%v in ('node -v') do set "version=%%v"
echo !version! | findstr "v16." >nul
if %errorlevel% neq 0 (
    echo [ERRO] Versao incorreta do NodeJS detectada: !version!
    echo O Wyvern Eye requer OBRIGATORIAMENTE o NodeJS v16.
    echo Por favor, remova a versao atual e instale a v16.
    pause
    exit /b
)

echo [OK] NodeJS v16 detectado.
echo [INFO] Instalando dependencias...
echo.

call npm install

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Ocorreu um problema ao instalar as dependencias.
    echo Verifique sua conexao com a internet.
) else (
    echo.
    echo ======================================================
    echo    INSTALACAO CONCLUIDA COM SUCESSO!
    echo    Use o arquivo 'play.bat' para iniciar.
    echo ======================================================
)

pause