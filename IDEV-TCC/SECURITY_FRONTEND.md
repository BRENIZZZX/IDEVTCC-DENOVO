# INSTRUÇÕES DE SEGURANÇA - FRONTEND

## XSS Protection

Para prevenir XSS armazenado, sempre sanitize conteúdo de usuários antes de renderizar:

```javascript
import DOMPurify from 'dompurify';

// Em Perfil.jsx, linha ~280
<p style={{...}}>
  {DOMPurify.sanitize(usuario.bio || 'Sem biografia cadastrada')}
</p>

// Em DashboardProfissional.jsx ao exibir descrições de projetos
<p>{DOMPurify.sanitize(projeto.descricao)}</p>
```

## Envio de Headers de Autenticação

Todas as requisições que modificam dados devem incluir:

```javascript
const response = await fetch(`${API_BASE}/projeto`, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'X-User-Id': user.id,
    'X-User-Type': user.tipo
  },
  body: JSON.stringify(projeto)
});
```

## Validação Client-Side

Adicione validação antes de enviar ao backend:

```javascript
// Validar email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  alert('Email inválido');
  return;
}

// Validar senha
if (senha.length < 6) {
  alert('Senha deve ter no mínimo 6 caracteres');
  return;
}
```

## IMPORTANTE

- Nunca armazene senhas no localStorage
- Sempre valide dados no backend (validação client-side é apenas UX)
- Use HTTPS em produção
- Implemente JWT para autenticação real
