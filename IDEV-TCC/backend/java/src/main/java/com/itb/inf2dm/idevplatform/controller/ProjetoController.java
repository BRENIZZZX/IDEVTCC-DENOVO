package com.itb.inf2dm.idevplatform.controller;

import com.itb.inf2dm.idevplatform.model.entity.Projeto;
import com.itb.inf2dm.idevplatform.model.services.ProjetoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// COMENTADO: Endpoints de projeto desativados pois a funcionalidade foi removida do frontend
/*
@RestController
@RequestMapping("/api/v1/projeto")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjetoController {

    @Autowired
    private ProjetoService projetoService;

    @GetMapping
    public ResponseEntity<List<Projeto>> listarTodosProjetos() {
        return ResponseEntity.ok(projetoService.findAll());
    }

    @GetMapping("/abertos")
    public ResponseEntity<List<Projeto>> listarProjetosAbertos() {
        return ResponseEntity.ok(projetoService.findProjetosAbertos());
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<Projeto>> listarProjetosPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(projetoService.findByEmpresaId(empresaId));
    }

    @GetMapping("/profissional/{profissionalId}")
    public ResponseEntity<List<Projeto>> listarProjetosPorProfissional(@PathVariable Long profissionalId) {
        return ResponseEntity.ok(projetoService.findByProfissionalId(profissionalId));
    }

    @PostMapping
    public ResponseEntity<Object> salvarProjeto(@RequestBody Projeto projeto, @RequestHeader("X-User-Id") Long userId, @RequestHeader("X-User-Type") String userType) {
        if (!"empresa".equals(userType)) {
            return ResponseEntity.status(403).body(
                Map.of("status", 403, "error", "Forbidden", "message", "Apenas empresas podem criar projetos")
            );
        }
        projeto.setEmpresaId(userId);
        Projeto novoProjeto = projetoService.save(projeto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoProjeto);
    }

    @PutMapping("/{id:[0-9]+}/remover-profissional")
    public ResponseEntity<Object> removerProfissional(@PathVariable String id) {
        if (!id.matches("\\d+")) {
            return ResponseEntity.badRequest().body(
                Map.of("status", 400, "error", "Bad Request", "message", "O id deve ser numérico: " + id)
            );
        }
        try {
            Projeto projeto = projetoService.removerProfissional(Long.parseLong(id));
            return ResponseEntity.ok(projeto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<Object> listarProjetoPorId(@PathVariable String id) {
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
            return ResponseEntity.ok(projetoService.findById(Long.parseLong(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(
                Map.of(
                    "status", 404,
                    "error", "Not Found",
                    "message", "Projeto não encontrado com o id: " + id
                )
            );
        }
    }

    @PutMapping("/{id:[0-9]+}")
    public ResponseEntity<Object> atualizarProjeto(@PathVariable String id, @RequestBody Projeto projeto, @RequestHeader("X-User-Id") Long userId, @RequestHeader("X-User-Type") String userType) {
        if (!id.matches("\\d+")) {
            return ResponseEntity.badRequest().body(
                Map.of("status", 400, "error", "Bad Request", "message", "O id deve ser numérico: " + id)
            );
        }
        try {
            Projeto projetoExistente = projetoService.findById(Long.parseLong(id));
            
            if (!"empresa".equals(userType) || !projetoExistente.getEmpresaId().equals(userId)) {
                return ResponseEntity.status(403).body(
                    Map.of("status", 403, "error", "Forbidden", "message", "Você não tem permissão para editar este projeto")
                );
            }
            
            return ResponseEntity.ok(projetoService.update(Long.parseLong(id), projeto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(
                Map.of(
                    "status", 404,
                    "error", "Not Found",
                    "message", "Projeto não encontrado com o id: " + id
                )
            );
        }
    }

    @DeleteMapping("/{id:[0-9]+}")
    public ResponseEntity<Object> deletarProjetoPorId(@PathVariable String id, @RequestHeader("X-User-Id") Long userId, @RequestHeader("X-User-Type") String userType) {
        if (!id.matches("\\d+")) {
            return ResponseEntity.badRequest().body(
                Map.of("status", 400, "error", "Bad Request", "message", "O id deve ser numérico: " + id)
            );
        }
        try {
            Projeto projetoExistente = projetoService.findById(Long.parseLong(id));
            
            if (!"empresa".equals(userType) || !projetoExistente.getEmpresaId().equals(userId)) {
                return ResponseEntity.status(403).body(
                    Map.of("status", 403, "error", "Forbidden", "message", "Você não tem permissão para deletar este projeto")
                );
            }
            
            projetoService.delete(Long.parseLong(id));
            return ResponseEntity.ok().body(
                Map.of(
                    "status", 200,
                    "message", "Projeto excluído com sucesso!"
                )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(
                Map.of(
                    "status", 404,
                    "error", "Not Found",
                    "message", "Projeto não encontrado com o id: " + id
                )
            );
        }
    }
}
*/