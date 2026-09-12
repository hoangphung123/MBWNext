@echo off
setlocal
cd /d "%~dp0"
echo.
echo  MBWNext ERP dang khoi dong tai http://127.0.0.1:4174/app
echo  Giu cua so nay mo trong khi su dung du an.
echo.
call node_modules\.bin\vite.cmd preview --host 127.0.0.1 --port 4174 --strictPort
echo.
echo  Server da dung. Nhan phim bat ky de dong cua so.
pause >nul
