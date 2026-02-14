@echo off
echo Resetting user quotas for student@test.com...
set "email=student@test.com"
set "phone=9121112225"

curl -X POST "http://localhost:3000/api/admin/reset-user-quotas" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"%email%\",\"phone\":\"%phone%\"}"

echo.
echo Quotas reset completed!
pause
