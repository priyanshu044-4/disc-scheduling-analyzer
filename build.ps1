# PowerShell Build & Test Script for Disc Scheduling Analyzer
param (
    [switch]$Run,
    [switch]$Test,
    [switch]$Clean
)

if ($Clean) {
    Write-Host "Cleaning build artifacts..." -ForegroundColor Yellow
    Remove-Item -Force -ErrorAction SilentlyContinue disk_analyzer.exe, *.o, *.txt, *.csv
    Write-Host "Clean complete." -ForegroundColor Green
    exit 0
}

Write-Host "Compiling Disc Scheduling Analyzer..." -ForegroundColor Cyan

$sources = @(
    "src/algorithms.c",
    "src/metrics.c",
    "src/visualizer.c",
    "src/utils.c",
    "src/main.c"
)

gcc -Wall -Wextra -std=c99 -Iinclude $sources -o disk_analyzer.exe -lm

if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] disk_analyzer.exe built successfully!" -ForegroundColor Green

    if ($Test) {
        Write-Host "`nRunning automated test suite with textbook benchmark..." -ForegroundColor Magenta
        .\disk_analyzer.exe --preset textbook --all
    } elseif ($Run) {
        .\disk_analyzer.exe
    } else {
        Write-Host "Run '.\disk_analyzer.exe' to start interactive menu or '.\disk_analyzer.exe --help' for CLI options." -ForegroundColor Gray
    }
} else {
    Write-Host "[FAILED] Compilation failed." -ForegroundColor Red
}
