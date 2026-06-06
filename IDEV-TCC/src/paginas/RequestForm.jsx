// FUNCIONALIDADE DE REQUEST VINCULADA A PROJETOS DESATIVADA
// Esta funcionalidade foi removida pois a tabela PROJETO não está mais sendo utilizada
// Mantido comentado para possível reativação futura

/*
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from '../componentes/Header'
import HeaderProfissional from '../componentes/HeaderProfissional'
import PageTransition from '../componentes/PageTransition'


function RequestForm() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    projetoId: '',
    categoria: '',
    mensagem: '',
    anexo: ''
  })
  const [projetos, setProjetos] = useState([])
  const [enviando, setEnviando] = useState(false)
  
  useEffect(() => {
    const carregarProjetos = async () => {
      try {
        const endpoint = user?.tipo === 'profissional' ? 
          `profissional/${user.id}` : `empresa/${user.id}`
        const response = await fetch(`http://localhost:8080/api/v1/projeto/${endpoint}`)
        if (response.ok) {
          const data = await response.json()
          setProjetos(data.filter(p => p.status === 'FINALIZADO'))
        }
      } catch (error) {
        console.error('Erro ao carregar projetos:', error)
      }
    }
    if (user) carregarProjetos()
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    
    try {
      if (!formData.projetoId) {
        alert('Selecione um projeto finalizado')
        return
      }
      
      const projeto = projetos.find(p => p.id == formData.projetoId)
      const destinatarioId = user.tipo === 'profissional' ? projeto.empresaId : projeto.profissionalId
      
      const request = {
        remetenteId: user.id,
        destinatarioId: destinatarioId,
        projetoId: parseInt(formData.projetoId),
        categoria: formData.categoria,
        mensagem: formData.mensagem,
        anexo: formData.anexo || null
      }
      
      const response = await fetch('http://localhost:8080/api/v1/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })
      
      if (!response.ok) throw new Error('Erro ao enviar request')
      alert('Request enviado com sucesso!')
      setFormData({ projetoId: '', categoria: '', mensagem: '', anexo: '' })
      navigate('/requests')
    } catch (error) {
      console.error('Erro ao enviar request:', error)
      alert('Erro ao enviar request')
    } finally {
      setEnviando(false)
    }
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '600px',
          padding: '2.5rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 0.5rem 0'
            }}>
              Enviar Request
            </h1>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              margin: 0
            }}>
              Envie feedback sobre projetos finalizados
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Projeto Finalizado *
              </label>
              <select
                name="projetoId"
                value={formData.projetoId}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="" disabled>Selecione um projeto finalizado</option>
                {projetos.map(projeto => (
                  <option key={projeto.id} value={projeto.id}>{projeto.titulo}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Categoria *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="" disabled>Selecione uma categoria</option>
                <option value="reclamacao">Reclamação</option>
                <option value="sugestao">Sugestão</option>
                <option value="elogio">Elogio</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Mensagem *
              </label>
              <textarea
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                required
                rows={5}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
                placeholder="Escreva sua mensagem..."
              />
            </div>



            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Anexo (URL)
              </label>
              <input
                type="url"
                name="anexo"
                value={formData.anexo}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="https://exemplo.com/arquivo.png"
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'space-between',
              marginTop: '1rem'
            }}>
              <button
                type="button"
                onClick={() => navigate('/requests')}
                style={{
                  padding: '0.875rem 2rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Ver Meus Requests
              </button>
              <button
                type="submit"
                disabled={enviando}
                style={{
                  padding: '0.875rem 2rem',
                  backgroundColor: enviando ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: enviando ? 'not-allowed' : 'pointer'
                }}
              >
                {enviando ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </PageTransition>
  )
}

export default RequestForm
*/