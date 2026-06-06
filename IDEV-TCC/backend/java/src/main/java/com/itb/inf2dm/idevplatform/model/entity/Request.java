package com.itb.inf2dm.idevplatform.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// FUNCIONALIDADE DE REQUEST VINCULADA A PROJETOS DESATIVADA
// Esta funcionalidade foi removida do frontend pois a tabela PROJETO não está mais sendo utilizada
// Mantido comentado para possível reativação futura

/*
@Entity
@Table(name = "REQUEST")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "REMETENTE_ID", nullable = false)
    private Long remetenteId;
    
    @Column(name = "DESTINATARIO_ID", nullable = false)
    private Long destinatarioId;
    
    @Column(name = "PROJETO_ID", nullable = false)
    private Long projetoId;
    
    @Column(name = "CATEGORIA", length = 20, nullable = false)
    private String categoria;
    
    @Column(name = "MENSAGEM", columnDefinition = "TEXT", nullable = false)
    private String mensagem;
    
    @Column(name = "ANEXO", length = 500)
    private String anexo;
    
    @Column(name = "DATA_ENVIO", nullable = false)
    private LocalDateTime dataEnvio = LocalDateTime.now();
    
    @Column(name = "COD_STATUS")
    private boolean codStatus = true;
    
    @Column(name = "STATUS", length = 20)
    private String status;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getRemetenteId() { return remetenteId; }
    public void setRemetenteId(Long remetenteId) { this.remetenteId = remetenteId; }
    
    public Long getDestinatarioId() { return destinatarioId; }
    public void setDestinatarioId(Long destinatarioId) { this.destinatarioId = destinatarioId; }
    
    public Long getProjetoId() { return projetoId; }
    public void setProjetoId(Long projetoId) { this.projetoId = projetoId; }
    
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    
    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
    
    public String getAnexo() { return anexo; }
    public void setAnexo(String anexo) { this.anexo = anexo; }
    
    public LocalDateTime getDataEnvio() { return dataEnvio; }
    public void setDataEnvio(LocalDateTime dataEnvio) { this.dataEnvio = dataEnvio; }
    
    public boolean isCodStatus() { return codStatus; }
    public void setCodStatus(boolean codStatus) { this.codStatus = codStatus; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
*/