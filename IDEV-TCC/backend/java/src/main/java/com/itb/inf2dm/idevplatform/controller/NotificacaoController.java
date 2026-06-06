package com.itb.inf2dm.idevplatform.controller;

import com.itb.inf2dm.idevplatform.model.entity.Notificacao;
import com.itb.inf2dm.idevplatform.model.services.NotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notificacao")
@CrossOrigin(origins = "*")
public class NotificacaoController {

    @Autowired
    private NotificacaoService notificacaoService;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Notificacao>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacaoService.findByUsuarioId(usuarioId));
    }

    @GetMapping("/usuario/{usuarioId}/count")
    public ResponseEntity<Map<String, Long>> contarNaoLidas(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(Map.of("naoLidas", notificacaoService.countNaoLidas(usuarioId)));
    }

    @PostMapping
    public ResponseEntity<Notificacao> criar(@RequestBody Notificacao notificacao) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificacaoService.save(notificacao));
    }

    @PutMapping("/{id}/lida")
    public ResponseEntity<Object> marcarComoLida(@PathVariable String id) {
        try {
            return ResponseEntity.ok(notificacaoService.marcarComoLida(Long.parseLong(id)));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Id inválido: " + id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/usuario/{usuarioId}/todas-lidas")
    public ResponseEntity<Map<String, String>> marcarTodasComoLidas(@PathVariable Long usuarioId) {
        notificacaoService.marcarTodasComoLidas(usuarioId);
        return ResponseEntity.ok(Map.of("message", "Todas as notificações marcadas como lidas."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletar(@PathVariable String id) {
        try {
            notificacaoService.delete(Long.parseLong(id));
            return ResponseEntity.ok(Map.of("message", "Notificação removida com sucesso."));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Id inválido: " + id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        }
    }
}
