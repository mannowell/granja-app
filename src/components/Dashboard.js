import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Dashboard.css';
import TotalAnimais from './indicadores/TotalAnimais';
import StatusSilos from './indicadores/StatusSilos';
import AlertasVacinacao from './indicadores/AlertasVacinacao';
import IndiceMortalidade from './indicadores/IndiceMortalidade';
import TarefasManutencao from './indicadores/TarefasManutencao';
import AlertasSilos from './indicadores/AlertasSilos';

function Dashboard() {
  const [stats, setStats] = useState({
    totalLotes: 0,
    silosAtivos: 0,
    registrosSanitarios: 0,
    manutencoesPendentes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Array para armazenar as respostas
        const responses = {
          lotes: { total: 0, ativos: 0 },
          silos: { total: 0, ativos: 0 },
          sanitario: { total: 0 },
          manutencao: { pendentes: 0 }
        };
        
        try {
          // Buscar dados de lotes
          const lotesRes = await api.get('/lotes/stats');
          responses.lotes = lotesRes.data;
        } catch (err) {
          console.error('Erro ao carregar estatísticas de lotes:', err);
        }
        
        try {
          // Buscar dados de silos
          const silosRes = await api.get('/silos/stats');
          responses.silos = silosRes.data;
        } catch (err) {
          console.error('Erro ao carregar estatísticas de silos:', err);
        }
        
        try {
          // Buscar dados sanitários
          const sanitarioRes = await api.get('/sanitario/stats');
          responses.sanitario = sanitarioRes.data;
        } catch (err) {
          console.error('Erro ao carregar estatísticas sanitárias:', err);
        }
        
        try {
          // Buscar dados de manutenção
          const manutencaoRes = await api.get('/manutencao/stats');
          responses.manutencao = manutencaoRes.data;
        } catch (err) {
          console.error('Erro ao carregar estatísticas de manutenção:', err);
        }

        // Atualizar o estado com os dados obtidos, usando valores padrão quando necessário
        setStats({
          totalLotes: responses.lotes?.total || 0,
          silosAtivos: responses.silos?.ativos || 0,
          registrosSanitarios: responses.sanitario?.total || 0,
          manutencoesPendentes: responses.manutencao?.pendentes || 0
        });
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        setError('Não foi possível carregar os dados do dashboard');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading">Carregando dados...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard">
      <h2 className="page-title">Dashboard</h2>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon lotes-icon">
            <i className="fas fa-layer-group"></i>
          </div>
          <div className="stat-content">
            <h3>Lotes Ativos</h3>
            <p className="stat-value">{stats.totalLotes}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon silos-icon">
            <i className="fas fa-warehouse"></i>
          </div>
          <div className="stat-content">
            <h3>Silos em Uso</h3>
            <p className="stat-value">{stats.silosAtivos}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon sanitario-icon">
            <i className="fas fa-notes-medical"></i>
          </div>
          <div className="stat-content">
            <h3>Registros Sanitários</h3>
            <p className="stat-value">{stats.registrosSanitarios}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon manutencao-icon">
            <i className="fas fa-tools"></i>
          </div>
          <div className="stat-content">
            <h3>Manutenções Pendentes</h3>
            <p className="stat-value">{stats.manutencoesPendentes}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-info">
        <h3>Atividades Recentes</h3>
        <p>Implementar lista de atividades recentes</p>
      </div>

      <div className="indicadores-grid">
        <TotalAnimais refreshInterval={300000} />
        <StatusSilos refreshInterval={300000} />
        <AlertasVacinacao refreshInterval={300000} />
        <IndiceMortalidade refreshInterval={300000} />
        <TarefasManutencao refreshInterval={300000} />
        <AlertasSilos refreshInterval={300000} />
      </div>
    </div>
  );
}

export default Dashboard; 