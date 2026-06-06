# 🔧 GUIA DE DIAGNÓSTICO: Problema de Roteamento /cadastro

## 📊 STATUS ATUAL

**Erro recebido:** `{"error":"Bad Request","message":"O id deve ser numérico: cadastro","status":400}`

**Progresso:** ✅ Mensagem mudou (era "não é válido", agora é "deve ser numérico")  
**Problema:** ❌ Requisição POST ainda cai no GET /{id}

---

## 🧪 TESTES PARA EXECUTAR

### 1. Teste via Browser (GET)
Abra no navegador:
```
http://localhost:8080/api/v1/usuario/cadastro
```

**Resultado esperado:**
```json
{
  "message": "Endpoint /cadastro está acessível via GET",
  "info": "Use POST para cadastrar usuários"
}
```

**Se receber erro "O id deve ser numérico: cadastro":**
- ❌ O Spring está roteando /cadastro para /{id}
- Problema: Ordem dos métodos ou configuração do Spring

**Se receber a mensagem esperada:**
- ✅ GET /cadastro funciona
- Problema: Apenas POST está sendo mal roteado

---

### 2. Teste via cURL (POST)
Execute no terminal:

```bash
curl -X POST http://localhost:8080/api/v1/usuario/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste Usuario",
    "email": "teste@email.com",
    "senha": "123456",
    "tipo": "profissional",
    "telefone": "11999999999"
  }' \
  -v
```

**Verifique no console do Spring:**
- Se aparecer `=== MÉTODO CADASTRO CHAMADO ===` → ✅ POST funciona
- Se aparecer `=== MÉTODO GET /{id} CHAMADO ===` → ❌ POST está sendo roteado errado

---

### 3. Teste via Postman/Insomnia

**Configuração:**
- Method: `POST`
- URL: `http://localhost:8080/api/v1/usuario/cadastro`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "nome": "Teste Usuario",
  "email": "teste@email.com",
  "senha": "123456",
  "tipo": "profissional",
  "telefone": "11999999999"
}
```

**Resultado esperado:** Status 201 Created

---

### 4. Verificar Logs do Spring

Ao fazer qualquer requisição para `/cadastro`, verifique o console do Spring Boot:

```
=== MÉTODO CADASTRO CHAMADO ===
Nome: Teste Usuario
Email: teste@email.com
Tipo: profissional
================================
```

**OU**

```
=== MÉTODO GET /{id} CHAMADO ===
ID recebido: cadastro
================================
```

---

## 🔍 DIAGNÓSTICO POR SINTOMA

### Sintoma 1: GET /cadastro funciona, POST não
**Causa provável:** Problema com CORS preflight ou método HTTP não permitido

**Solução:**
```java
@CrossOrigin(origins = "http://localhost:5173", 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, 
                       RequestMethod.DELETE, RequestMethod.OPTIONS})
```

---

### Sintoma 2: Ambos GET e POST caem em /{id}
**Causa provável:** Spring não está reconhecendo /cadastro como endpoint específico

**Solução:** Usar @RequestMapping com ordem explícita
```java
@RequestMapping(value = "/cadastro", method = RequestMethod.POST)
```

---

### Sintoma 3: Funciona via cURL, não funciona via Frontend
**Causa provável:** Problema no cliente (fetch, axios, etc)

**Verificar:**
1. Network tab do DevTools
2. Método HTTP enviado
3. Headers da requisição
4. CORS preflight (OPTIONS)

---

## 🛠️ SOLUÇÕES IMPLEMENTADAS

### ✅ 1. Reorganização da ordem dos métodos
```java
@GetMapping("/empresas")
@GetMapping("/cadastro")  // Teste
@PostMapping("/cadastro") // Específico
@PostMapping("/login")    // Específico
@GetMapping("/{id}")      // Genérico
```

### ✅ 2. Adicionado consumes/produces explícitos
```java
@PostMapping(value = "/cadastro", 
             consumes = "application/json", 
             produces = "application/json")
```

### ✅ 3. Adicionado logging para debug
```java
System.out.println("=== MÉTODO CADASTRO CHAMADO ===");
```

### ✅ 4. Endpoint de teste GET /cadastro
Para verificar se o roteamento básico funciona

---

## 🚨 PRÓXIMOS PASSOS SE O PROBLEMA PERSISTIR

### Opção 1: Usar @RequestMapping explícito
```java
@RequestMapping(value = "/cadastro", 
                method = RequestMethod.POST,
                consumes = MediaType.APPLICATION_JSON_VALUE,
                produces = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<Object> cadastro(@Valid @RequestBody Usuario usuario, BindingResult result) {
    // ...
}
```

### Opção 2: Separar em controllers diferentes
```java
@RestController
@RequestMapping("/api/v1/usuario/cadastro")
public class CadastroController {
    @PostMapping
    public ResponseEntity<Object> cadastrar(@Valid @RequestBody Usuario usuario) {
        // ...
    }
}
```

### Opção 3: Usar regex no path variable
```java
@GetMapping("/{id:[0-9]+}")  // Aceita apenas números
public ResponseEntity<Object> listarUsuarioPorId(@PathVariable String id) {
    // ...
}
```

---

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] Servidor Spring reiniciado após mudanças
- [ ] Frontend fazendo POST (não GET)
- [ ] Content-Type: application/json no header
- [ ] URL correta: http://localhost:8080/api/v1/usuario/cadastro
- [ ] CORS configurado corretamente
- [ ] SecurityConfig permitindo /cadastro
- [ ] Logs do Spring sendo verificados
- [ ] Teste via cURL funcionando
- [ ] Teste via Postman funcionando
- [ ] Teste via Frontend funcionando

---

## 📞 INFORMAÇÕES ADICIONAIS

### Endpoints Configurados
```
GET    /api/v1/usuario
GET    /api/v1/usuario/profissionais
GET    /api/v1/usuario/empresas
GET    /api/v1/usuario/cadastro (TESTE)
POST   /api/v1/usuario/cadastro
POST   /api/v1/usuario/login
GET    /api/v1/usuario/{id}
PUT    /api/v1/usuario/{id}
DELETE /api/v1/usuario/{id}
PATCH  /api/v1/usuario/{id}/reativar
POST   /api/v1/usuario/{id}/upload-foto
```

### Ordem de Prioridade do Spring MVC
1. Endpoints com paths literais exatos (`/cadastro`, `/login`)
2. Endpoints com paths parcialmente literais (`/{id}/reativar`)
3. Endpoints com path variables (`/{id}`)

---

**Data:** 2024  
**Status:** 🔄 Em investigação  
**Última atualização:** Adicionados logs e endpoint de teste
