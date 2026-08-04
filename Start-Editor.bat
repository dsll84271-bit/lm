@echo off
title J.A.R.V.I.S. - Beat Editor
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

REM The editing toolkit is a heavy optional extra, so install it on demand
REM rather than burdening every JARVIS install with it.
python -c "import librosa, moviepy, cv2, soundfile" >nul 2>nul
if errorlevel 1 (
  echo  Installing the editing toolkit. This is a few hundred megabytes and
  echo  only happens once - go and make a coffee, Sir.
  pip install -q librosa "moviepy>=2.1" opencv-python soundfile imageio-ffmpeg
  if errorlevel 1 (
    echo  Installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)

echo.
echo  ============================================
echo   Beat-synced montage editor
echo  ============================================
echo.
echo  I need two files that are already on this PC: the movie to cut up, and
echo  the music track to cut it to.
echo.
echo  Drag each one from Explorer into this window - that fills in the path
echo  for you. Do not type a command here. Type q at any prompt to quit.
echo.

REM Re-ask on a bad path instead of exiting: a typo should not cost a restart.
:askvideo
set "VIDEO="
set /p "VIDEO=  Movie file (.mp4)  : "
set "VIDEO=%VIDEO:"=%"
if not defined VIDEO goto :askvideo
if /i "%VIDEO%"=="q" goto :quit
if not exist "%VIDEO%" (
  echo     Cannot find that. Drag the movie file in from Explorer.
  goto :askvideo
)

:askaudio
set "AUDIO="
set /p "AUDIO=  Music track (.mp3) : "
set "AUDIO=%AUDIO:"=%"
if not defined AUDIO goto :askaudio
if /i "%AUDIO%"=="q" goto :quit
if not exist "%AUDIO%" (
  echo     Cannot find that. Drag the music file in from Explorer.
  goto :askaudio
)

set "OUT="
set /p "OUT=  Save as       : "
set "OUT=%OUT:"=%"
if not defined OUT set "OUT=edit.mp4"

echo.
echo  Bake the music into the file, or leave it silent so you can add the
echo  licensed track inside TikTok? Silent is the safer option - in-app audio
echo  is never muted.
set "SILENT="
set /p "SILENT=  Leave it silent? [Y/n] : "
if /i "%SILENT%"=="n" (set "SILENTFLAG=") else (set "SILENTFLAG=--silent-video")

REM Plan first. On a feature-length film the scan is the slow part, so the plan
REM is saved to an EDL and the render reuses it instead of scanning twice.
echo.
echo  Planning the edit. Nothing is rendered yet - this reads the music and
echo  scans the film for action, which can take 20-30 minutes on a long movie.
echo.
python auto_editor.py --video "%VIDEO%" --audio "%AUDIO%" --output "%OUT%" --ramp --dry-run
if errorlevel 1 goto :fail

for %%F in ("%OUT%") do set "EDL=%%~dpnF.edl.json"

echo.
set "GO="
set /p "GO=  Happy with that plan? Render it now? [Y/n] : "
if /i "%GO%"=="n" (
  echo.
  echo  Stopped. The plan is saved at %EDL%
  echo  Re-run me later, or render it directly with:
  echo     python auto_editor.py --from-edl "%EDL%" --output "%OUT%" %SILENTFLAG%
  goto :done
)

echo.
python auto_editor.py --from-edl "%EDL%" --output "%OUT%" %SILENTFLAG% --ramp
if errorlevel 1 goto :fail

echo.
echo  Done, Sir. Your edit: %OUT%
goto :done

:quit
echo.
echo  Stopped, Sir. Nothing was changed.
goto :done

:fail
echo.
echo  That did not work. The error above says why - the usual causes are a
echo  file path with no read access, or a source video too short to fill the
echo  track.

:done
echo.
pause
