import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import './styles/Silos.css';
import ControleSilos from './silos/ControleSilos';

function Silos() {
  const [silosData, setSilosData] = useState({ silos: [], pavilhoes: [] });
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSilo, setSelectedSilo] = useState(null);
  const [quantidade, setQuantidade] = useState(0);
  const [showReabastecerModal, setShowReabastecerModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchSilos();
    fetchAlertas();
  }, []);

  const fetchSilos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/silos');
      setSilosData(response.data || { silos: [], pavilhoes: [] });
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar silos:', err);
      setError('Falha ao carregar os dados dos silos');
      setLoading(false);
    }
  };

  const fetchAlertas = async () => {
    try {
      const response = await api.get('/silos/alertas');
      setAlertas(response.data || []);
    } catch (err) {
      console.error('Erro ao carregar alertas de silos:', err);
    }
  };

  const handleResolverAlerta = async (id) => {
    try {
      await api.put(`/silos/alertas/${id}/resolver`);
      toast.success('Alerta marcado como resolvido');
      fetchAlertas();
    } catch (err) {
      console.error('Erro ao resolver alerta:', err);
      toast.error('Falha ao resolver o alerta');
    }
  };

  const handleReabastecer = async () => {
    if (!selectedSilo || quantidade <= 0) {
      toast.error('Por favor, selecione um silo e forneça uma quantidade válida');
      return;
    }

    try {
      await api.post(`/silos/${selectedSilo.id}/reabastecer`, { quantidade });
      toast.success(`Silo ${selectedSilo.numero} reabastecido com ${quantidade}kg`);
      fetchSilos();
      fetchAlertas();
      setShowReabastecerModal(false);
      setSelectedSilo(null);
      setQuantidade(0);
    } catch (err) {
      console.error('Erro ao reabastecer silo:', err);
      toast.error('Falha ao reabastecer o silo');
    }
  };

  const openReabastecerModal = (silo) => {
    setSelectedSilo(silo);
    setShowReabastecerModal(true);
  };

  const getStatusClass = (nivelAtual, capacidade) => {
    const percentual = (nivelAtual / capacidade) * 100;
    if (percentual < 20) return 'critico';
    if (percentual < 40) return 'baixo';
    if (percentual < 70) return 'medio';
    return 'alto';
  };

  const silos = silosData.silos || [];

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="silos-container">
      <h2 className="page-title">Gestão de Silos</h2>

      <div className="silos-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Visão Geral
        </button>
        <button 
          className={`tab-button ${activeTab === 'gerenciar' ? 'active' : ''}`}
          onClick={() => setActiveTab('gerenciar')}
        >
          Gerenciar Silos
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="silos-grid">
          <div className="silos-list">
            <h3>Status dos Silos</h3>
            <div className="silos-cards">
              {silos.map(silo => (
                <div 
                  key={silo.id} 
                  className={`silo-card ${getStatusClass(silo.nivel_atual, silo.capacidade_total)}`}
                >
                  <div className="silo-header">
                    <h4>Silo {silo.numero}</h4>
                    <span>{silo.pavilhao_numero ? `Pavilhão ${silo.pavilhao_numero}` : 'Não associado'}</span>
                  </div>
                  <div className="silo-body">
                    <div className="silo-info">
                      <span>Tipo de Ração: {silo.tipo_racao}</span>
                      <span>Fase: {silo.fase_nome}</span>
                    </div>
                    <div className="silo-level">
                      <div className="level-bar">
                        <div 
                          className="level-fill" 
                          style={{height: `${Math.min(100, (silo.nivel_atual / silo.capacidade_total) * 100)}%`}}
                        ></div>
                      </div>
                      <div className="level-info">
                        <span>{silo.nivel_atual}kg</span>
                        <span>/{silo.capacidade_total}kg</span>
                      </div>
                    </div>
                  </div>
                  <div className="silo-footer">
                    <button 
                      className="btn-reabastecer" 
                      onClick={() => openReabastecerModal(silo)}
                    >
                      Reabastecer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="alertas-list">
            <h3>Alertas de Silos</h3>
            {alertas.length === 0 ? (
              <div className="sem-alertas">
                <p>Não há alertas ativos</p>
              </div>
            ) : (
              <div className="lista-alertas">
                {alertas.map(alerta => (
                  <div 
                    key={alerta.id} 
                    className={`alerta-item ${alerta.tipo_alerta}`}
                  >
                    <div className="alerta-header">
                      <h4>Alerta: Silo {alerta.silo_numero}</h4>
                      <span>Pavilhão {alerta.pavilhao_numero}</span>
                    </div>
                    <div className="alerta-content">
                      <p>
                        <strong>Nível atual:</strong> {alerta.nivel_atual}kg
                      </p>
                      <p>
                        <strong>Nível necessário:</strong> {alerta.nivel_necessario}kg
                      </p>
                      <p>
                        <strong>Data do alerta:</strong> {new Date(alerta.data_alerta).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="alerta-footer">
                      <button 
                        className="btn-resolver" 
                        onClick={() => handleResolverAlerta(alerta.id)}
                      >
                        Marcar como Resolvido
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <ControleSilos onSiloUpdate={() => { fetchSilos(); fetchAlertas(); }} />
      )}

      {showReabastecerModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reabastecer Silo {selectedSilo.numero}</h3>
            <div className="form-group">
              <label>Quantidade (kg):</label>
              <input 
                type="number" 
                value={quantidade} 
                onChange={(e) => setQuantidade(Number(e.target.value))}
                min="1"
                max={selectedSilo.capacidade_total - selectedSilo.nivel_atual}
              />
              <small>
                Capacidade restante: {selectedSilo.capacidade_total - selectedSilo.nivel_atual}kg
              </small>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-cancelar" 
                onClick={() => setShowReabastecerModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirmar" 
                onClick={handleReabastecer}
                disabled={quantidade <= 0}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Silos; 