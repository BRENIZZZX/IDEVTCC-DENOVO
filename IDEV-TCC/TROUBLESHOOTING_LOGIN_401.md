# 🔧 TROUBLESHOOTING - Erro 401 no Login

## ❌ PROBLEMA
A rota `POST /api/v1/usuario/login` está retornando **401 Unauthorized**

---

## ✅ CORREÇÕES APLICADAS

### 1. **SecurityConfig.java** ✅
**Status:** Já estava correto
- `/api/v1/usuario/login` está explicitamente liberado
- `/api/v1/usuario/cadastro` está explicitamente liberado

### 2. **UsuarioService.java** ✅
**Correção aplicada:** Adicionadas as colunas de redes sociais no método `update()`
```java
if (usuario.getLinkedinUrl() != null) usuarioExistente.setLinkedinUrl(usuario.getLinkedinUrl());
if (usuario.getInstagramUrl() != null) usuarioExistente.setInstagramUrl(usuario.getInstagramUrl());
if (usuario.getTwitterUrl() != null) usuarioExistente.setTwitterUrl(usuario.getTwitterUrl());
if (usuario.getSiteUrl() != null) usuarioExistente.setSiteUrl(usuario.getSiteUrl());
```

### 3. **UsuarioController.java** ✅
**Correção aplicada:** Adicionados logs detalhados no endpoint de login

---

## 🔍 DIAGNÓSTICO - SIGA ESTES PASSOS

### PASSO 1: Verificar se o Backend Está Rodando
```bash
# No terminal, execute:
cd backend/java
./mvnw spring-boot:run

# OU use o arquivo batch:
run-spring.bat
```

**Verifique se aparece:**
```
Started IDevPlatformApplication in X.XXX seconds
```

---

### PASSO 2: Verificar Logs do Backend

Quando você tentar fazer login, o console do backend deve mostrar:

```
=== MÉTODO LOGIN CHAMADO ===
Email: usuario@email.com
Senha recebida: [PRESENTE]
Tentando fazer login...
Login bem-sucedido! Usuário: Nome do Usuário
================================
```

**Se aparecer:**
- ✅ "Login bem-sucedido" → O backend está OK, problema é no frontend
- ❌ "Erro no login: Credenciais inválidas" → Email ou senha incorretos
- ❌ "Email ou senha ausentes" → Frontend não está enviando os dados

---

### PASSO 3: Verificar Rate Limit

O `RateLimitFilter` limita a **5 tentativas por minuto**.

**Se você tentou fazer login mais de 5 vezes:**
1. Aguarde 1 minuto
2. Tente novamente

**OU desabilite temporariamente:**

Abra: `backend/java/src/main/java/com/itb/inf2dm/idevplatform/config/RateLimitFilter.java`

Comente o conteúdo do método `doFilter`:
```java
@Override
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
    // TEMPORARIAMENTE DESABILITADO PARA TESTES
    chain.doFilter(request, response);
}
```

---

### PASSO 4: Verificar Banco de Dados

**Execute no SSMS:**
```sql
USE bd_IDev_Platform
GO

-- Verificar se o usuário existe
SELECT ID, NOME, EMAIL, TIPO, COD_STATUS 
FROM USUARIO 
WHERE EMAIL = 'seu@email.com'
GO

-- Verificar se a senha está criptografada
SELECT ID, NOME, EMAIL, SENHA 
FROM USUARIO 
WHERE EMAIL = 'seu@email.com'
GO
```

**A senha deve começar com `$2a$`** (BCrypt)

**Se a senha NÃO estiver criptografada:**
```sql
-- Resetar senha para "senha123"
UPDATE USUARIO 
SET SENHA = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE EMAIL = 'seu@email.com'
GO
```

---

### PASSO 5: Testar com cURL

Abra o terminal e execute:

```bash
curl -X POST http://localhost:8080/api/v1/usuario/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"samuel@email.com\",\"senha\":\"senha123\"}"
```

**Resposta esperada (sucesso):**
```json
{
  "id": 1001,
  "nome": "Samuel Nascimento",
  "email": "samuel@email.com",
  "tipo": "profissional"
}
```

**Resposta de erro:**
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Credenciais inválidas"
}
```

---

### PASSO 6: Verificar CORS

Abra o console do navegador (F12) e procure por erros de CORS:

```
Access to XMLHttpRequest at 'http://localhost:8080/api/v1/usuario/login' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Se aparecer erro de CORS:**

Verifique: `backend/java/src/main/java/com/itb/inf2dm/idevplatform/config/CorsConfig.java`

Deve conter:
```java
configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
```

---

### PASSO 7: Verificar Frontend

Abra: `src/paginas/Login.jsx` ou `src/componentes/ModernLogin.jsx`

Verifique se o fetch está correto:
```javascript
const response = await fetch('http://localhost:8080/api/v1/usuario/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, senha })
})
```

---

## 🐛 POSSÍVEIS CAUSAS E SOLUÇÕES

### Causa 1: Rate Limit Atingido
**Sintoma:** Erro 429 ou 401 após várias tentativas
**Solução:** Aguarde 1 minuto ou desabilite o RateLimitFilter

### Causa 2: Senha Incorreta
**Sintoma:** Logs mostram "Credenciais inválidas"
**Solução:** Verifique se a senha está correta ou resete no banco

### Causa 3: Usuário Inativo
**Sintoma:** Logs mostram "Usuário inativo"
**Solução:** 
```sql
UPDATE USUARIO SET COD_STATUS = 1 WHERE EMAIL = 'seu@email.com'
```

### Causa 4: Backend Não Está Rodando
**Sintoma:** Erro de conexão no frontend
**Solução:** Inicie o backend com `run-spring.bat`

### Causa 5: Porta 8080 Ocupada
**Sintoma:** Backend não inicia
**Solução:** 
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

## ✅ CHECKLIST DE VERIFICAÇÃO

- [ ] Backend rodando na porta 8080
- [ ] Frontend rodando na porta 5173
- [ ] Banco de dados acessível
- [ ] Script SQL de ALTER TABLE executado
- [ ] Usuário existe no banco
- [ ] Senha está criptografada (começa com $2a$)
- [ ] COD_STATUS = 1 (ativo)
- [ ] Não atingiu o rate limit (5 tentativas/minuto)
- [ ] Logs do backend aparecem ao tentar login
- [ ] Sem erros de CORS no console do navegador

---

## 📞 TESTE RÁPIDO

**1. Reinicie o backend:**
```bash
# Pare o backend (Ctrl+C)
# Inicie novamente
run-spring.bat
```

**2. Teste com usuário padrão:**
- Email: `samuel@email.com`
- Senha: `senha123`

**3. Verifique os logs do backend**

**4. Se funcionar:** O problema era cache ou estado anterior

**5. Se NÃO funcionar:** Envie os logs do backend

---

## 🎯 PRÓXIMOS PASSOS

1. Execute o script SQL: `ALTER_TABLE_REDES_SOCIAIS.sql`
2. Reinicie o backend
3. Tente fazer login
4. Verifique os logs
5. Se persistir, envie os logs completos do backend
