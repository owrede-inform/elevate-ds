@echo off
echo 🔍 Killing development processes while protecting Claude Code...

REM Kill common development processes but protect Claude Code
for /f "tokens=2 delims=," %%a in ('tasklist /fo csv ^| findstr /i "node.exe"') do (
    for /f "tokens=*" %%b in ('wmic process where "ProcessId=%%~a" get CommandLine /format:list 2^>nul ^| findstr "CommandLine"') do (
        echo %%b | findstr /i /c:"claude" /c:"@anthropic" >nul
        if errorlevel 1 (
            echo %%b | findstr /i /c:"docusaurus" /c:"webpack" /c:"start" /c:"dev" /c:"serve" /c:"3000" >nul
            if not errorlevel 1 (
                echo   • Killing development process PID %%~a
                taskkill /F /PID %%~a >nul 2>&1
            )
        ) else (
            echo   🛡️ Protecting Claude Code process PID %%~a
        )
    )
)

echo ✅ Development server cleanup complete!
pause