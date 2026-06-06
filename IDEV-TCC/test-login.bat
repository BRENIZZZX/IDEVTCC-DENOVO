@echo off
echo ========================================
echo TESTE DO ENDPOINT DE LOGIN
echo ========================================
echo.

echo Testando POST /api/v1/usuario/login
echo.

curl -X POST http://localhost:8080/api/v1/usuario/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"samuel@email.com\",\"senha\":\"senha123\"}"

echo.
echo.
echo ========================================
echo TESTE CONCLUIDO
echo ========================================
echo.
echo Se aparecer dados do usuario = SUCESSO
echo Se aparecer erro 401 = FALHA
echo.
pause
