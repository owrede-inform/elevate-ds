# Kill Development Servers Script - Safe for Claude Code
Write-Host "🔍 Scanning for Node.js development processes..." -ForegroundColor Yellow

# Get all Node.js processes
$allNodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($allNodeProcesses.Count -eq 0) {
    Write-Host "✅ No Node.js processes found." -ForegroundColor Green
    exit 0
}

$processesToKill = @()
$claudeProcesses = @()

foreach ($process in $allNodeProcesses) {
    $commandLine = ""
    $isClaudeCode = $false
    $isDevProcess = $false
    
    # Get command line safely
    $wmi = Get-WmiObject -Class Win32_Process -Filter "ProcessId = $($process.Id)" -ErrorAction SilentlyContinue
    if ($wmi -and $wmi.CommandLine) {
        $commandLine = $wmi.CommandLine
    } else {
        $commandLine = $process.ProcessName
    }
    
    # Check if it's Claude Code
    if ($commandLine -match "claude" -or $commandLine -match "Claude" -or $commandLine -match "@anthropic") {
        $isClaudeCode = $true
        $claudeProcesses += $process
    }
    
    # Check if it's a development process
    if ($commandLine -match "docusaurus" -or $commandLine -match "webpack" -or $commandLine -match "npm.*start" -or $commandLine -match "dev" -or $commandLine -match "serve" -or $commandLine -match ":3000" -or $commandLine -match "yarn") {
        $isDevProcess = $true
    }
    
    # Add to kill list if dev process but not Claude Code
    if ($isDevProcess -and -not $isClaudeCode) {
        $processesToKill += $process
    }
}

# Kill development processes
if ($processesToKill.Count -eq 0) {
    Write-Host "✅ No development processes found to kill." -ForegroundColor Green
} else {
    Write-Host "🎯 Found $($processesToKill.Count) development process(es) to terminate:" -ForegroundColor Cyan
    
    foreach ($process in $processesToKill) {
        Write-Host "   • Terminating PID $($process.Id)..." -ForegroundColor Gray
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        Write-Host "   ✓ Terminated PID $($process.Id)" -ForegroundColor Red
    }
}

# Show protected processes
if ($claudeProcesses.Count -gt 0) {
    Write-Host "🛡️ Protected Claude Code processes:" -ForegroundColor Blue
    foreach ($process in $claudeProcesses) {
        Write-Host "   • PID $($process.Id): Claude Code (protected)" -ForegroundColor Blue
    }
}

Write-Host "🔄 Development servers cleanup complete!" -ForegroundColor Green