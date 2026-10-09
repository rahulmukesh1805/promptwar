@echo off
title HealthBridge AI Launcher
echo ====================================================
echo Starting HealthBridge AI Platform...
echo ====================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Python FastAPI Backend on http://127.0.0.1:8000 ...
start "HealthBridge Backend" cmd /k "backend\.venv\Scripts\uvicorn.exe backend.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 >nul

echo [2/2] Starting React Vite Frontend on http://127.0.0.1:5173 ...
start "HealthBridge Frontend" cmd /k "cd frontend && npm run dev -- --host 127.0.0.1 --port 5173"

timeout /t 2 >nul

echo Opening browser...
start http://localhost:5173

echo.
echo ====================================================
echo HealthBridge AI is now running!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8000/docs
echo ====================================================
pause
