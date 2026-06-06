# Sistema de Gerenciamento de Mensagens

## 📋 Resumo das Implementações

Sistema completo de gerenciamento de mensagens com funcionalidades de marcar como lida, ignorar mensagens e aba de ignorados.

---

## ✅ Funcionalidades Implementadas

### 1. MARCAR COMO LIDA
- ✅ Botão "Marcar como Lida" em mensagens recebidas não lidas
- ✅ Endpoint PATCH `/api/v1/mensagem/{id}/lida`
- ✅ Badge de notificação diminui automaticamente após marcar
- ✅ Badge visual "NÃO LIDA" em mensagens não lidas

### 2. IGNORAR MENSAGEM
- ✅ Botão "Ignorar" em todas as mensagens
- ✅ Campo `ignorada BIT DEFAULT 0` adicionado na tabela MENSAGEM
- ✅ Endpoint PATCH `/api/v1/mensagem/{id}/ignorar`
- ✅ Mensagens ignoradas não aparecem na aba principal
- ✅ Mensagens ignoradas não contam no badge de notificações

### 3. ABA DE IGNORADOS
- ✅ Aba "Ignorados" na tela de mensagens
- ✅ Exibe todas as mensagens ignoradas (enviadas e recebidas)
- ✅ Endpoint GET `/api/v1/mensagem/ignoradas/{usuarioId}`
- ✅ Botão "Deixar de Ignorar" para restaurar mensagens
- ✅ Endpoint PATCH `/api/v1/mensagem/{id}/designorar`
- ✅ Botão "Responder" que automaticamente designora e redireciona

---

## 🗄️ Alterações no Banco de Dados

### SQL Atualizado
```sql
CREATE TABLE MENSAGEM (
    id INT IDENTITY(1,1) PRIMARY KEY,
    remetente_id INT NOT NULL,
    destinatario_id INT NOT NULL,
    assunto VARCHAR(255),
    mensagem TEXT NOT NULL,
    anexo VARCHAR(500),
    data_envio DATETIME DEFAULT GETDATE(),
    lida BIT DEFAULT 0,
    ignorada BIT DEFAULT 0,  -- NOVO CAMPO
    cod_status BIT DEFAULT 1,
    FOREIGN KEY (remetente_id) REFERENCES USUARIO(id),
    FOREIGN KEY (destinatario_id) REFERENCES USUARIO(id)
)
```

**IMPORTANTE:** Execute o script SQL atualizado em `backend/sql/bd_IDev_Platform.sql` para recriar o banco com o novo campo.

---

## 🔌 Novos Endpoints da API

### 1. Marcar como Lida
```
PATCH /api/v1/mensagem/{id}/lida
```
- Marca uma mensagem como lida
- Retorna a mensagem atualizada

### 2. Ignorar Mensagem
```
PATCH /api/v1/mensagem/{id}/ignorar
```
- Marca uma mensagem como ignorada
- Remove da aba principal

### 3. Deixar de Ignorar
```
PATCH /api/v1/mensagem/{id}/designorar
```
- Remove o status de ignorada
- Retorna mensagem para aba principal

### 4. Listar Ignoradas
```
GET /api/v1/mensagem/ignoradas/{usuarioId}
```
- Retorna todas as mensagens ignoradas do usuário
- Inclui mensagens enviadas e recebidas

---

## 📁 Arquivos Alterados

### Backend (Java)
1. **`backend/sql/bd_IDev_Platform.sql`**
   - Adicionado campo `ignorada BIT DEFAULT 0`

2. **`backend/java/src/main/java/com/itb/inf2dm/idevplatform/model/entity/Mensagem.java`**
   - Adicionado campo `ignorada` com getters/setters

3. **`backend/java/src/main/java/com/itb/inf2dm/idevplatform/controller/MensagemController.java`**
   - Adicionado endpoint `PATCH /{id}/lida`
   - Adicionado endpoint `PATCH /{id}/ignorar`
   - Adicionado endpoint `PATCH /{id}/designorar`
   - Adicionado endpoint `GET /ignoradas/{usuarioId}`

4. **`backend/java/src/main/java/com/itb/inf2dm/idevplatform/model/services/MensagemService.java`**
   - Adicionado método `marcarComoLida()`
   - Adicionado método `ignorarMensagem()`
   - Adicionado método `designorarMensagem()`
   - Adicionado método `findMensagensIgnoradas()`

5. **`backend/java/src/main/java/com/itb/inf2dm/idevplatform/model/repository/MensagemRepository.java`**
   - Atualizado queries para filtrar mensagens ignoradas
   - Adicionado query `findMensagensIgnoradas()`
   - Badge de notificações não conta mensagens ignoradas

### Frontend (React)
6. **`src/paginas/RequestList.jsx`**
   - Adicionado sistema de abas (Principal / Ignorados)
   - Adicionado botão "Marcar como Lida"
   - Adicionado botão "Ignorar"
   - Adicionado botão "Deixar de Ignorar"
   - Adicionado badge visual "NÃO LIDA"
   - Implementado carregamento de mensagens ignoradas
   - Indicador visual para mensagens não lidas (opacidade)

---

## 🎨 Interface do Usuário

### Aba Principal (Mensagens)
- **Mensagens Recebidas Não Lidas:**
  - Badge vermelho "NÃO LIDA"
  - Botão verde "Marcar como Lida"
  - Botão azul "Responder"
  - Botão vermelho "Ignorar"

- **Mensagens Recebidas Lidas:**
  - Botão azul "Responder"
  - Botão vermelho "Ignorar"

- **Mensagens Enviadas:**
  - Botão vermelho "Ignorar"

### Aba Ignorados
- **Todas as Mensagens Ignoradas:**
  - Botão verde "Deixar de Ignorar"
  - Botão azul "Responder" (apenas recebidas) - automaticamente designora

---

## 🔄 Fluxo de Funcionamento

### Marcar como Lida
1. Usuário clica em "Marcar como Lida"
2. Campo `lida` atualizado para `1` no banco
3. Badge de notificação diminui automaticamente
4. Badge "NÃO LIDA" desaparece
5. Botão "Marcar como Lida" é removido

### Ignorar Mensagem
1. Usuário clica em "Ignorar"
2. Campo `ignorada` atualizado para `1` no banco
3. Mensagem desaparece da aba principal
4. Mensagem aparece na aba "Ignorados"
5. Badge de notificação não conta mensagens ignoradas

### Deixar de Ignorar
1. Usuário clica em "Deixar de Ignorar" na aba Ignorados
2. Campo `ignorada` atualizado para `0` no banco
3. Mensagem volta para aba principal
4. Se não lida, volta a contar no badge

### Responder Mensagem Ignorada
1. Usuário clica em "Responder" na aba Ignorados
2. Mensagem é automaticamente designorada
3. Usuário é redirecionado para formulário de resposta
4. Conversa volta para aba principal

---

## 🚀 Como Testar

1. **Recriar o banco de dados:**
   ```sql
   -- Execute o script completo em backend/sql/bd_IDev_Platform.sql
   ```

2. **Reiniciar o backend:**
   ```bash
   cd backend/java
   ./mvnw spring-boot:run
   ```

3. **Testar funcionalidades:**
   - Enviar mensagens entre usuários
   - Marcar mensagens como lidas
   - Ignorar mensagens
   - Verificar aba de ignorados
   - Deixar de ignorar mensagens
   - Responder mensagens ignoradas

---

## 📊 Regras de Negócio

1. ✅ Mensagens ignoradas não aparecem na aba principal
2. ✅ Mensagens ignoradas não contam no badge de notificações
3. ✅ Apenas mensagens recebidas podem ser marcadas como lidas
4. ✅ Qualquer mensagem pode ser ignorada (enviada ou recebida)
5. ✅ Responder uma mensagem ignorada a designora automaticamente
6. ✅ Badge "NÃO LIDA" só aparece em mensagens recebidas não lidas
7. ✅ Botão "Marcar como Lida" só aparece em mensagens não lidas

---

## ✨ Melhorias Visuais

- Badge "NÃO LIDA" em vermelho para destaque
- Opacidade diferenciada para mensagens não lidas
- Abas com transição suave
- Cores consistentes com o design existente
- Layout responsivo mantido

---

## 🔒 Segurança

- Todos os endpoints já estão liberados no SecurityConfig
- Validação de IDs no backend
- Tratamento de erros adequado
- Soft delete mantido (cod_status)
