@echo off
cd /d "C:\ASE\Project08\AI-Visibility-SaaS\AI-Visibility-Nextjs"
node_modules\.bin\eslint.cmd . --format=compact > "%TEMP%\eslint_output.txt" 2>&1
echo EXIT_CODE=%ERRORLEVEL% >> "%TEMP%\eslint_output.txt"
