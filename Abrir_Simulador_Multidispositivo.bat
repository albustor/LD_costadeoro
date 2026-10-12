@echo off
title Simulador Multidispositivo - Curiol Studio
echo ============================================================
echo   LIGA COSTA DE ORO 2026 - CURIOL STUDIO
echo   Simulador Multidispositivo (Movil, Tableta y PC)
echo ============================================================
echo.
echo Verificando servidor local en el puerto 3014...

netstat -ano | findstr :3014 >nul
if %errorlevel% neq 0 (
    echo [i] El servidor no estaba activo. Iniciando servidor Next.js...
    cd /d "d:\AntigravityFinal\EventoCostadeOro"
    start "Servidor Local Costa de Oro (Puerto 3014)" npm run dev
    echo [i] Esperando que arranque el servidor...
    timeout /t 5 /nobreak >nul
) else (
    echo [OK] Servidor activo en el puerto 3014.
)

echo [i] Abriendo Simulador Multidispositivo en el navegador...
start "" "http://localhost:3014/preview"
exit
