@echo off
echo Starting Finance Application...
:: Kill stale python processes
taskkill /F /IM python.exe >nul 2>&1


:: Start Backend
start "Finance Backend" cmd /k "cd backend && pip install -r requirements.txt && python -m uvicorn main:app --reload"

:: Start Frontend
start "Finance Frontend" cmd /k "cd frontend && npm run dev"

:: Wait for frontend to become active
echo Waiting for frontend to become active on port 5173...
powershell -Command "while ($true) { try { $c = New-Object System.Net.Sockets.TcpClient('127.0.0.1', 5173); if ($c.Connected) { $c.Close(); break } } catch {} Start-Sleep -Seconds 1 }"

:: Open Browser
echo Frontend is active! Opening browser...
start http://localhost:5173

echo Application started. Close the command windows to stop the servers.
pause
