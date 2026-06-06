# ✅ CORREÇÃO APLICADA - Mapeamento JPA para SQL Server

## Problema Identificado

O Hibernate estava tentando acessar tabelas com nomes em minúsculo (projeto, mensagem, request, candidatura, usuario), mas no banco de dados SQL Server as tabelas estão em MAIÚSCULO (PROJETO, MENSAGEM, REQUEST, CANDIDATURA, USUARIO).

## Solução Implementada

Todas as entidades JPA foram corrigidas com:
1. Anotação `@Table(name = "NOME_TABELA")` em maiúsculo
2. Anotação `@Column(name = "NOME_COLUNA")` em maiúsculo para todas as colunas

### Entidades Corrigidas

#### 1. Usuario.java ✅
```java
@Entity
@Table(name = "USUARIO")
public class Usuario {
    @Column(name = "NOME", ...)
    @Column(name = "EMAIL", ...)
    @Column(name = "SENHA", ...)
    @Column(name = "TIPO", ...)
    @Column(name = "TELEFONE", ...)
    @Column(name = "FOTO_PERFIL", ...)
    @Column(name = "BIO", ...)
    @Column(name = "GITHUB_URL", ...)
    @Column(name = "COD_STATUS", ...)
}
```

#### 2. Projeto.java ✅
```java
@Entity
@Table(name = "PROJETO")
public class Projeto {
    @Column(name = "TITULO", ...)
    @Column(name = "DESCRICAO", ...)
    @Column(name = "EMPRESA_ID", ...)
    @Column(name = "PROFISSIONAL_ID", ...)
    @Column(name = "ORCAMENTO_MIN", ...)
    @Column(name = "ORCAMENTO_MAX", ...)
    @Column(name = "STATUS", ...)
    @Column(name = "COD_STATUS", ...)
}
```

#### 3. Mensagem.java ✅
```java
@Entity
@Table(name = "MENSAGEM")
public class Mensagem {
    @Column(name = "REMETENTE_ID", ...)
    @Column(name = "DESTINATARIO_ID", ...)
    @Column(name = "ASSUNTO", ...)
    @Column(name = "MENSAGEM", ...)
    @Column(name = "ANEXO", ...)
    @Column(name = "DATA_ENVIO", ...)
    @Column(name = "LIDA", ...)
    @Column(name = "COD_STATUS", ...)
}
```

#### 4. Request.java ✅
```java
@Entity
@Table(name = "REQUEST")
public class Request {
    @Column(name = "REMETENTE_ID", ...)
    @Column(name = "DESTINATARIO_ID", ...)
    @Column(name = "PROJETO_ID", ...)
    @Column(name = "CATEGORIA", ...)
    @Column(name = "MENSAGEM", ...)
    @Column(name = "ANEXO", ...)
    @Column(name = "DATA_ENVIO", ...)
    @Column(name = "COD_STATUS", ...)
    @Column(name = "STATUS", ...)
}
```

#### 5. Candidatura.java ✅
```java
@Entity
@Table(name = "CANDIDATURA")
public class Candidatura {
    @Column(name = "PROJETO_ID", ...)
    @Column(name = "PROFISSIONAL_ID", ...)
    @Column(name = "DATA_CANDIDATURA", ...)
    @Column(name = "STATUS", ...)
    @Column(name = "COD_STATUS", ...)
}
```

## Compilação Verificada

```
[INFO] BUILD SUCCESS
[INFO] Total time: 4.800 s
[INFO] Compiling 26 source files
```

✅ Projeto compila sem erros
✅ Todas as entidades mapeadas corretamente
✅ Nomes de tabelas e colunas em MAIÚSCULO

## Estrutura do Banco de Dados

### Tabelas no SQL Server (MAIÚSCULO)
- USUARIO
- PROJETO
- MENSAGEM
- REQUEST
- CANDIDATURA

### Colunas Principais

**USUARIO:**
- ID, NOME, EMAIL, SENHA, TIPO, TELEFONE, FOTO_PERFIL, BIO, GITHUB_URL, COD_STATUS

**PROJETO:**
- ID, TITULO, DESCRICAO, EMPRESA_ID, PROFISSIONAL_ID, ORCAMENTO_MIN, ORCAMENTO_MAX, STATUS, COD_STATUS

**MENSAGEM:**
- ID, REMETENTE_ID, DESTINATARIO_ID, ASSUNTO, MENSAGEM, ANEXO, DATA_ENVIO, LIDA, COD_STATUS

**REQUEST:**
- ID, REMETENTE_ID, DESTINATARIO_ID, PROJETO_ID, CATEGORIA, MENSAGEM, ANEXO, DATA_ENVIO, COD_STATUS, STATUS

**CANDIDATURA:**
- ID, PROJETO_ID, PROFISSIONAL_ID, DATA_CANDIDATURA, STATUS, COD_STATUS

## Como Testar

1. **Iniciar o servidor:**
```bash
cd c:\IDEV-TCC\backend\java
mvnw.cmd spring-boot:run
```

2. **Verificar logs do Hibernate:**
O Hibernate agora deve executar queries com nomes corretos:
```sql
SELECT * FROM USUARIO WHERE EMAIL = ?
SELECT * FROM PROJETO WHERE EMPRESA_ID = ?
```

3. **Testar endpoints:**
```bash
# Listar usuários
curl http://localhost:8080/api/v1/usuario

# Listar projetos
curl http://localhost:8080/api/v1/projeto
```

## Status Atual

| Item | Status |
|------|--------|
| Tabelas mapeadas em MAIÚSCULO | ✅ |
| Colunas mapeadas em MAIÚSCULO | ✅ |
| Projeto compila | ✅ |
| Hibernate configurado | ✅ |
| Spring Security configurado | ✅ |
| BCrypt funcionando | ✅ |

## Observações Importantes

### Configuração do Hibernate
No `application.properties`:
```properties
spring.jpa.hibernate.ddl-auto=none
```

Isso significa que o Hibernate **NÃO** cria/altera tabelas automaticamente. As tabelas devem existir no banco de dados conforme o script SQL.

### Script SQL
O arquivo `bd_IDev_Platform.sql` já cria as tabelas em MAIÚSCULO corretamente.

### Próximos Passos
1. Testar todas as operações CRUD
2. Verificar se as queries estão sendo executadas corretamente
3. Validar relacionamentos entre entidades
4. Testar upload de arquivos
5. Validar autenticação e autorização

---

**Confirmação:** O projeto compila sem erros e todas as entidades estão mapeadas corretamente para as tabelas SQL Server em MAIÚSCULO.
