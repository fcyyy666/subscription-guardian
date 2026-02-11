# 完整清理并启动开发服务器的 PowerShell 脚本

Write-Host "🧹 清理环境..." -ForegroundColor Yellow

# 1. 停止所有相关进程
Write-Host "  停止 Node.js 进程..."
Get-Process -Name "node", "next" -ErrorAction SilentlyContinue | Stop-Process -Force -PassThru
Write-Host "  停止 npm 相关进程..."
Get-Process -Name "*npm*" -ErrorAction SilentlyContinue | Stop-Process -Force -PassThru
Write-Host "  停止 ws 相关进程..."
Get-Process -Name "*ws*" -ErrorAction SilentlyContinue | Stop-Process -Force -PassThru

# 2. 等待进程完全停止
Start-Sleep -Seconds 2

# 3. 清理 .next 目录
Write-Host "  清理 .next 目录..."
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
}

# 4. 清理 .next.lock 文件
Write-Host "  清理锁文件..."
if (Test-Path ".next.lock") {
    Remove-Item -Path ".next.lock" -Force -ErrorAction SilentlyContinue
}

# 5. 等待文件系统释放
Start-Sleep -Seconds 1

Write-Host "✅ 环境清理完成" -ForegroundColor Green
Write-Host "🚀 启动开发服务器..." -ForegroundColor Yellow

# 6. 启动开发服务器
npm run dev