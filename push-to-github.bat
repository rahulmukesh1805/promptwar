@echo off
title Push to GitHub - promptwar
cd /d "%~dp0"
echo ====================================================
echo Pushing files to GitHub: rahulmukesh1805/promptwar
echo ====================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Successfully pushed all files to GitHub!
) else (
    echo [NOTE] If prompted above, complete the GitHub sign-in in your browser or enter your Personal Access Token.
)
echo.
pause
