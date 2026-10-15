@echo off
title YEN! Mini Server
cd /d "%~dp0"
echo.
echo ====================================
echo        YEN! MINI SERVER
 echo ====================================
echo.
node server.js
if errorlevel 1 (
  echo.
  echo YEN! server stopped because of an error.
  echo Keep this window open and read the message above.
  pause
)
