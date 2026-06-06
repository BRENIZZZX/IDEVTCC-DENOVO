package com.itb.inf2dm.idevplatform.model.repository;

import com.itb.inf2dm.idevplatform.model.entity.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    @Query("SELECT n FROM Notificacao n WHERE n.usuarioId = ?1 AND n.codStatus = true ORDER BY n.dataCriacao DESC")
    List<Notificacao> findByUsuarioId(Long usuarioId);

    @Query("SELECT COUNT(n) FROM Notificacao n WHERE n.usuarioId = ?1 AND n.lida = false AND n.codStatus = true")
    long countNaoLidas(Long usuarioId);
}
