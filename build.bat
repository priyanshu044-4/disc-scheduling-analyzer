@echo off
echo ===================================================
echo   Building Disc Scheduling Analyzer (C / GCC)
echo ===================================================

gcc -Wall -Wextra -std=c99 -Iinclude src\algorithms.c src\metrics.c src\visualizer.c src\utils.c src\main.c -o disk_analyzer.exe -lm

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] disk_analyzer.exe successfully built!
    echo Run "disk_analyzer.exe" for interactive menu.
    echo Or "disk_analyzer.exe --help" for CLI options.
) else (
    echo [ERROR] Build failed! Check compiler output above.
)
