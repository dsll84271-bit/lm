# Setting up Day One Hero on your computer

You need a paid Claude plan (Pro or Max). The free plan doesn't include Claude Code.

## 1. Install the tools (one time)
- **Python 3.11 or newer:** https://www.python.org/downloads/ (on Windows, tick "Add Python to PATH").
- **Node.js (LTS):** https://nodejs.org
- **ffmpeg:** on Windows run `winget install Gyan.FFmpeg`; on Mac run `brew install ffmpeg`.
- **Git for Windows** (Windows only): https://git-scm.com/downloads/win
- **Claude Code**, either way works:
  - Easiest: the Claude desktop app from https://claude.com/download, then use its **Code** tab.
  - Or in a terminal:
    - Windows PowerShell: `irm https://claude.ai/install.ps1 | iex`
    - Mac: `curl -fsSL https://claude.ai/install.sh | bash`

## 2. Put the project somewhere simple
Unzip `DayOneHero_project.zip` to a folder such as `Documents/DayOneHero`.

## 3. Let Claude Code finish the setup
Open that folder in Claude Code (in a terminal, `cd` into it and type `claude`) and say:

> Read CLAUDE.md and SETUP.md, install everything this project needs, download the voice model, check a test frame renders, then start the first task.

That runs these commands for you:
```
pip install -r requirements.txt
python -m playwright install chromium
cd vid && npm install && cd ../vid2 && npm install && cd ..
python get_voice_model.py
```
