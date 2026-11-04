@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Memasang paket, mohon tunggu...
  call npm install
)
echo Menjalankan aplikasi di http://localhost:5173
call npm run dev
pause
