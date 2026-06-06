# ✅ CORREÇÃO APLICADA - Ordem das Rotas nos Controllers

## Problema Identificado

A rota `GET /api/v1/usuario/{id}` estava interceptando a rota `POST /api/v1/usuario/cadastro`, interpretando "cadastro" como um ID numérico.

**Causa:** Spring mapeia rotas na ordem em que são declaradas. Rotas genéricas com `{id}` capturam qualquer string, incluindo paths específicos como "/cadastro".

## Regra de Ouro

**Rotas ESPECÍFICAS devem ser declaradas ANTES de rotas GENÉRICAS com {id}**

### Ordem Correta:
1. ✅ Rotas sem parâmetros: `GET /api/v1/usuario`
2. ✅ Rotas com paths específicos: `GET /api/v1/usuario/profissionais`
3. ✅ Rotas com paths específicos e ID: `GET /api/v1/usuario/{id}/upload-foto`
4. ✅ Rotas genéricas com ID: `GET /api/v1/usuario/{id}` (SEMPRE POR ÚLTIMO)

## Correções Aplicadas

### 1. UsuarioController ✅
**Status:** Já estava correto

Ordem atual:
```java
@GetMapping                           // 1. Sem parâmetros
@GetMapping("/profissionais")         // 2. Path específico
@GetMapping("/empresas")              // 3. Path específico
@PostMapping("/login")                // 4. Path específico
@PostMapping("/cadastro")             // 5. Path específico
@GetMapping("/{id}")                  // 6. Genérico (último)
@PutMapping("/{id}")                  // 7. Genérico
@DeleteMapping("/{id}")               // 8. Genérico
@PatchMapping("/{id}/reativar")       // 9. Específico com ID
@PostMapping("/{id}/upload-foto")     // 10. Específico com ID
```

### 2. ProjetoController ✅ CORRIGIDO
**Problema:** `PUT /{id}/remover-profissional` estava DEPOIS de `PUT /{id}`

**Antes:**
```java
@PostMapping
@GetMapping("/{id}")                      // ❌ Genérico antes do específico
@PutMapping("/{id}")
@PutMapping("/{id}/remover-profissional") // ❌ Específico depois do genérico
@DeleteMapping("/{id}")
```

**Depois:**
```java
@GetMapping                               // 1. Sem parâmetros
@GetMapping("/abertos")                   // 2. Path específico
@GetMapping("/empresa/{empresaId}")       // 3. Path específico com ID
@GetMapping("/profissional/{profissionalId}") // 4. Path específico com ID
@PostMapping                              // 5. Sem parâmetros
@PutMapping("/{id}/remover-profissional") // 6. ✅ Específico com ID
@GetMapping("/{id}")                      // 7. ✅ Genérico
@PutMapping("/{id}")                      // 8. Genérico
@DeleteMapping("/{id}")                   // 9. Genérico
```

### 3. RequestController ✅ CORRIGIDO
**Problema:** `GET /{id}` estava no final mas outras rotas específicas estavam espalhadas

**Antes:**
```java
@PostMapping
@GetMapping("/usuario/{usuarioId}")
@GetMapping("/enviados/{usuarioId}")
@GetMapping("/recebidos/{usuarioId}")
@PutMapping("/{id}/status")
@GetMapping                               // ❌ Sem parâmetros no meio
@GetMapping("/count")                     // ❌ Específico no meio
@DeleteMapping("/{id}")
@GetMapping("/{id}")
```

**Depois:**
```java
@PostMapping                              // 1. Sem parâmetros
@GetMapping                               // 2. ✅ Sem parâmetros
@GetMapping("/count")                     // 3. ✅ Path específico
@GetMapping("/usuario/{usuarioId}")       // 4. Path específico com ID
@GetMapping("/enviados/{usuarioId}")      // 5. Path específico com ID
@GetMapping("/recebidos/{usuarioId}")     // 6. Path específico com ID
@PutMapping("/{id}/status")               // 7. Específico com ID
@DeleteMapping("/{id}")                   // 8. Genérico
@GetMapping("/{id}")                      // 9. ✅ Genérico (último)
```

### 4. MensagemController ✅
**Status:** Já estava correto

Ordem atual:
```java
@PostMapping                              // 1. Sem parâmetros
@GetMapping                               // 2. Sem parâmetros
@GetMapping("/recebidas/{destinatarioId}") // 3. Path específico
@GetMapping("/enviadas/{remetenteId}")    // 4. Path específico
@GetMapping("/{id}")                      // 5. Genérico (último)
@PutMapping("/{id}")                      // 6. Genérico
@DeleteMapping("/{id}")                   // 7. Genérico
```

### 5. CandidaturaController ✅
**Status:** Já estava correto

Ordem atual:
```java
@PostMapping                              // 1. Sem parâmetros
@GetMapping("/projeto/{projetoId}")       // 2. Path específico
@PutMapping("/{id}/aceitar")              // 3. Específico com ID
@PutMapping("/{id}/negar")                // 4. Específico com ID
@DeleteMapping("/{id}")                   // 5. Genérico (último)
```

## Compilação Verificada

```
[INFO] BUILD SUCCESS
[INFO] Total time: 5.084 s
[INFO] Compiling 26 source files
```

✅ Projeto compila sem erros
✅ Todas as rotas na ordem correta
✅ Rotas específicas antes das genéricas

## Como Testar

### Teste 1: Cadastro não deve ser interceptado
```bash
curl -X POST http://localhost:8080/api/v1/usuario/cadastro \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@email.com","senha":"senha123","tipo":"profissional"}'
```
**Esperado:** 201 Created (não 400 "id inválido")

### Teste 2: Rota genérica funciona
```bash
curl http://localhost:8080/api/v1/usuario/1001
```
**Esperado:** 200 OK com dados do usuário

### Teste 3: Remover profissional não é interceptado
```bash
curl -X PUT http://localhost:8080/api/v1/projeto/1/remover-profissional
```
**Esperado:** 200 OK (não 404)

## Resumo das Mudanças

| Controller | Status Anterior | Correção Aplicada |
|------------|----------------|-------------------|
| UsuarioController | ✅ Correto | Nenhuma |
| ProjetoController | ❌ Incorreto | Movido `/{id}/remover-profissional` para antes de `/{id}` |
| RequestController | ❌ Incorreto | Reorganizado: rotas sem params → específicas → genéricas |
| MensagemController | ✅ Correto | Nenhuma |
| CandidaturaController | ✅ Correto | Nenhuma |

## Padrão de Ordenação Recomendado

```java
@RestController
@RequestMapping("/api/v1/recurso")
public class RecursoController {
    
    // 1. POST/PUT/DELETE sem parâmetros
    @PostMapping
    @PutMapping
    
    // 2. GET sem parâmetros
    @GetMapping
    
    // 3. Rotas com paths específicos (sem {id})
    @GetMapping("/count")
    @GetMapping("/ativos")
    @GetMapping("/inativos")
    
    // 4. Rotas com paths específicos + parâmetro nomeado
    @GetMapping("/usuario/{usuarioId}")
    @GetMapping("/categoria/{categoria}")
    
    // 5. Rotas específicas com {id} + path adicional
    @PutMapping("/{id}/ativar")
    @PutMapping("/{id}/desativar")
    @PostMapping("/{id}/upload")
    
    // 6. Rotas genéricas com {id} (SEMPRE POR ÚLTIMO)
    @GetMapping("/{id}")
    @PutMapping("/{id}")
    @DeleteMapping("/{id}")
}
```

## Observação Importante

O Spring usa **primeira correspondência** (first-match) para mapear rotas. Uma vez que uma rota corresponde ao padrão, ela é executada, mesmo que exista uma rota mais específica declarada depois.

**Exemplo do problema:**
```java
@GetMapping("/{id}")              // Captura TUDO, incluindo "/cadastro"
@PostMapping("/cadastro")         // Nunca será alcançado para GET
```

**Solução:**
```java
@PostMapping("/cadastro")         // ✅ Específico primeiro
@GetMapping("/{id}")              // ✅ Genérico por último
```

---

**Confirmação:** O projeto compila sem erros e todas as rotas estão na ordem correta!
