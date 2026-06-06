import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './paginas/Home'
import Dashboard from './paginas/Dashboard'
import About from './paginas/About'
import Cadastro from './paginas/Cadastro'
import Perfil from './paginas/Perfil'
import PerfilProfissional from './paginas/PerfilProfissional'
import PerfilEmpresa from './paginas/PerfilEmpresa'
import DashboardProfissional from './paginas/DashboardProfissional'
// COMENTADO: Funcionalidade de REQUEST vinculada a PROJETOS desativada
// import RequestForm from './paginas/RequestForm'
import RequestList from './paginas/RequestList'
import ContatoForm from './paginas/ContatoForm'
import CriarProjeto from './paginas/CriarProjeto'
import CandidatosProjeto from './paginas/CandidatosProjeto'
// COMENTADO: Rota de administrador desativada
// import Admin from './paginas/Admin'

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/perfil/:id" element={<Perfil />} />
        <Route path="/perfil-profissional" element={<PerfilProfissional />} />
        <Route path="/perfil-empresa" element={<PerfilEmpresa />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-profissional" element={<DashboardProfissional />} />
        {/* COMENTADO: Funcionalidade de REQUEST vinculada a PROJETOS desativada */}
        {/* <Route path="/request-form" element={<RequestForm />} /> */}
        <Route path="/contato-form" element={<ContatoForm />} />
        <Route path="/requests" element={<RequestList />} />
        <Route path="/criar-projeto" element={<CriarProjeto />} />
        <Route path="/projeto/:projetoId/candidatos" element={<CandidatosProjeto />} />
        <Route path="/about" element={<About />} />
        {/* COMENTADO: Rota de administrador desativada */}
        {/* <Route path="/admin" element={<Admin />} /> */}
      </Routes>
    </AuthProvider>
  );
};

export default App;