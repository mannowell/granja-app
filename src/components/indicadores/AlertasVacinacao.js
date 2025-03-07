import React from 'react';
import { useApi } from '../../hooks/useApi';

function AlertasVacinacao({ refreshInterval }) {
  const { data: alertas, loading, error } = useApi('/sanitario/vacinas/pendentes', [], true);

  if (loading) return <div className="indicador-card">Carregando alertas de vacinação...</div>;
  if (error) return (
    <div className="indicador-card">
      <h3>Alertas de Vacinação</h3>
      <div className="error-message">
        Não foi possível carregar os alertas de vacinação
      </div>
    </div>
  );

  const getPrioridade = (dataPrevisao) => {
    if (!dataPrevisao) return 'baixa';
    try {
      const dias = Math.floor((new Date(dataPrevisao) - new Date()) / (1000 * 60 * 60 * 24));
      if (dias < 0) return 'alta';
      if (dias <= 2) return 'media';
      return 'baixa';
    } catch (err) {
      console.error('Erro ao calcular prioridade:', err);
      return 'baixa';
    }
  };

  const alertasSimulados = !alertas || !Array.isArray(alertas) || alertas.length === 0 ? [
    {
      id: 1,
      vacina: "Vacina A",
      data_prevista: new Date(Date.now() - 86400000).toISOString(), // Ontem
      lote_id: "L001",
      status: "Pendente"
    },
    {
      id: 2,
      vacina: "Vacina B",
      data_prevista: new Date(Date.now() + 86400000).toISOString(), // Amanhã
      lote_id: "L002",
      status: "Programada"
    },
    {
      id: 3,
      vacina: "Vacina C",
      data_prevista: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 dias
      lote_id: "L003",
      status: "Programada"
    }
  ] : alertas;

  return (
    <div className="indicador-card">
      <h3>Alertas de Vacinação</h3>
      <div className="alertas-lista">
        {alertasSimulados.map(alerta => (
          <div key={alerta.id} className={`alerta-item ${getPrioridade(alerta.data_prevista)}`}>
            <div className="alerta-header">
              <span className="alerta-vacina">{alerta.vacina}</span>
              <span className="alerta-data">
                {new Date(alerta.data_prevista).toLocaleDateString()}
              </span>
            </div>
            <div className="alerta-lote">Lote: {alerta.lote_id}</div>
            <div className="alerta-status">{alerta.status}</div>
          </div>
        ))}
        {(!alertasSimulados || alertasSimulados.length === 0) && (
          <div className="sem-alertas">Nenhuma vacinação pendente</div>
        )}
      </div>
    </div>
  );
}

export default AlertasVacinacao; 