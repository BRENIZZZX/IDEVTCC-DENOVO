# 🔍 DIAGNÓSTICO ERRO 400 - Bad Request

## ✅ PROGRESSO

**Antes:** Erro "O id deve ser numérico: cadastro" (roteamento errado)  
**Agora:** Erro 400 Bad Request (roteamento correto, problema nos dados)

**Isso é um AVANÇO!** A requisição está chegando no endpoint correto.

---

## 🧪 TESTE IMEDIATO

### 1. Abra o Console do Navegador (F12)

Vá para a aba **Console** e tente cadastrar um usuário.

Você verá:
```
Enviando dados: {nome: "...", email: "...", tipo: "...", telefone: "..."}
Resposta do servidor: {status: 400, error: "Bad Request", message: "..."}
```

**A mensagem de erro dirá exatamente o que está errado!**

---

## 🎯 POSSÍVEIS CAUSAS DO ERRO 400

### 1. Nome muito curto (< 3 caracteres)
**Validação:** `@Size(min = 3, max = 100)`  
**Erro:** "Nome deve ter entre 3 e 100 caracteres"

**Solução:** Digite um nome com pelo menos 3 caracteres

---

### 2. Email inválido
**Validação:** `@Email`  
**Erro:** "Email inválido"

**Solução:** Use um email válido (ex: teste@email.com)

---

### 3. Senha muito curta (< 6 caracteres)
**Validação:** `@Size(min = 6)`  
**Erro:** "Senha deve ter no mínimo 6 caracteres"

**Solução:** Use uma senha com pelo menos 6 caracteres

---

### 4. Tipo não selecionado
**Validação:** `@NotBlank`  
**Erro:** "Tipo é obrigatório"

**Solução:** Selecione "Profissional" ou "Empresa"

---

### 5. Email já cadastrado
**Validação:** Verificação no service  
**Erro:** "Email já cadastrado"

**Solução:** Use outro email

---

## 📊 VERIFICAR LOGS DO SPRING

No console do Spring Boot, você verá:

```
=== MÉTODO CADASTRO CHAMADO ===
Nome: Teste Usuario
Email: teste@email.com
Tipo: profissional
Telefone: 11999999999
Tem erros de validação: true/false
Erros de validação: [mensagens de erro]
================================
```

---

## 🔧 TESTE VIA cURL (Bypass Frontend)

Para testar se o problema está no frontend ou backend:

```bash
curl -X POST http://localhost:8080/api/v1/usuario/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste Usuario Completo",
    "email": "teste123@email.com",
    "senha": "senha123",
    "tipo": "profissional",
    "telefone": "11999999999"
  }' \
  -v
```

**Se funcionar via cURL mas não via frontend:**
- Problema está no código JavaScript

**Se não funcionar via cURL:**
- Problema está no backend

---

## ✅ DADOS VÁLIDOS PARA TESTE

Use estes dados para garantir que passam nas validações:

```json
{
  "nome": "João Silva Santos",
  "email": "joao.silva@email.com",
  "senha": "senha123456",
  "tipo": "profissional",
  "telefone": "11987654321"
}
```

**Validações:**
- ✅ Nome: 17 caracteres (>= 3)
- ✅ Email: formato válido
- ✅ Senha: 12 caracteres (>= 6)
- ✅ Tipo: "profissional" (válido)
- ✅ Telefone: opcional, mas preenchido

---

## 🐛 PROBLEMAS COMUNS

### Problema 1: Campo vazio no formulário
**Sintoma:** "Nome é obrigatório" ou "Email é obrigatório"  
**Causa:** Campo não preenchido  
**Solução:** Preencha todos os campos obrigatórios

---

### Problema 2: Tipo não selecionado
**Sintoma:** "Tipo é obrigatório"  
**Causa:** Select com value="" (opção disabled)  
**Solução:** Selecione "Profissional" ou "Empresa"

---

### Problema 3: Senha muito curta
**Sintoma:** "Senha deve ter no mínimo 6 caracteres"  
**Causa:** Senha com menos de 6 caracteres  
**Solução:** Use senha com 6+ caracteres

---

### Problema 4: Email duplicado
**Sintoma:** "Email já cadastrado"  
**Causa:** Email já existe no banco  
**Solução:** Use outro email ou delete o registro anterior

---

## 📝 CHECKLIST DE TESTE

Preencha o formulário com:

- [ ] Nome: mínimo 3 caracteres
- [ ] Email: formato válido (xxx@xxx.xxx)
- [ ] Senha: mínimo 6 caracteres
- [ ] Confirmar Senha: igual à senha
- [ ] Tipo: "profissional" ou "empresa" (não deixar vazio)
- [ ] Telefone: opcional

---

## 🎯 PRÓXIMOS PASSOS

1. **Abra o Console do navegador (F12)**
2. **Tente cadastrar um usuário**
3. **Veja a mensagem de erro exata**
4. **Corrija o problema baseado na mensagem**
5. **Tente novamente**

---

## 💡 DICA RÁPIDA

Se a mensagem de erro for:
- **"Nome/Email/Senha/Tipo é obrigatório"** → Campo vazio
- **"deve ter entre X e Y caracteres"** → Tamanho inválido
- **"Email inválido"** → Formato de email errado
- **"Email já cadastrado"** → Email duplicado no banco

---

**Status:** 🔄 Aguardando teste com logs  
**Próximo Passo:** Verificar console do navegador e logs do Spring
