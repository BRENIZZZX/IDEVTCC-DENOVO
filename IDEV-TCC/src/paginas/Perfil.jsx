import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from '../componentes/Header'
import PageTransition from '../componentes/PageTransition'
import pfp from '../assets/imagens/gato-de-terno-suit-cat.png';

// Mock data for users matching Dashboard professionals
const mockUsers = [
  {
    id: '1',
    nome: 'Samuel Nascimento',
    email: 'mumucharmoso@gmail.com',
    bio: 'Zé ruela do frontend, apaixonado por React e JavaScript. Sempre em busca de criar interfaces incríveis e funcionais.',
    foto: pfp
  },
  {
    id: '2',
    nome: 'Carlos Mendes',
    email: 'carlos.mendes@email.com',
    bio: 'Engenheiro de DevOps especializado em AWS, Docker e Kubernetes. Experiência em arquitetura de sistemas e automação de infraestrutura.',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    nome: 'Mariana Costa',
    email: 'mariana.costa@email.com',
    bio: 'Designer UI/UX especializada em criar experiências digitais incríveis. Trabalho com Figma, Adobe XD e tenho conhecimento em User Research.',
    foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '4',
    nome: 'Pedro Rocha',
    email: 'pedro.rocha@email.com',
    bio: 'Engenheiro de Qualidade focado em testes automatizados. Experiência com Selenium, Jest e metodologias ágeis de desenvolvimento.',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  }
]

function Perfil() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [secaoAtiva, setSecaoAtiva] = useState('perfil')
  const [podeEditar, setPodeEditar] = useState(false)

  const handleSetSecaoAtiva = (secao) => {
    setSecaoAtiva(secao)
    if (secao === 'inicio') {
      if (user?.tipo === 'profissional') {
        navigate('/dashboard-profissional')
      } else {
        navigate('/dashboard')
        setTimeout(() => {
          const event = new CustomEvent('setDashboardSection', { detail: 'inicio' })
          window.dispatchEvent(event)
        }, 50)
      }
    } else if (secao !== 'perfil') {
      if (user?.tipo === 'profissional') {
        navigate('/dashboard-profissional')
      } else {
        navigate('/dashboard')
      }
    }
  }

  // Buscar usuário da API
  const buscarUsuario = async (userId) => {
    setCarregando(true)
    try {
      const response = await fetch(`http://localhost:8080/api/v1/usuario/${userId}`)
      if (response.ok) {
        const usuarioData = await response.json()
        setUsuario({
          id: usuarioData.id,
          nome: usuarioData.nome,
          email: usuarioData.email,
          bio: usuarioData.bio || '',
          foto: usuarioData.fotoPerfil || pfp,
          tipo: usuarioData.tipo,
          telefone: usuarioData.telefone,
          linkedinUrl: usuarioData.linkedinUrl,
          instagramUrl: usuarioData.instagramUrl,
          twitterUrl: usuarioData.twitterUrl,
          siteUrl: usuarioData.siteUrl,
          githubUrl: usuarioData.githubUrl
        })
        setPodeEditar(user && user.id == usuarioData.id)
      } else {
        setUsuario(null)
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      setUsuario(null)
    }
    setCarregando(false)
  }



  useEffect(() => {
    if (id) {
      buscarUsuario(id)
    }
  }, [id])

  if (carregando) {
    return (
      <PageTransition>
        <Header secaoAtiva={secaoAtiva} setSecaoAtiva={handleSetSecaoAtiva} aoClicarLogin={() => navigate('/')} />
        <main style={{
          minHeight: 'calc(100vh - 70px)',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p>Carregando perfil...</p>
          </div>
        </main>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </PageTransition>
    )
  }

  if (!usuario) {
    return (
      <PageTransition>
        <Header secaoAtiva={secaoAtiva} setSecaoAtiva={handleSetSecaoAtiva} aoClicarLogin={() => navigate('/')} />
        <main style={{
          minHeight: 'calc(100vh - 70px)',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            maxWidth: '400px',
            width: '100%'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 1rem 0'
            }}>
              Usuário não encontrado
            </h1>
            <p style={{
              color: '#6b7280',
              marginBottom: '2rem'
            }}>
              O perfil com ID "{id}" não existe ou foi removido.
            </p>
            <button
              onClick={() => handleSetSecaoAtiva('inicio')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#2563eb'
                e.target.style.transform = 'translateY(-1px)'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#3b82f6'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              Voltar ao início
            </button>
          </div>
        </main>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <Header secaoAtiva={secaoAtiva} setSecaoAtiva={handleSetSecaoAtiva} aoClicarLogin={() => navigate('/')} />
      <main style={{
        minHeight: 'calc(100vh - 70px)',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        padding: '2rem'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <img
                src={usuario.foto}
                alt={usuario.nome}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #e5e7eb'
                }}
              />
              <div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#111827',
                  margin: '0 0 0.5rem 0'
                }}>
                  {usuario.nome}
                </h1>
                <p style={{
                  color: '#6b7280',
                  fontSize: '1.1rem',
                  margin: '0 0 1rem 0'
                }}>
                  {usuario.email}
                </p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  color: '#374151'
                }}>
                  <span style={{ color: '#10b981' }}>●</span>
                  Disponível
                </div>
              </div>
            </div>

            {usuario.bio && (
              <div>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 1rem 0'
                }}>
                  Sobre
                </h2>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  margin: 0,
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb'
                }}>
                  {usuario.bio}
                </p>
              </div>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 1rem 0'
              }}>
                Informações de Contato
              </h3>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {usuario.email}
                </p>
                {usuario.telefone && (
                  <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    {usuario.telefone}
                  </p>
                )}
                {!podeEditar && (
                  (user?.tipo === 'empresa' && usuario.tipo === 'profissional') || 
                  (user?.tipo === 'profissional' && usuario.tipo === 'empresa')
                ) && (
                  <button
                    onClick={() => navigate(`/contato-form?destinatario=${usuario.id}`)}
                    style={{
                      marginTop: '0.75rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      justifyContent: 'center'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Enviar Mensagem
                  </button>
                )}
              </div>
            </div>

            {(usuario.githubUrl || usuario.linkedinUrl || usuario.instagramUrl || usuario.twitterUrl || usuario.siteUrl) && (
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 1rem 0'
                }}>
                  {usuario.tipo === 'profissional' ? 'Links' : 'Redes Sociais'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {usuario.githubUrl && (
                    <a
                      href={usuario.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        color: '#24292e',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  )}
                  {usuario.linkedinUrl && (
                    <a
                      href={usuario.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        color: '#0077b5',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {usuario.instagramUrl && (
                    <a
                      href={usuario.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        color: '#E4405F',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Instagram
                    </a>
                  )}
                  {usuario.twitterUrl && (
                    <a
                      href={usuario.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        color: '#1DA1F2',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      Twitter/X
                    </a>
                  )}
                  {usuario.siteUrl && (
                    <a
                      href={usuario.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        color: '#6b7280',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                      Site da Empresa
                    </a>
                  )}
                </div>
              </div>
            )}

            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 1rem 0'
              }}>
                Ações
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {podeEditar && (
                  <button
                    onClick={() => {
                      if (usuario.tipo === 'profissional') {
                        navigate('/perfil-profissional')
                      } else {
                        navigate('/perfil-empresa')
                      }
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Editar Perfil
                  </button>
                )}
                <button
                  onClick={() => {
                    if (user?.tipo === 'profissional') {
                      navigate('/dashboard-profissional')
                    } else {
                      handleSetSecaoAtiva('inicio')
                    }
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                >
                  Voltar ao início
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  )
}

export default Perfil