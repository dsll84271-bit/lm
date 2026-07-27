@echo off
title J.A.R.V.I.S.
cd /d "%~dp0"

where python >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Python is not installed. Get it from https://www.python.org/downloads/
  echo  IMPORTANT: tick "Add python.exe to PATH" during install, then run me again.
  echo.
  pause
  exit /b 1
)

if not exist .venv (
  echo  First run - setting things up, one moment, Sir...
  python -m venv .venv
)
call .venv\Scripts\activate.bat
pip install -q -r requirements.txt

if not defined ANTHROPIC_API_KEY (
  if exist "%USERPROFILE%\.jarvis\env.bat" call "%USERPROFILE%\.jarvis\env.bat"
)
if not defined ANTHROPIC_API_KEY (
  echo.
  echo  I need an Anthropic API key to think with.
  echo  Get one at https://console.anthropic.com  (Settings - API keys)
  echo.
  set /p ANTHROPIC_API_KEY= Paste key here and press Enter:
  if not exist "%USERPROFILE%\.jarvis" mkdir "%USERPROFILE%\.jarvis"
  echo set ANTHROPIC_API_KEY=%ANTHROPIC_API_KEY%>"%USERPROFILE%\.jarvis\env.bat"
)

python -m jarvis web
pause
