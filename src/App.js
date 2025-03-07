import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ControleLotes from './components/lotes';
import Silos from './components/Silos';
import RegistroSanitario from './components/sanitario/RegistroSanitario';
import Manutencao from './components/manutencao/Manutencao';
import Dashboard from './components/Dashboard';
import MortalidadeLotes from './components/MortalidadeLotes';
import './styles/App.css';

function App() {
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className={`app ${menuCollapsed ? 'menu-collapsed' : ''}`}>
        <nav className="sidebar">
          <div className="logo">
            <h1>GranjaApp</h1>
            <button className="menu-toggle" onClick={toggleMenu}>
              <i className={`fas ${menuCollapsed ? 'fa-bars' : 'fa-times'}`}></i>
            </button>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/dashboard">
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/lotes">
                <i className="fas fa-layer-group"></i>
                <span>Lotes</span>
              </Link>
            </li>
            <li>
              <Link to="/mortalidade">
                <i className="fas fa-heartbeat"></i>
                <span>Mortalidade</span>
              </Link>
            </li>
            <li>
              <Link to="/silos">
                <i className="fas fa-warehouse"></i>
                <span>Silos</span>
              </Link>
            </li>
            <li>
              <Link to="/sanitario">
                <i className="fas fa-notes-medical"></i>
                <span>Registro Sanitário</span>
              </Link>
            </li>
            <li>
              <Link to="/manutencao">
                <i className="fas fa-tools"></i>
                <span>Manutenção</span>
              </Link>
            </li>
          </ul>
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="user-details">
                <span className="user-name">Administrador</span>
                <span className="user-role">Gerente</span>
              </div>
            </div>
          </div>
        </nav>

        <main className="content">
          <header className="content-header">
            <div className="header-title">
              <h2>Sistema de Gerenciamento de Granja</h2>
            </div>
            <div className="header-actions">
              <button className="btn-notifications">
                <i className="fas fa-bell"></i>
                <span className="notification-badge">3</span>
              </button>
              <button className="btn-settings">
                <i className="fas fa-cog"></i>
              </button>
            </div>
          </header>
          <div className="content-body">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lotes" element={<ControleLotes />} />
              <Route path="/mortalidade" element={<MortalidadeLotes />} />
              <Route path="/silos" element={<Silos />} />
              <Route path="/sanitario" element={<RegistroSanitario />} />
              <Route path="/manutencao" element={<Manutencao />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;