package com.itb.inf2dm.idevplatform.controller;

import com.itb.inf2dm.idevplatform.model.entity.Mensagem;
import com.itb.inf2dm.idevplatform.model.services.MensagemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/mensagem")
@CrossOrigin(origins = "http://localhost:5173")
public class MensagemController {
    
    @Autowired
    private MensagemService mensagemService;
    
    @PostMapping
    public ResponseEntity<Mensagem> criarMensagem(@RequestBody Mensagem mensagem) {
        Mensagem novaMensagem = mensagemService.save(mensagem);
        return ResponseEntity.ok(novaMensagem);
    }
    
    @GetMapping
    public ResponseEntity<String> info() {
        return ResponseEntity.ok("Endpoint de mensagens funcionando");
    }
    
    @GetMapping("/recebidas/{destinatarioId}")
    public ResponseEntity<List<Mensagem>> getMensagensRecebidas(@PathVariable Long destinatarioId) {
        List<Mensagem> mensagens = mensagemService.findByDestinatarioId(destinatarioId);
        return ResponseEntity.ok(mensagens);
    }
    
    @GetMapping("/enviadas/{remetenteId}")
    public ResponseEntity<List<Mensagem>> getMensagensEnviadas(@PathVariable Long remetenteId) {
        List<Mensagem> mensagens = mensagemService.findByRemetenteId(remetenteId);
        return ResponseEntity.ok(mensagens);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Object> getMensagemPorId(@PathVariable Long id) {
        try {
            Mensagem mensagem = mensagemService.findById(id);
            return ResponseEntity.ok(mensagem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(
                Map.of(
                    "status", 404,
                    "error", "Not Found",
                    "message", "Mensagem não encontrada com o id: " + id
                )
            );
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Object> atualizarMensagem(@PathVariable Long id, @RequestBody Mensagem mensagem) {
        try {
            Mensagem mensagemAtualizada = mensagemService.update(id, mensagem);
            return ResponseEntity.ok(mensagemAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(
                Map.of(
                    "status", 404,
                    "error", "Not Found",
                    "message", "Mensagem não encontrada com o id: " + id
                )
            );
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletarMensagem(@PathVariable Long id) {
        try {
            mensagemService.delete(id);
            return ResponseEntity.ok().body(
                Map.of(
                    "status", 200,
                    "message", "Mensagem excluída com sucesso!"
                )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(
                Map.of(
                    "status", 404,
                    "error", "Not Found",
                    "message", "Mensagem não encontrada com o id: " + id
                )
            );
        }
    }
    
    @GetMapping("/nao-lidas/{destinatarioId}")
    public ResponseEntity<Map<String, Long>> contarMensagensNaoLidas(@PathVariable Long destinatarioId) {
        Long count = mensagemService.countMensagensNaoLidas(destinatarioId);
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    @PatchMapping("/{id}/lida")
    public ResponseEntity<Object> marcarComoLida(@PathVariable Long id) {
        try {
            Mensagem mensagem = mensagemService.marcarComoLida(id);
            return ResponseEntity.ok(mensagem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(
                Map.of(
                    "status", 404,
                    "error", "Not Found",
                    "message", "Mensagem não encontrada com o id: " + id
                )
            );
        }
    }
    
    @PatchMapping("/{id}/ignorar")
    public ResponseEntity<Object> ignorarMensagem(@PathVariable Long id) {
        try {
            Mensagem mensagem = mensagemService.ignorarMensagem(id);
            return ResponseEntity.ok(mensagem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(
                Map.of(
                    "status", 404,
                    "error", "Not Found",
                    "message", "Mensagem não encontrada com o id: " + id
                )
            );
        }
    }
    
    @PatchMapping("/{id}/designorar")
    public ResponseEntity<Object> designorarMensagem(@PathVariable Long id) {
        try {
            Mensagem mensagem = mensagemService.designorarMensagem(id);
            return ResponseEntity.ok(mensagem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(
                Map.of(
                    "status", 404,
                    "error", "Not Found",
                    "message", "Mensagem não encontrada com o id: " + id
                )
            );
        }
    }
    
    @GetMapping("/ignoradas/{usuarioId}")
    public ResponseEntity<List<Mensagem>> getMensagensIgnoradas(@PathVariable Long usuarioId) {
        List<Mensagem> mensagens = mensagemService.findMensagensIgnoradas(usuarioId);
        return ResponseEntity.ok(mensagens);
    }
}