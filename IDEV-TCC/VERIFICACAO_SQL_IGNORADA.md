# Verificação do Script SQL - Coluna IGNORADA

## ✅ Status: Script SQL Atualizado e Correto

A coluna `ignorada` já está presente no script de criação do banco de dados.

---

## 📋 Estrutura Atual da Tabela MENSAGEM

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
    ignorada BIT DEFAULT 0,          -- ✅ COLUNA PRESENTE
    cod_status BIT DEFAULT 1,
    FOREIGN KEY (remetente_id) REFERENCES USUARIO(id),
    FOREIGN KEY (destinatario_id) REFERENCES USUARIO(id)
)
GO
```

---

## ✅ Verificações Realizadas

1. **Coluna `ignorada` presente:** ✅ Sim
2. **Tipo de dado correto:** ✅ BIT
3. **Valor padrão definido:** ✅ DEFAULT 0
4. **Posição correta na tabela:** ✅ Entre `lida` e `cod_status`

---

## 📁 Localização do Script

**Arquivo:** `backend/sql/bd_IDev_Platform.sql`

**Linha:** ~70 (dentro da definição da tabela MENSAGEM)

---

## 🗄️ Estrutura Completa do Banco

### Tabelas Ativas:
1. **USUARIO** - Tabela de usuários (profissionais e empresas)
2. **MENSAGEM** - Tabela de mensagens com campos:
   - id
   - remetente_id
   - destinatario_id
   - assunto
   - mensagem
   - anexo
   - data_envio
   - lida
   - **ignorada** ← Campo para sistema de ignorar mensagens
   - cod_status

### Tabelas Comentadas (não utilizadas):
- PROJETO
- REQUEST
- CANDIDATURA

---

## 🚀 Como Recriar o Banco

Para aplicar o script completo com a coluna `ignorada`:

1. Abra o SQL Server Management Studio (SSMS)
2. Abra o arquivo `backend/sql/bd_IDev_Platform.sql`
3. Execute o script completo
4. O banco será recriado com todas as colunas corretas

**ATENÇÃO:** O script usa `DROP DATABASE` - todos os dados existentes serão perdidos!

---

## 📊 Campos da Tabela MENSAGEM

| Campo            | Tipo         | Nulo | Padrão      | Descrição                          |
|------------------|--------------|------|-------------|------------------------------------|
| id               | INT          | Não  | IDENTITY    | Chave primária                     |
| remetente_id     | INT          | Não  | -           | ID do usuário que envia            |
| destinatario_id  | INT          | Não  | -           | ID do usuário que recebe           |
| assunto          | VARCHAR(255) | Sim  | NULL        | Assunto da mensagem                |
| mensagem         | TEXT         | Não  | -           | Conteúdo da mensagem               |
| anexo            | VARCHAR(500) | Sim  | NULL        | URL do anexo (se houver)           |
| data_envio       | DATETIME     | Sim  | GETDATE()   | Data e hora do envio               |
| lida             | BIT          | Sim  | 0           | Indica se foi lida (0=não, 1=sim)  |
| **ignorada**     | **BIT**      | Sim  | **0**       | **Indica se foi ignorada**         |
| cod_status       | BIT          | Sim  | 1           | Status ativo/inativo (soft delete) |

---

## ✨ Funcionalidades Suportadas

Com a coluna `ignorada` presente, o sistema suporta:

- ✅ Marcar mensagens como lidas
- ✅ Ignorar mensagens
- ✅ Deixar de ignorar mensagens
- ✅ Aba de mensagens ignoradas
- ✅ Filtrar mensagens ignoradas nas queries
- ✅ Badge de notificações não conta ignoradas

---

## 🔍 Queries Relacionadas

### Buscar mensagens não ignoradas:
```sql
SELECT * FROM MENSAGEM 
WHERE destinatario_id = @userId 
AND ignorada = 0 
AND cod_status = 1
```

### Buscar mensagens ignoradas:
```sql
SELECT * FROM MENSAGEM 
WHERE (destinatario_id = @userId OR remetente_id = @userId)
AND ignorada = 1 
AND cod_status = 1
```

### Contar mensagens não lidas (excluindo ignoradas):
```sql
SELECT COUNT(*) FROM MENSAGEM 
WHERE destinatario_id = @userId 
AND lida = 0 
AND ignorada = 0 
AND cod_status = 1
```

---

## ✅ Conclusão

O script SQL está **correto e atualizado**. A coluna `ignorada` está presente na definição da tabela MENSAGEM e não precisa ser adicionada via ALTER TABLE.

Basta executar o script completo para recriar o banco com a estrutura correta.
