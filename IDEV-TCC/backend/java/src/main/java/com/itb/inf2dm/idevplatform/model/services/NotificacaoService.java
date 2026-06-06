package com.itb.inf2dm.idevplatform.model.services;

import com.itb.inf2dm.idevplatform.model.entity.Notificacao;
import com.itb.inf2dm.idevplatform.model.repository.NotificacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificacaoService {

    @Autowired
    private NotificacaoRepository notificacaoRepository;

    public List<Notificacao> findByUsuarioId(Long usuarioId) {
        return notificacaoRepository.findByUsuarioId(usuarioId);
    }

    public Notificacao save(Notificacao notificacao) {
        notificacao.setCodStatus(true);
        notificacao.setLida(false);
        return notificacaoRepository.save(notificacao);
    }

    public Notificacao findById(Long id) {
        return notificacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada com o id: " + id));
    }

    public Notificacao marcarComoLida(Long id) {
        Notificacao notificacao = findById(id);
        notificacao.setLida(true);
        return notificacaoRepository.save(notificacao);
    }

    public void marcarTodasComoLidas(Long usuarioId) {
        List<Notificacao> notificacoes = notificacaoRepository.findByUsuarioId(usuarioId);
        notificacoes.forEach(n -> n.setLida(true));
        notificacaoRepository.saveAll(notificacoes);
    }

    public long countNaoLidas(Long usuarioId) {
        return notificacaoRepository.countNaoLidas(usuarioId);
    }

    public void delete(Long id) {
        Notificacao notificacao = findById(id);
        notificacao.setCodStatus(false);
        notificacaoRepository.save(notificacao);
    }
}
