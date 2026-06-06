@echo off
echo ========================================
echo TESTE DE ROTAS PUBLICAS - iDev Platform
echo ========================================
echo.

echo [1/3] Testando POST /api/v1/usuario/cadastro...
curl -X POST http://localhost:8080/api/v1/usuario/cadastro ^
  -H "Content-Type: application/json" ^
  -d "{\"nome\":\"Teste Usuario\",\"email\":\"teste@email.com\",\"senha\":\"senha123\",\"tipo\":\"profissional\"}" ^
  -w "\nStatus: %%{http_code}\n\n"

echo.
echo [2/3] Testando POST /api/v1/usuario/login...
curl -X POST http://localhost:8080/api/v1/usuario/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"samuel@email.com\",\"senha\":\"senha123\"}" ^
  -w "\nStatus: %%{http_code}\n\n"

echo.
echo [3/3] Testando GET /api/v1/usuario/profissionais (publica)...
curl -X GET http://localhost:8080/api/v1/usuario/profissionais ^
  -w "\nStatus: %%{http_code}\n\n"

echo.
echo ========================================
echo TESTES CONCLUIDOS
echo ========================================
echo.
echo Resultados esperados:
echo - Cadastro: 201 (Created) ou 400 (se email ja existe)
echo - Login: 200 (OK) ou 401 (credenciais invalidas)
echo - Profissionais: 200 (OK)
echo.
pause
