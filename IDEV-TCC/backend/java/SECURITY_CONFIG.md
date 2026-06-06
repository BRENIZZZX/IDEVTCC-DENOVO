# CONFIGURAÇÃO DE SEGURANÇA - Spring Security

## Problema Resolvido

A adição do Spring Security bloqueou todas as rotas por padrão, incluindo cadastro e login.

## Solução Implementada

Arquivo: `SecurityConfig.java`

### Rotas Públicas (sem autenticação)

```java
.requestMatchers("/api/v1/usuario/cadastro").permitAll()
.requestMatchers("/api/v1/usuario/login").permitAll()
.requestMatchers("/api/v1/projeto/abertos").permitAll()
.requestMatchers("/api/v1/usuario/profissionais").permitAll()
.requestMatchers("/api/v1/usuario/empresas").permitAll()
.requestMatchers("/uploads/**").permitAll()
```

### Configurações Aplicadas

1. **CSRF Desabilitado**: API REST stateless não precisa de CSRF
2. **CORS Habilitado**: Integração com configuração existente
3. **Session Stateless**: Não mantém sessão no servidor
4. **Todas as rotas liberadas temporariamente**: `.anyRequest().permitAll()`

## ⚠️ IMPORTANTE - PRÓXIMOS PASSOS

A configuração atual libera TODAS as rotas para facilitar desenvolvimento.

### Para Produção, altere para:

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/v1/usuario/cadastro").permitAll()
    .requestMatchers("/api/v1/usuario/login").permitAll()
    .requestMatchers("/api/v1/projeto/abertos").permitAll()
    .requestMatchers("/api/v1/usuario/profissionais").permitAll()
    .requestMatchers("/api/v1/usuario/empresas").permitAll()
    .requestMatchers("/uploads/**").permitAll()
    .anyRequest().authenticated() // ← MUDAR AQUI
);
```

### Implementar JWT

1. Adicionar dependência:
```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
```

2. Criar JwtAuthenticationFilter
3. Gerar token no login
4. Validar token em rotas protegidas

## Testando

Execute: `test-public-routes.bat`

Ou manualmente:

```bash
# Cadastro (deve retornar 201)
curl -X POST http://localhost:8080/api/v1/usuario/cadastro \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@email.com","senha":"senha123","tipo":"profissional"}'

# Login (deve retornar 200)
curl -X POST http://localhost:8080/api/v1/usuario/login \
  -H "Content-Type: application/json" \
  -d '{"email":"samuel@email.com","senha":"senha123"}'
```

## Status

✅ Projeto compila sem erros
✅ Rotas públicas liberadas
✅ CORS configurado
⚠️ JWT não implementado (usar headers X-User-Id temporariamente)
⚠️ Todas as rotas públicas em desenvolvimento (mudar para produção)
