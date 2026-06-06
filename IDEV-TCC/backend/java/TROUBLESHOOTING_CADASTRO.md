# 🔧 TROUBLESHOOTING - Cadastro de Usuário

## Problema Identificado

Não consegue cadastrar usuário. Possíveis causas corrigidas:

### 1. Validações Muito Restritivas ✅ CORRIGIDO

**Antes:**
```java
@Pattern(regexp = "profissional|empresa")  // Bloqueava se não fosse exatamente isso
@Pattern(regexp = "^\\([0-9]{2}\\) [0-9]{4,5}-[0-9]{4}$|^$")  // Telefone muito restrito
@Pattern(regexp = "^https://github\\.com/[a-zA-Z0-9_-]+$|^$")  // GitHub URL restrito
```

**Depois:**
```java
@NotBlank  // Apenas verifica se não está vazio
// Sem regex restritivo
```

### 2. Mensagem de Erro Melhorada ✅ CORRIGIDO

Agora o erro mostra a exceção real:
```java
"message": "Erro ao cadastrar usuário: " + e.getMessage()
```

## Como Testar

### Teste 1: Cadastro Mínimo
```bash
curl -X POST http://localhost:8080/api/v1/usuario/cadastro \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Teste Usuario\",\"email\":\"teste@email.com\",\"senha\":\"senha123\",\"tipo\":\"profissional\"}"
```

**Esperado:** 201 Created

### Teste 2: Cadastro Completo
```bash
curl -X POST http://localhost:8080/api/v1/usuario/cadastro \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"João Silva\",\"email\":\"joao@email.com\",\"senha\":\"senha123\",\"tipo\":\"empresa\",\"telefone\":\"11999999999\"}"
```

### Teste 3: Verificar Erro de Validação
```bash
curl -X POST http://localhost:8080/api/v1/usuario/cadastro \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Jo\",\"email\":\"invalido\",\"senha\":\"123\"}"
```

**Esperado:** 400 Bad Request com mensagens:
- "Nome deve ter entre 3 e 100 caracteres"
- "Email inválido"
- "Senha deve ter no mínimo 6 caracteres"

## Checklist de Validação

### Campos Obrigatórios
- ✅ **nome** (mínimo 3, máximo 100 caracteres)
- ✅ **email** (formato válido)
- ✅ **senha** (mínimo 6 caracteres)
- ✅ **tipo** (qualquer string não vazia)

### Campos Opcionais
- ⚪ telefone
- ⚪ fotoPerfil
- ⚪ bio (máximo 5000 caracteres)
- ⚪ githubUrl

## Possíveis Erros e Soluções

### Erro 400: "Nome é obrigatório"
**Causa:** Campo nome vazio ou null
**Solução:** Enviar nome com pelo menos 3 caracteres

### Erro 400: "Email inválido"
**Causa:** Email sem @ ou formato incorreto
**Solução:** Usar formato válido: usuario@dominio.com

### Erro 400: "Senha é obrigatória"
**Causa:** Campo senha vazio ou menos de 6 caracteres
**Solução:** Senha com no mínimo 6 caracteres

### Erro 400: "Email já cadastrado"
**Causa:** Email já existe no banco
**Solução:** Usar outro email ou deletar o usuário existente

### Erro 500: "Erro ao cadastrar usuário"
**Causa:** Problema no banco de dados ou BCrypt
**Solução:** Verificar logs do servidor

## Verificar Logs do Servidor

Inicie o servidor e observe os logs:
```bash
cd c:\IDEV-TCC\backend\java
mvnw.cmd spring-boot:run
```

Procure por:
- `java.sql.SQLException` - Problema no banco
- `BCryptPasswordEncoder` - Problema no hash de senha
- `ConstraintViolationException` - Violação de constraint do banco

## Testar Diretamente no Banco

```sql
-- Verificar se tabela existe
SELECT * FROM USUARIO;

-- Verificar estrutura
EXEC sp_help 'USUARIO';

-- Inserir manualmente (para teste)
INSERT INTO USUARIO (NOME, EMAIL, SENHA, TIPO, COD_STATUS)
VALUES ('Teste Manual', 'manual@email.com', 'senha123', 'profissional', 1);
```

## Validações Removidas (Agora Mais Flexível)

| Campo | Validação Antiga | Validação Nova |
|-------|-----------------|----------------|
| tipo | Regex: profissional\|empresa | Apenas @NotBlank |
| telefone | Regex: (XX) XXXXX-XXXX | Sem validação |
| githubUrl | Regex: https://github.com/... | Sem validação |

## Exemplo de Payload Válido

```json
{
  "nome": "Maria Santos",
  "email": "maria@email.com",
  "senha": "senha123",
  "tipo": "profissional",
  "telefone": "11999999999",
  "bio": "Desenvolvedora Full Stack",
  "githubUrl": "https://github.com/maria"
}
```

## Exemplo de Payload Mínimo

```json
{
  "nome": "João",
  "email": "joao@email.com",
  "senha": "senha123",
  "tipo": "empresa"
}
```

## Se Ainda Não Funcionar

1. **Verificar se o servidor está rodando:**
```bash
curl http://localhost:8080/api/v1/usuario
```

2. **Verificar se o banco está acessível:**
- SQL Server rodando?
- Credenciais corretas em application.properties?

3. **Verificar logs do Spring Boot:**
- Procurar por exceções
- Verificar se BCrypt está funcionando

4. **Testar sem validação:**
Temporariamente remover `@Valid` do controller:
```java
@PostMapping("/cadastro")
public ResponseEntity<Object> cadastro(@RequestBody Usuario usuario) {
    // Sem validação
}
```

5. **Verificar se Spring Security está bloqueando:**
- Rota /cadastro está em `permitAll()`?
- CORS configurado corretamente?

---

**Próximo passo:** Inicie o servidor e teste com curl. Se der erro, copie a mensagem completa dos logs.
