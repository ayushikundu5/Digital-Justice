# AI Court Backend - Firewall Rule
# This script adds a Windows Firewall rule to allow incoming connections on port 5000

Write-Host "Adding Windows Firewall rule for AI Court Backend..." -ForegroundColor Green

try {
    New-NetFirewallRule -DisplayName "AI Court Backend Port 5000" `
                        -Direction Inbound `
                        -LocalPort 5000 `
                        -Protocol TCP `
                        -Action Allow `
                        -Profile Any
    
    Write-Host "✅ Firewall rule added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Port 5000 is now open for incoming connections." -ForegroundColor Cyan
    Write-Host "Your phone can now connect to the backend at:" -ForegroundColor Cyan
    Write-Host "http://10.94.230.53:5000" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to continue..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "This script needs to run as Administrator." -ForegroundColor Yellow
    Write-Host "Right-click this file and select 'Run with PowerShell as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to continue..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
