package com.itb.inf2dm.idevplatform.model.services;

import com.itb.inf2dm.idevplatform.model.entity.Mensagem;
import com.itb.inf2dm.idevplatform.model.repository.MensagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MensagemService {
    
    @Autowired
    private MensagemRepository mensagemRepository;
    
    public Mensagem save(Mensagem mensagem) {
        return mensagemRepository.save(mensagem);
    }
    
    public List<Mensagem> findByDestinatarioId(Long destinatarioId) {
        return mensagemRepository.findByDestinatarioId(destinatarioId);
    }
    
    public List<Mensagem> findByRemetenteId(Long remetenteId) {
        return mensagemRepository.findByRemetenteId(remetenteId);
    }
    
    public Mensagem findById(Long id) {
        return mensagemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Mensagem não encontrada com id: " + id));
    }
    
    public Mensagem update(Long id, Mensagem mensagemAtualizada) {
        Mensagem mensagemExistente = findById(id);
        mensagemExistente.setMensagem(mensagemAtualizada.getMensagem());
        return mensagemRepository.save(mensagemExistente);
    }
    
    public void delete(Long id) {
        Mensagem mensagem = findById(id);
        mensagemRepository.delete(mensagem);
    }
    
    public Long countMensagensNaoLidas(Long destinatarioId) {
        return mensagemRepository.countMensagensNaoLidas(destinatarioId);
    }
    
    public Mensagem marcarComoLida(Long id) {
        Mensagem mensagem = findById(id);
        mensagem.setLida(true);
        return mensagemRepository.save(mensagem);
    }
    
    public Mensagem ignorarMensagem(Long id) {
        Mensagem mensagem = findById(id);
        mensagem.setIgnorada(true);
        return mensagemRepository.save(mensagem);
    }
    
    public Mensagem designorarMensagem(Long id) {
        Mensagem mensagem = findById(id);
        mensagem.setIgnorada(false);
        return mensagemRepository.save(mensagem);
    }
    
    public List<Mensagem> findMensagensIgnoradas(Long usuarioId) {
        return mensagemRepository.findMensagensIgnoradas(usuarioId);
    }
}