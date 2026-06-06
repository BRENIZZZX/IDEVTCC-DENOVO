import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from '../componentes/Header'
import HeaderProfissional from '../componentes/HeaderProfissional'
import PageTransition from '../componentes/PageTransition'
import { api } from '../services/api'

function RequestList() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [requests, setRequests] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState('principal')

  useEffect(() => {
    carregarRequestsEMensagens()
  }, [abaAtiva])

  const carregarRequestsEMensagens = async () => {
    try {
      const todasMensagens = []
      
      if (abaAtiva === 'ignorados') {
        // Carregar mensagens ignoradas
        const ignoradasResponse = await fetch(`http://localhost:8080/api/v1/mensagem/ignoradas/${user.id}`)
        if (ignoradasResponse.ok) {
          const mensagensIgnoradas = await ignoradasResponse.json()
          if (Array.isArray(mensagensIgnoradas)) {
            for (const msg of mensagensIgnoradas) {
              const isEnviada = msg.remetenteId === user.id
              const outroUsuarioId = isEnviada ? msg.destinatarioId : msg.remetenteId
              
              let nomeOutroUsuario = 'Usuário'
              try {
                const userResponse = await fetch(`http://localhost:8080/api/v1/usuario/${outroUsuarioId}`)
                if (userResponse.ok) {
                  const userData = await userResponse.json()
                  nomeOutroUsuario = userData.nome
                }
              } catch (error) {
                console.error('Erro ao buscar usuário:', error)
              }
              
              todasMensagens.push({
                ...msg,
                tipo: isEnviada ? 'mensagem_enviada' : 'mensagem_recebida',
                categoria: 'mensagem',
                titulo: msg.assunto || (isEnviada ? 'Mensagem enviada' : 'Mensagem recebida'),
                nomeOutroUsuario
              })
            }
          }
        }
      } else {
        // Carregar mensagens normais (não ignoradas)
        // Carregar mensagens enviadas
        const mensagensEnviadasResponse = await fetch(`http://localhost:8080/api/v1/mensagem/enviadas/${user.id}`)
        if (mensagensEnviadasResponse.ok) {
          const mensagensEnviadas = await mensagensEnviadasResponse.json()
          if (Array.isArray(mensagensEnviadas)) {
            for (const msg of mensagensEnviadas) {
              let nomeDestinatario = 'Usuário'
              try {
                const userResponse = await fetch(`http://localhost:8080/api/v1/usuario/${msg.destinatarioId}`)
                if (userResponse.ok) {
                  const userData = await userResponse.json()
                  nomeDestinatario = userData.nome
                }
              } catch (error) {
                console.error('Erro ao buscar destinatário:', error)
              }
              
              todasMensagens.push({
                ...msg,
                tipo: 'mensagem_enviada',
                categoria: 'mensagem',
                titulo: msg.assunto || 'Mensagem enviada',
                nomeOutroUsuario: nomeDestinatario
              })
            }
          }
        }
        
        // Carregar mensagens recebidas
        const mensagensRecebidasResponse = await fetch(`http://localhost:8080/api/v1/mensagem/recebidas/${user.id}`)
        if (mensagensRecebidasResponse.ok) {
          const mensagensRecebidas = await mensagensRecebidasResponse.json()
          if (Array.isArray(mensagensRecebidas)) {
            for (const msg of mensagensRecebidas) {
              let nomeRemetente = 'Usuário'
              try {
                const userResponse = await fetch(`http://localhost:8080/api/v1/usuario/${msg.remetenteId}`)
                if (userResponse.ok) {
                  const userData = await userResponse.json()
                  nomeRemetente = userData.nome
                }
              } catch (error) {
                console.error('Erro ao buscar remetente:', error)
              }
              
              todasMensagens.push({
                ...msg,
                tipo: 'mensagem_recebida',
                categoria: 'mensagem',
                titulo: msg.assunto || 'Mensagem recebida',
                nomeOutroUsuario: nomeRemetente
              })
            }
          }
        }
      }
      
      // Ordenar por data
      todasMensagens.sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio))
      setRequests(todasMensagens)
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
      setRequests([])
    } finally {
      setCarregando(false)
    }
  }

  const marcarComoLida = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/mensagem/${id}/lida`, {
        method: 'PATCH'
      })
      if (response.ok) {
        carregarRequestsEMensagens()
      }
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  const ignorarMensagem = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/mensagem/${id}/ignorar`, {
        method: 'PATCH'
      })
      if (response.ok) {
        carregarRequestsEMensagens()
      }
    } catch (error) {
      console.error('Erro ao ignorar mensagem:', error)
    }
  }

  const designorarMensagem = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/mensagem/${id}/designorar`, {
        method: 'PATCH'
      })
      if (response.ok) {
        carregarRequestsEMensagens()
      }
    } catch (error) {
      console.error('Erro ao deixar de ignorar:', error)
    }
  }

  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleString('pt-BR')
  }

  const getCorCategoria = (categoria, tipo) => {
    if (categoria === 'mensagem') {
      return tipo === 'mensagem_enviada' ? '#3b82f6' : '#8b5cf6'
    }
    switch (categoria) {
      case 'reclamacao': return '#ef4444'
      case 'sugestao': return '#f59e0b'
      case 'elogio': return '#10b981'
      default: return '#6b7280'
    }
  }

  if (carregando) {
    return (
      <PageTransition>
        {user?.tipo === 'profissional' ? (
          <HeaderProfissional secaoAtiva="" setSecaoAtiva={() => {}} aoClicarLogin={() => navigate('/')} />
        ) : (
          <Header secaoAtiva="" setSecaoAtiva={() => {}} aoClicarLogin={() => navigate('/')} />
        )}
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Carregando requests...</p>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      {user?.tipo === 'profissional' ? (
        <HeaderProfissional secaoAtiva="" setSecaoAtiva={() => {}} aoClicarLogin={() => navigate('/')} />
      ) : (
        <Header secaoAtiva="" setSecaoAtiva={() => {}} aoClicarLogin={() => navigate('/')} />
      )}
      
      <main style={{
        minHeight: 'calc(100vh - 70px)',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        padding: '2rem'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 1rem 0'
          }}>
            Minhas Mensagens
          </h1>
          
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '1rem 1.5rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{
              color: '#1e40af',
              fontSize: '0.95rem',
              lineHeight: '1.5',
              margin: 0
            }}>
              As mensagens são uma forma de primeiro contato entre profissionais e empresas. Use este espaço para se apresentar ou demonstrar interesse.
            </p>
          </div>

          {/* Abas */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <button
              onClick={() => setAbaAtiva('principal')}
              style={{
                padding: '0.75rem 1.5rem',
                background: abaAtiva === 'principal' ? '#3b82f6' : 'transparent',
                color: abaAtiva === 'principal' ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Mensagens
            </button>
            <button
              onClick={() => setAbaAtiva('ignorados')}
              style={{
                padding: '0.75rem 1.5rem',
                background: abaAtiva === 'ignorados' ? '#3b82f6' : 'transparent',
                color: abaAtiva === 'ignorados' ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Ignorados
            </button>
          </div>

          {!requests || requests.length === 0 ? (
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                {abaAtiva === 'ignorados' 
                  ? 'Você não tem mensagens ignoradas.' 
                  : 'Você ainda não tem nenhuma mensagem.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {requests && requests.map(request => (
                <div key={`${request.tipo}_${request.id}`} style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  border: `3px solid ${getCorCategoria(request.categoria, request.tipo)}`,
                  opacity: request.tipo === 'mensagem_recebida' && !request.lida && abaAtiva === 'principal' ? 1 : 0.85,
                  position: 'relative'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: getCorCategoria(request.categoria, request.tipo),
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {request.tipo === 'mensagem_enviada' ? 'Enviada' : 
                         request.tipo === 'mensagem_recebida' ? 'Recebida' : 
                         request.categoria}
                      </span>
                      {request.tipo === 'mensagem_recebida' && !request.lida && abaAtiva === 'principal' && (
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          textTransform: 'uppercase'
                        }}>
                          NÃO LIDA
                        </span>
                      )}
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#111827',
                        margin: 0
                      }}>
                        {request.titulo}
                      </h3>
                      {request.nomeOutroUsuario && (
                        <span style={{
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          fontWeight: '500'
                        }}>
                          {request.tipo === 'mensagem_enviada' ? `• Para: ${request.nomeOutroUsuario}` : `• De: ${request.nomeOutroUsuario}`}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {abaAtiva === 'ignorados' ? (
                        <>
                          <button
                            onClick={() => designorarMensagem(request.id)}
                            style={{
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.5rem 1rem',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            Deixar de Ignorar
                          </button>
                          {request.tipo === 'mensagem_recebida' && (
                            <button
                              onClick={() => {
                                designorarMensagem(request.id)
                                setTimeout(() => navigate(`/contato-form?destinatario=${request.remetenteId}`), 300)
                              }}
                              style={{
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.5rem 1rem',
                                fontSize: '0.8rem',
                                cursor: 'pointer'
                              }}
                            >
                              Responder
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {request.tipo === 'mensagem_recebida' && (
                            <>
                              {!request.lida && (
                                <button
                                  onClick={() => marcarComoLida(request.id)}
                                  style={{
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Marcar como Lida
                                </button>
                              )}
                              <button
                                onClick={() => navigate(`/contato-form?destinatario=${request.remetenteId}`)}
                                style={{
                                  background: '#3b82f6',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '0.5rem 1rem',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer'
                                }}
                              >
                                Responder
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => ignorarMensagem(request.id)}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.5rem 1rem',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            Ignorar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  

                  <p style={{
                    color: '#374151',
                    lineHeight: '1.6',
                    margin: '0 0 1rem 0'
                  }}>
                    {request.mensagem}
                  </p>
                  

                  
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#6b7280',
                    textAlign: 'right'
                  }}>
                    Enviado em: {formatarData(request.dataEnvio)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </PageTransition>
  )
}

export default RequestList