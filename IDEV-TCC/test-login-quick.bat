@echo off
echo Testando login...
curl -X POST http://localhost:8080/api/v1/usuario/login -H "Content-Type: application/json" -d "{\"email\":\"samuel@email.com\",\"senha\":\"senha123\"}"
echo.
pause
