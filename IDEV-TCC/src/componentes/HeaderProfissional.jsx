import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../assets/css/HeaderProfissional.css'

function HeaderProfissional({ secaoAtiva, setSecaoAtiva, aoClicarLogin }) {
  const [menuAberto, setMenuAberto] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [mensagensNaoLidas, setMensagensNaoLidas] = useState(0)
  const { isLoggedIn, user, logout, switchUserType } = useAuth()
  const navigate = useNavigate()
  
  const userData = user ? {
    id: user.id,
    name: user.nome,
    avatar: user.fotoPerfil ? `http://localhost:8080${user.fotoPerfil}` : '/src/assets/imagens/gato-de-terno-suit-cat.png'
  } : null

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

  const handleNavigation = (secao) => {
    setSecaoAtiva(secao)
    setMenuAberto(false)
    
    switch(secao) {
      case 'inicio':
        navigate('/dashboard-profissional')
        break
      case 'perfil-profissional':
        navigate('/perfil-profissional')
        break
      case 'chat':
        navigate('/chat')
        break
      case 'notificacoes':
      case 'agenda':
      case 'avaliacoes':
        // Estas seções são internas do dashboard
        break
      default:
        break
    }
  }

  return (
    <header className="header-profissional">
      <div className="header-container">
        <div className="logo" onClick={() => { navigate('/dashboard-profissional'); setSecaoAtiva('inicio'); }}>
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
        
        {/* COMENTADO: Navegação removida - apenas dashboard com conteúdo "Início" visível */}
        {/* <nav className={`nav ${menuAberto ? 'mobile-open' : ''}`}>
          <button
            onClick={() => handleNavigation('inicio')}
            className={`nav-item ${secaoAtiva === 'inicio' ? 'active' : ''}`}
          >
            Início
          </button>
          <button
            onClick={() => handleNavigation('notificacoes')}
            className={`nav-item ${secaoAtiva === 'notificacoes' ? 'active' : ''}`}
          >
            Notificações
          </button>
          <button
            onClick={() => handleNavigation('agenda')}
            className={`nav-item ${secaoAtiva === 'agenda' ? 'active' : ''}`}
          >
            Agenda
          </button>

          <button
            onClick={() => handleNavigation('avaliacoes')}
            className={`nav-item ${secaoAtiva === 'avaliacoes' ? 'active' : ''}`}
          >
            Avaliações
          </button>
        </nav> */}

        <div className="user-profile-container">
          <div 
            className="user-profile" 
            onClick={(e) => {
              e.stopPropagation()
              setShowProfileMenu(!showProfileMenu)
            }}
          >
            <img src={userData?.avatar} alt={userData?.name} className="user-avatar" />
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
                  navigate('/perfil-profissional')
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
      </div>
    </header>
  )
}

export default HeaderProfissional