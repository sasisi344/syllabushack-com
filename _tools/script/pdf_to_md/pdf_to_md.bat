@echo off
setlocal
cd /d %~dp0

:: Check for virtual environment
if not exist ".venv" (
    echo Creating local virtual environment...
    python -m venv .venv
    if %ERRORLEVEL% neq 0 (
        echo Failed to create virtual environment. Please ensure Python is installed.
        pause
        exit /b
    )
    echo Installing dependencies...
    .venv\Scripts\pip install pymupdf
)

if "%~1"=="" (
    echo Please drag and drop a PDF file onto this batch file.
    pause
    exit /b
)

:: Run script using local venv
.venv\Scripts\python pdf_to_md.py %*
if %ERRORLEVEL% neq 0 (
    echo An error occurred during conversion.
    pause
) else (
    echo Conversion complete!
)
pause
