import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../assets/css/Header.css'

function Header({ secaoAtiva, setSecaoAtiva, aoClicarLogin }) {
  const [menuAberto, setMenuAberto] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [mensagensNaoLidas, setMensagensNaoLidas] = useState(0)
  const { isLoggedIn, user, logout, login, switchUserType } = useAuth()
  const navigate = useNavigate()
  
  // Usar dados reais do usuário logado
  const userData = user ? {
    id: user.id,
    name: user.nome,
    avatar: user.fotoPerfil ? `http://localhost:8080${user.fotoPerfil}` : null
  } : null
  
  // COMENTADO: Itens de navegação removidos conforme solicitação
  // const itensMenu = [
  //   { id: 'inicio', label: 'Início' },
  //   { id: 'profissionais', label: 'Profissionais' },
  //   { id: 'projetos', label: 'Projetos' }
  // ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-profile-container')) {
        setShowProfileMenu(false)
      }
    }
    
    if (showProfileMenu) {
      document.addEventListener('click', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showProfileMenu])

  // Buscar mensagens não lidas
  useEffect(() => {
    const buscarMensagensNaoLidas = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`http://localhost:8080/api/v1/mensagem/nao-lidas/${user.id}`)
          if (response.ok) {
            const data = await response.json()
            setMensagensNaoLidas(data.count || 0)
          }
        } catch (error) {
          console.error('Erro ao buscar mensagens não lidas:', error)
        }
      }
    }
    
    buscarMensagensNaoLidas()
    // Atualizar a cada 30 segundos
    const interval = setInterval(buscarMensagensNaoLidas, 30000)
    
    return () => clearInterval(interval)
  }, [user])

  const handleItemClick = (id) => {
    if (['dashboard-pro', 'notificacoes', 'agenda', 'avaliacoes'].includes(secaoAtiva)) {
      // Se estamos no dashboard profissional, não navegar para outras páginas
      return
    }
    
    // Se não estamos no dashboard, navegar para lá primeiro
    if (window.location.pathname !== '/dashboard') {
      navigate('/dashboard')
      setTimeout(() => {
        const event = new CustomEvent('setDashboardSection', { detail: id })
        window.dispatchEvent(event)
      }, 50)
    } else {
      setSecaoAtiva(id)
    }
    
    setMenuAberto(false)
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => navigate('/')}>
          <img src="/src/assets/imagens/logo2.png" alt="IDev" />
          <span className="logo-text">IDev</span>
        </div>
        
        {/* COMENTADO: Botão de menu mobile removido */}
        {/* <button 
          className="menu-toggle"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          ☰
        </button> */}
        
        {/* COMENTADO: Navegação removida - apenas dashboard com profissionais visível */}
        {/* {secaoAtiva === 'dashboard-pro' ? (
          <nav className={`nav ${menuAberto ? 'mobile-open' : ''}`}>
            <button
              onClick={() => setSecaoAtiva('notificacoes')}
              className={`nav-item ${secaoAtiva === 'notificacoes' ? 'active' : ''}`}
            >
              Notificações
            </button>
            <button
              onClick={() => setSecaoAtiva('agenda')}
              className={`nav-item ${secaoAtiva === 'agenda' ? 'active' : ''}`}
            >
              Agenda
            </button>
            <button
              onClick={() => setSecaoAtiva('avaliacoes')}
              className={`nav-item ${secaoAtiva === 'avaliacoes' ? 'active' : ''}`}
            >
              Avaliações
            </button>
          </nav>
        ) : secaoAtiva ? (
          <nav className={`nav ${menuAberto ? 'mobile-open' : ''}`}>
            {itensMenu.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`nav-item ${secaoAtiva === item.id ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        ) : null} */}

        {!isLoggedIn ? (
          <div className="auth-container">
            <button onClick={aoClicarLogin} className="login-btn">
              Entrar
            </button>
          </div>
        ) : (
          <div className="user-profile-container">
            <div 
              className="user-profile" 
              onClick={(e) => {
                e.stopPropagation()
                setShowProfileMenu(!showProfileMenu)
              }}
            >
              {userData?.avatar ? (
                <img src={userData.avatar} alt={userData.name} className="user-avatar" />
              ) : (
                <div className="user-avatar-placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              )}
              <span className="user-name">{userData?.name || 'Usuário'}</span>
            </div>
            {showProfileMenu && (
              <div className="profile-menu">
                <button 
                  onClick={() => {
                    navigate(`/perfil/${userData?.id}`)
                    setShowProfileMenu(false)
                  }}
                  className="menu-item"
                >
                  Ver Perfil
                </button>
                <button 
                  onClick={() => {
                    if (user?.tipo === 'empresa') {
                      navigate('/perfil-empresa')
                    } else {
                      navigate(`/perfil/${userData?.id}`)
                    }
                    setShowProfileMenu(false)
                  }}
                  className="menu-item"
                >
                  Editar Perfil
                </button>
                <button 
                  onClick={() => {
                    navigate('/requests')
                    setShowProfileMenu(false)
                  }}
                  className="menu-item"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span>Minhas Mensagens</span>
                  {mensagensNaoLidas > 0 && (
                    <span style={{
                      background: '#3b82f6',
                      color: 'white',
                      borderRadius: '12px',
                      padding: '2px 8px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      marginLeft: '8px'
                    }}>
                      {mensagensNaoLidas > 99 ? '99+' : mensagensNaoLidas}
                    </span>
                  )}
                </button>

                <button 
                  onClick={() => {
                    logout()
                    navigate('/')
                    setShowProfileMenu(false)
                  }}
                  className="menu-item logout"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header