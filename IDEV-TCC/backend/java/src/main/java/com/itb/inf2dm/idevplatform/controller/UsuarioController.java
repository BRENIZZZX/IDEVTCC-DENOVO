package com.itb.inf2dm.idevplatform.controller;

import com.itb.inf2dm.idevplatform.model.entity.Notificacao;
import com.itb.inf2dm.idevplatform.model.entity.Usuario;
import com.itb.inf2dm.idevplatform.model.services.NotificacaoService;
import com.itb.inf2dm.idevplatform.model.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/usuario")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private NotificacaoService notificacaoService;

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodosUsuarios() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @GetMapping("/profissionais")
    public ResponseEntity<List<Usuario>> listarProfissionais() {
        return ResponseEntity.ok(usuarioService.findProfissionais());
    }
    
    @GetMapping("/empresas")
    public ResponseEntity<List<Usuario>> listarEmpresas() {
        return ResponseEntity.ok(usuarioService.findEmpresas());
    }

    // ENDPOINT DE TESTE - Verificar se /cadastro está acessível
    @GetMapping("/cadastro")
    public ResponseEntity<Object> testeCadastroGet() {
        System.out.println("\n=== GET /cadastro CHAMADO (TESTE) ===");
        return ResponseEntity.ok(Map.of(
            "message", "Endpoint /cadastro está acessível via GET",
            "info", "Use POST para cadastrar usuários"
        ));
    }

    // IMPORTANTE: Endpoints específicos ANTES de /{id}
    @PostMapping(value = "/cadastro", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> cadastro(@Valid @RequestBody Usuario usuario, BindingResult result) {
        System.out.println("\n=== MÉTODO CADASTRO CHAMADO ===");
        System.out.println("Nome: " + usuario.getNome());
        System.out.println("Email: " + usuario.getEmail());
        System.out.println("Tipo: " + usuario.getTipo());
        System.out.println("Telefone: " + usuario.getTelefone());
        System.out.println("Tem erros de validação: " + result.hasErrors());
        
        if (result.hasErrors()) {
            String errors = result.getAllErrors().stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.joining(", "));
            System.out.println("Erros de validação: " + errors);
            System.out.println("================================\n");
            return ResponseEntity.badRequest().body(
                Map.of("status", 400, "error", "Bad Request", "message", errors)
            );
        }
        try {
            System.out.println("Verificando se email existe...");
            if (usuarioService.emailExists(usuario.getEmail())) {
                System.out.println("Email já cadastrado: " + usuario.getEmail());
                System.out.println("================================\n");
                return ResponseEntity.badRequest().body(
                    Map.of(
                        "status", 400,
                        "error", "Bad Request",
                        "message", "Email já cadastrado"
                    )
                );
            }
            System.out.println("Salvando usuário...");
            Usuario novoUsuario = usuarioService.save(usuario);
            System.out.println("Usuário salvo com sucesso! ID: " + novoUsuario.getId());
            System.out.println("================================\n");
            return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
        } catch (Exception e) {
            System.err.println("ERRO ao cadastrar usuário: " + e.getMessage());
            e.printStackTrace();
            System.out.println("================================\n");
            return ResponseEntity.status(500).body(
                Map.of(
                    "status", 500,
                    "error", "Internal Server Error",
                    "message", "Erro ao cadastrar usuário: " + e.getMessage()
                )
            );
        }
    }

    @PostMapping(value = "/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> login(@RequestBody Map<String, String> loginData) {
        try {
            String email = loginData.get("email");
            String senha = loginData.get("senha");
            Usuario usuario = usuarioService.login(email, senha);

            Notificacao notificacao = new Notificacao();
            notificacao.setUsuarioId(usuario.getId());
            notificacao.setTitulo("Novo acesso à conta");
            notificacao.setDescricao("Foi detectado um novo login na sua conta.");
            notificacao.setIcone("🔐");
            notificacao.setTipo("GERAL");
            notificacaoService.save(notificacao);

            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(
                Map.of(
                    "status", 401,
                    "error", "Unauthorized",
                    "message", "Credenciais inválidas"
                )
            );
        }
    }

    // Endpoint genérico /{id} DEVE vir DEPOIS dos específicos
    // REGEX: Aceita apenas números para evitar conflito com /cadastro
    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<Object> listarUsuarioPorId(@PathVariable String id) {
        System.out.println("\n=== MÉTODO GET /{id} CHAMADO ===");
        System.out.println("ID recebido: " + id);
        System.out.println("================================\n");
        if (!id.matches("\\d+")) {
            return ResponseEntity.badRequest().body(
                Map.of(
                    "status", 400,
                    "error", "Bad Request",
                    "message", "O id deve ser numérico: " + id
                )
            );
        }
        try {
            return ResponseEntity.ok(usuarioService.findByIdIncludeInactive(Long.parseLong(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(
                Map.of(
                    "status", 404,
                    "error", "Not Found",
                    "message", "Usuário não encontrado com o id: " + id
                )
            );
        }
    }

    @PutMapping("/{id:[0-9]+}")
    public ResponseEntity<Object> atualizarUsuario(@PathVariable String id, @RequestBody Usuario usuario) {
        if (!id.matches("\\d+")) {
            return ResponseEntity.badRequest().body(
                Map.of(
                    "status", 400,
                    "error", "Bad Request",
                    "message", "O id deve ser numérico: " + id
                )
            );
        }
        try {
            return ResponseEntity.ok(usuarioService.update(Long.parseLong(id), usuario));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(
                Map.of(
                    "status", 404,
                    "error", "Not Found",
                    "message", "Usuário não encontrado com o id: " + id
                )
            );
        }
    }

    @DeleteMapping("/{id:[0-9]+}")
    public ResponseEntity<Object> deletarUsuarioPorId(@PathVariable String id) {
        if (!id.matches("\\d+")) {
            return ResponseEntity.badRequest().body(
                Map.of(
                    "status", 400,
                    "error", "Bad Request",
                    "message", "O id deve ser numérico: " + id
                )
            );
        }
        try {
            usuarioService.delete(Long.parseLong(id));
            return ResponseEntity.ok().body(
                Map.of(
                    "status", 200,
                    "message", "Usuário excluído com sucesso!"
                )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(
                Map.of(
                    "status", 404,
                    "error", "Not Found",
                    "message", "Usuário não encontrado com o id: " + id
                )
            );
        }
    }

    @PatchMapping("/{id:[0-9]+}/reativar")
    public ResponseEntity<Object> reativarUsuario(@PathVariable String id) {
        if (!id.matches("\\d+")) {
            return ResponseEntity.badRequest().body(
                Map.of(
                    "status", 400,
                    "error", "Bad Request",
                    "message", "O id deve ser numérico: " + id
                )
            );
        }
        try {
            usuarioService.reativar(Long.parseLong(id));
            return ResponseEntity.ok().body(
                Map.of(
                    "status", 200,
                    "message", "Usuário reativado com sucesso!"
                )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(
                Map.of(
                    "status", 404,
                    "error", "Not Found",
                    "message", "Usuário não encontrado com o id: " + id
                )
            );
        }
    }

    @PostMapping("/{id:[0-9]+}/upload-foto")
    public ResponseEntity<Object> uploadFoto(@PathVariable String id, @RequestParam("foto") MultipartFile file) {
        if (!id.matches("\\d+")) {
            return ResponseEntity.badRequest().body(
                Map.of("status", 400, "error", "Bad Request", "message", "O id deve ser numérico: " + id)
            );
        }
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(
                    Map.of("status", 400, "error", "Bad Request", "message", "Arquivo não enviado")
                );
            }
            
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(
                    Map.of("status", 400, "error", "Bad Request", "message", "Apenas imagens são permitidas")
                );
            }
            
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(
                    Map.of("status", 400, "error", "Bad Request", "message", "Arquivo muito grande (máximo 5MB)")
                );
            }

            String uploadDir = "uploads/fotos/";
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                extension = extension.replaceAll("[^a-zA-Z0-9.]", "");
            }

            String fileName = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(fileName).toAbsolutePath().normalize();
            
            if (!filePath.startsWith(uploadPath)) {
                return ResponseEntity.badRequest().body(
                    Map.of("status", 400, "error", "Bad Request", "message", "Nome de arquivo inválido")
                );
            }
            
            Files.copy(file.getInputStream(), filePath);

            String fotoUrl = "/uploads/fotos/" + fileName;
            Usuario usuario = usuarioService.findByIdIncludeInactive(Long.parseLong(id));
            usuario.setFotoPerfil(fotoUrl);
            usuarioService.save(usuario);

            return ResponseEntity.ok(Map.of("fotoUrl", fotoUrl));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(
                Map.of("status", 500, "error", "Internal Server Error", "message", "Erro ao salvar arquivo")
            );
        } catch (Exception e) {
            return ResponseEntity.status(404).body(
                Map.of("status", 404, "error", "Not Found", "message", "Usuário não encontrado")
            );
        }
    }
}