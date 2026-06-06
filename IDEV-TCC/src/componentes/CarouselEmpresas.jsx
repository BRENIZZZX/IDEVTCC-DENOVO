import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/css/Carousel.css'

function CarouselEmpresas({ empresas }) {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2)
      } else {
        setItemsPerPage(3)
      }
    }
    
    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => {
      const next = prev + 1
      return next >= empresas.length - itemsPerPage + 1 ? 0 : next
    })
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => {
      const next = prev - 1
      return next < 0 ? empresas.length - itemsPerPage : next
    })
    setTimeout(() => setIsAnimating(false), 500)
  }

  return (
    <div className="modern-carousel">
      <div className="carousel-header">
        <h2 className="carousel-title">Empresas Cadastradas</h2>
      </div>
      
      <div className="carousel-track">
        <div 
          className="carousel-slides"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
            transition: isAnimating ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
          }}
        >
          {empresas.map((empresa, index) => (
            <div 
              key={empresa.id} 
              className={`professional-card-modern ${index >= currentIndex && index < currentIndex + itemsPerPage ? 'visible' : ''}`}
              style={{ 
                width: `${100 / itemsPerPage}%`,
                animationDelay: `${(index - currentIndex) * 0.1}s`,
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/perfil/${empresa.id}`)}
            >
              <div className="card-header">
                <div className="professional-avatar">
                  <img
                    src={empresa.fotoPerfil ? `http://localhost:8080${empresa.fotoPerfil}` : 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&h=120&fit=crop'}
                    alt={empresa.nome}
                  />
                </div>
              </div>
              
              <div className="card-content">
                <h3 className="professional-name-modern">{empresa.nome}</h3>
                <p className="professional-title-modern">{empresa.bio || 'Empresa de TI'}</p>
                
                <div className="empresa-contatos" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {empresa.telefone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      {empresa.telefone}
                    </div>
                  )}
                  
                  <div className="empresa-redes" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {empresa.linkedinUrl && (
                      <a 
                        href={empresa.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ color: '#0077b5' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                    {empresa.instagramUrl && (
                      <a 
                        href={empresa.instagramUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ color: '#E4405F' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}
                    {empresa.twitterUrl && (
                      <a 
                        href={empresa.twitterUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ color: '#1DA1F2' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    )}
                    {empresa.siteUrl && (
                      <a 
                        href={empresa.siteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ color: '#6b7280' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="2" y1="12" x2="22" y2="12"/>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="card-footer">
                <button 
                  className="btn-modern btn-primary-modern"
                  style={{ width: '100%' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/perfil/${empresa.id}`)
                  }}
                >
                  Ver Perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="carousel-navigation">
        <button 
          className="nav-btn nav-btn-prev" 
          onClick={prevSlide}
          disabled={isAnimating}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button 
          className="nav-btn nav-btn-next" 
          onClick={nextSlide}
          disabled={isAnimating}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
      
      <div className="carousel-dots">
        {Array.from({ length: Math.ceil(empresas.length / itemsPerPage) }).map((_, index) => (
          <button
            key={index}
            className={`dot ${index === Math.floor(currentIndex / itemsPerPage) ? 'active' : ''}`}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true)
                setCurrentIndex(index * itemsPerPage)
                setTimeout(() => setIsAnimating(false), 500)
              }
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default CarouselEmpresas
