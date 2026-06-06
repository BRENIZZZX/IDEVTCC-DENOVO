import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { useAuth } from '../contexts/AuthContext'
import '../assets/css/style.css'
import Header from '../componentes/Header'
import Carousel from '../componentes/Carousel'
import ModernLogin from '../componentes/ModernLogin'
import PageTransition from '../componentes/PageTransition'
import SectionTransition from '../componentes/SectionTransition'
import Footer from '../componentes/Footer'

const Dashboard = () => {
  const [secaoAtiva, setSecaoAtiva] = useState('inicio');
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [habilidadesSelecionadas, setHabilidadesSelecionadas] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [profissionaisFiltrados, setProfissionaisFiltrados] = useState([]);
  const { user, isLoggedIn, switchUserType } = useAuth();
  const navigate = useNavigate();
  
  // Proteção de rota - apenas empresas podem acessar
  useEffect(() => {
    // [REMOVIDO - log de desenvolvimento]
    // console.log('Dashboard - user:', user)
    // console.log('Dashboard - user.tipo:', user?.tipo)
    // console.log('Dashboard - user.type:', user?.type)
    
    const tipoUsuario = user?.tipo || user?.type
    
    if (isLoggedIn && user && tipoUsuario === 'profissional') {
      alert('Não é possível acessar esta área! Este usuário não está cadastrado como empresa.')
      navigate('/dashboard-profissional')
    } else if (isLoggedIn && user && tipoUsuario === 'empresa') {
      // Garantir que empresas vejam o conteúdo
      setSecaoAtiva('inicio')
    }
  }, [isLoggedIn, user, navigate])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.classList.contains('filtros-overlay')) {
        setMostrarFiltros(false);
      }
    };
    
    if (mostrarFiltros) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [mostrarFiltros]);

  const habilidades = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'PHP', 'C#', 'Angular', 
    'Vue.js', 'TypeScript', 'MongoDB', 'MySQL', 'PostgreSQL', 'Docker', 'AWS'
  ];

  useEffect(() => {
    const handleDashboardSection = (event) => {
      setSecaoAtiva(event.detail);
    };
    
    window.addEventListener('setDashboardSection', handleDashboardSection);
    
    return () => {
      window.removeEventListener('setDashboardSection', handleDashboardSection);
    };
  }, []);

  const categories = [
    { 
      id: 1, 
      name: 'Desenvolvimento Web', 
      icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    },
    { 
      id: 2, 
      name: 'Mobile', 
      icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
    },
    { 
      id: 3, 
      name: 'DevOps', 
      icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.79a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    },
    { 
      id: 4, 
      name: 'Testes', 
      icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4m-4 0V9a2 2 0 0 1 4 0v2m-4 0h4m-4 0V7a2 2 0 0 1 4 0v2"/></svg>
    },
  ];

  const [professionals, setProfessionals] = useState([]);
  
  // Buscar profissionais da API
  useEffect(() => {
    const buscarProfissionais = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/usuario/profissionais')
        if (response.ok) {
          const data = await response.json()
          const profissionais = data.map((prof, index) => {
            // Simular habilidades baseadas no índice para demonstração
            const skillSets = [
              ['JavaScript', 'React', 'Node.js'],
              ['Python', 'Django', 'PostgreSQL'],
              ['Java', 'Spring', 'MySQL'],
              ['PHP', 'Laravel', 'Vue.js'],
              ['C#', '.NET', 'SQL Server'],
              ['Angular', 'TypeScript', 'MongoDB'],
              ['React', 'Python', 'AWS'],
              ['Vue.js', 'Node.js', 'Docker']
            ]
            
            return {
              id: prof.id,
              name: prof.nome,
              title: prof.bio || 'Profissional de TI',
              skills: skillSets[index % skillSets.length] || ['JavaScript', 'React'],
              location: 'Brasil',
              fotoPerfil: prof.fotoPerfil
            }
          })
          setProfessionals(profissionais)
          setProfissionaisFiltrados(profissionais)
        }
      } catch (error) {
        console.error('Erro ao buscar profissionais:', error)
      }
    }
    buscarProfissionais()
  }, [])

  const toggleHabilidade = (habilidade) => {
    setHabilidadesSelecionadas(prev => 
      prev.includes(habilidade) 
        ? prev.filter(h => h !== habilidade)
        : [...prev, habilidade]
    )
  }

  const aplicarFiltro = () => {
    if (habilidadesSelecionadas.length === 0) {
      setProfissionaisFiltrados(professionals)
    } else {
      const filtrados = professionals.filter(prof => 
        habilidadesSelecionadas.some(habilidade => 
          prof.skills.includes(habilidade)
        )
      )
      setProfissionaisFiltrados(filtrados)
    }
    setMostrarFiltros(false)
    // MODIFICADO: Não mudar para 'profissionais', manter em 'inicio'
    // setSecaoAtiva('profissionais')
  }

  const limparFiltros = () => {
    setHabilidadesSelecionadas([])
    setProfissionaisFiltrados(professionals)
  }

  const [projects, setProjects] = useState([])
  
  const removerProfissional = async (projetoId) => {
    if (confirm('Tem certeza que deseja remover o profissional deste projeto?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/projeto/${projetoId}/remover-profissional`, {
          method: 'PUT'
        })
        
        if (response.ok) {
          alert('Profissional removido com sucesso!')
          window.location.reload()
        } else {
          alert('Erro ao remover profissional')
        }
      } catch (error) {
        console.error('Erro ao remover profissional:', error)
        alert('Erro ao remover profissional')
      }
    }
  }
  
  // Buscar projetos da API
  useEffect(() => {
    const buscarProjetos = async () => {
      if (!user?.id) return
      
      try {
        const response = await fetch(`http://localhost:8080/api/v1/projeto/empresa/${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setProjects(data.map(proj => ({
            id: proj.id,
            title: proj.titulo,
            description: proj.descricao,
            image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=250&fit=crop',
            skills: ['React', 'Node.js'],
            budget: 'Orçamento a combinar',
            profissionalId: proj.profissionalId
          })))
        }
      } catch (error) {
        console.error('Erro ao buscar projetos:', error)
      }
    }
    buscarProjetos()
  }, [user?.id])

  return (
    <PageTransition>
      <Header 
        secaoAtiva={secaoAtiva}
        setSecaoAtiva={setSecaoAtiva}
        aoClicarLogin={() => setMostrarLogin(true)}
      />

      <ModernLogin mostrar={mostrarLogin} fechar={() => setMostrarLogin(false)} />

      <SectionTransition sectionKey={secaoAtiva}>
        {/* COMENTADO: Seção "profissionais" separada - agora integrada em "inicio" */}
        {/* {secaoAtiva === 'profissionais' && (
          <>
            {profissionaisFiltrados.length > 0 ? (
              <Carousel profissionais={profissionaisFiltrados} />
            ) : (
              <section className="professionals">
                <div className="container">
                  <div className="no-results-message">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" style={{ margin: '0 auto 1rem' }}>
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                      <line x1="9" y1="9" x2="13" y2="13"/>
                      <line x1="13" y1="9" x2="9" y2="13"/>
                    </svg>
                    <h3>Nenhum profissional encontrado</h3>
                    <p>Não há profissionais com as habilidades requisitadas no momento. Tente ajustar os filtros ou remover algumas habilidades para ver mais resultados.</p>
                    <button 
                      className="btn-clear-filters"
                      onClick={limparFiltros}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              </section>
            )}
          </>
        )} */}

        {(secaoAtiva === 'inicio' || !secaoAtiva) && (
          <>
            <section className="hero empresa">
              <div className="container">
                <div className="hero-header" style={{ textAlign: 'center' }}>
                  <div className="hero-title" style={{ textAlign: 'center' }}>
                    {isLoggedIn && user ? (
                      <>
                        <h1>Bem-vindo, {user.nome}!</h1>
                        <p>Encontre os melhores profissionais para seus projetos</p>
                      </>
                    ) : (
                      <>
                        <h1>Bem-vindo ao IDev</h1>
                        <p>Conecte-se com os melhores profissionais de TI</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="filtros-container">
                  <p className="filtro-texto">
                    {habilidadesSelecionadas.length > 0 
                      ? `Filtros ativos: ${habilidadesSelecionadas.join(', ')}`
                      : 'Filtre profissionais por habilidades específicas'
                    }
                  </p>
                  <button 
                    className="filtros-toggle"
                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                    style={{
                      borderColor: habilidadesSelecionadas.length > 0 ? '#06b6d4' : '#e5e7eb',
                      background: habilidadesSelecionadas.length > 0 ? '#f0f9ff' : 'white'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                    </svg>
                    Filtrar por Habilidades
                    {habilidadesSelecionadas.length > 0 && (
                      <span className="filtro-ativo">{habilidadesSelecionadas.length}</span>
                    )}
                  </button>
                </div>


              </div>
              
              {mostrarFiltros && createPortal(
                <div className="filtros-overlay" onClick={(e) => e.target === e.currentTarget && setMostrarFiltros(false)}>
                  <div className="filtros-modal">
                    <div className="filtros-header">
                      <h4>Filtrar Profissionais</h4>
                      <button 
                        className="fechar-btn"
                        onClick={() => setMostrarFiltros(false)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                    <div className="form-group">
                      <label>Habilidades:</label>
                      <div className="habilidades-grid">
                        {habilidades.map(habilidade => (
                          <label key={habilidade} className="habilidade-checkbox">
                            <input 
                              type="checkbox"
                              checked={habilidadesSelecionadas.includes(habilidade)}
                              onChange={() => toggleHabilidade(habilidade)}
                            />
                            <span>{habilidade}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button 
                        className="buscar-btn"
                        onClick={aplicarFiltro}
                        style={{ flex: 1 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8"/>
                          <path d="M21 21l-4.35-4.35"/>
                        </svg>
                        Buscar ({habilidadesSelecionadas.length})
                      </button>
                      {habilidadesSelecionadas.length > 0 && (
                        <button 
                          className="limpar-filtros-btn"
                          onClick={() => {
                            setHabilidadesSelecionadas([])
                          }}
                          style={{
                            padding: '0.75rem',
                            background: '#f3f4f6',
                            color: '#374151',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>,
                document.body
              )} 

            </section>

            {/* CARROSSEL DE PROFISSIONAIS - Sempre visível */}
            {profissionaisFiltrados.length > 0 ? (
              <Carousel profissionais={profissionaisFiltrados} />
            ) : (
              <section className="professionals">
                <div className="container">
                  <div className="no-results-message">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" style={{ margin: '0 auto 1rem' }}>
                      <circle cx="11" cy="11" r="8"/>
                      <path d="M21 21l-4.35-4.35"/>
                      <line x1="9" y1="9" x2="13" y2="13"/>
                      <line x1="13" y1="9" x2="9" y2="13"/>
                    </svg>
                    <h3>Nenhum profissional encontrado</h3>
                    <p>Não há profissionais com as habilidades requisitadas no momento. Tente ajustar os filtros ou remover algumas habilidades para ver mais resultados.</p>
                    <button 
                      className="btn-clear-filters"
                      onClick={limparFiltros}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* COMENTADO: Seções de categorias removidas
            <section className="categories empresa">
              <div className="container">
                <h2>Áreas de Especialização</h2>
                <div className="category-cards">
                  {categories.map(category => (
                    <div key={category.id} className="category-card">
                      <div className="category-icon">{category.icon}</div>
                      <h3>{category.name}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            */}
          </>
        )}

        {/* COMENT ADO: Seção "Projetos" removida */}
        {/* {secaoAtiva === 'projetos' && (
          <section className="projects-section">
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '80px' }}>
                <h2 style={{ margin: 0 }}>Projetos em Destaque</h2>
                {isLoggedIn && user?.tipo === 'empresa' && (
                  <button
                    onClick={() => navigate('/criar-projeto')}
                    style={{
                      padding: '0.875rem 2rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    + Criar Projeto
                  </button>
                )}
              </div>
              <div className="projects-grid">
                {projects.map(project => (
                  <div key={project.id} className="project-card">
                    <div className="project-image">
                      <img src={project.image} alt={project.title} />
                    </div>
                    <div className="project-content">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="project-skills">
                        {project.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                      <div className="project-footer">
                        <span className="project-budget">{project.budget}</span>
                        <button 
                          className="btn-details"
                          onClick={() => navigate(`/projeto/${project.id}/candidatos`)}
                        >
                          Ver Candidatos
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )} */}

        {/* COMENTADO: Seção "Sobre" removida */}
        {/* {secaoAtiva === 'sobre' && (
          <section className="about-section">
            <div className="container">
              <div className="about-content">
                <div className="about-header">
                  <h2>Sobre a IDev</h2>
                  <div className="about-divider"></div>
                </div>
                
                <div className="about-text">
                  <p>
                    A IDev nasceu da necessidade de conectar talentos de TI com oportunidades reais de forma mais eficiente e humana. 
                    Como desenvolvedor, sempre senti a dificuldade de encontrar projetos que realmente fizessem sentido para meu perfil e experiência. 
                    Esta plataforma foi criada para resolver esse problema, oferecendo um espaço onde profissionais podem mostrar seu verdadeiro potencial 
                    e clientes podem encontrar exatamente o que procuram.
                  </p>
                  
                  <p>
                    Meu objetivo é simples: facilitar conexões autênticas no mundo tech. Acredito que cada projeto merece o profissional certo, 
                    e cada desenvolvedor merece oportunidades que o desafiem e o façam crescer. A IDev é mais que uma plataforma de freelance - 
                    é uma comunidade onde qualidade, transparência e crescimento mútuo são os pilares fundamentais.
                  </p>
                </div>
                
                <div className="about-stats">
                  <div className="stat-item">
                    <h3>500+</h3>
                    <p>Profissionais Cadastrados</p>
                  </div>
                  <div className="stat-item">
                    <h3>200+</h3>
                    <p>Projetos Concluídos</p>
                  </div>
                  <div className="stat-item">
                    <h3>98%</h3>
                    <p>Taxa de Satisfação</p>
                  </div>
                </div>
                
                <div className="about-cta">
                  <button className="btn-primary" onClick={() => setSecaoAtiva('profissionais')}>Conhecer Profissionais</button>
                  <button className="btn-outline" onClick={() => setSecaoAtiva('projetos')}>Ver Projetos</button>
                </div>
              </div>
            </div>
          </section>
        )} */}
      </SectionTransition>

      {secaoAtiva === 'inicio' && <Footer />}
    </PageTransition>
  );
};

export default Dashboard;