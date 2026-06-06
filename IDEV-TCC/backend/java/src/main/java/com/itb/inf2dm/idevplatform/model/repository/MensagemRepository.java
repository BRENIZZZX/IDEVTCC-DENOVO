package com.itb.inf2dm.idevplatform.model.repository;

import com.itb.inf2dm.idevplatform.model.entity.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {
    
    @Query("SELECT m FROM Mensagem m WHERE m.destinatarioId = :destinatarioId AND m.codStatus = true AND m.ignorada = false ORDER BY m.dataEnvio DESC")
    List<Mensagem> findByDestinatarioId(@Param("destinatarioId") Long destinatarioId);
    
    @Query("SELECT m FROM Mensagem m WHERE m.remetenteId = :remetenteId AND m.codStatus = true AND m.ignorada = false ORDER BY m.dataEnvio DESC")
    List<Mensagem> findByRemetenteId(@Param("remetenteId") Long remetenteId);
    
    @Query("SELECT COUNT(m) FROM Mensagem m WHERE m.destinatarioId = :destinatarioId AND m.lida = false AND m.codStatus = true AND m.ignorada = false")
    Long countMensagensNaoLidas(@Param("destinatarioId") Long destinatarioId);
    
    @Query("SELECT m FROM Mensagem m WHERE (m.destinatarioId = :usuarioId OR m.remetenteId = :usuarioId) AND m.ignorada = true AND m.codStatus = true ORDER BY m.dataEnvio DESC")
    List<Mensagem> findMensagensIgnoradas(@Param("usuarioId") Long usuarioId);
}