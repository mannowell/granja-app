import React from 'react';
import { useApi } from '../../hooks/useApi';
import './styles/AlertasSilos.css';

function AlertasSilos({ refreshInterval }) {
  const { data: alertas, loading, error } = useApi('/silos/alertas', [], refreshInterval);
  const { data: silosStatus } = useApi('/silos/status', [], refreshInterval);

  if (loading) return <div className="indicador-card">Carregando alertas de silos...</div>;
  if (error) return <div className="indicador-card">Erro ao carregar alertas de silos</div>;

  // Filtrar silos com nível crítico (menos de 20%)
  const silosCriticos = silosStatus ? silosStatus.filter(s => 
    (s.nivel_atual / s.capacidade_total) < 0.2
  ) : [];

  const temAlertas = (alertas && alertas.length > 0) || silosCriticos.length > 0;

  return (
    <div className="indicador-card alertas-silos">
      <h3>Alertas de Silos</h3>
      
      {!temAlertas ? (
        <div className="sem-alertas">
          <i className="fas fa-check-circle"></i>
          <p>Todos os silos estão com níveis adequados</p>
        </div>
      ) : (
        <div className="lista-alertas">
          {alertas && alertas.map(alerta => (
            <div key={alerta.id} className="alerta-item critico">
              <i className="fas fa-exclamation-triangle"></i>
              <div className="alerta-conteudo">
                <div className="alerta-titulo">
                  Silo {alerta.silo_numero} - {alerta.pavilhao_numero ? `Pavilhão ${alerta.pavilhao_numero}` : 'Não associado'}
                </div>
                <div className="alerta-detalhes">
                  Nível crítico: {alerta.nivel_atual.toFixed(0)}kg disponível 
                  ({((alerta.nivel_atual / alerta.nivel_necessario) * 100).toFixed(0)}% do necessário)
                </div>
                <div className="alerta-data">
                  {new Date(alerta.data_alerta).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
          
          {silosCriticos.map(silo => {
            // Verificar se este silo já tem um alerta registrado
            const temAlerta = alertas && alertas.some(a => a.silo_id === silo.id);
            if (temAlerta) return null; // Não exibir duplicados
            
            return (
              <div key={`silo-${silo.id}`} className="alerta-item baixo">
                <i className="fas fa-arrow-down"></i>
                <div className="alerta-conteudo">
                  <div className="alerta-titulo">
                    Silo {silo.numero} - {silo.pavilhao_numero ? `Pavilhão ${silo.pavilhao_numero}` : 'Não associado'}
                  </div>
                  <div className="alerta-detalhes">
                    Nível baixo: {silo.nivel_atual.toFixed(0)}kg 
                    ({silo.percentual_nivel.toFixed(0)}% da capacidade)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="acoes-silos">
        <a href="/silos" className="btn-ver-todos">
          Gerenciar Silos <i className="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  );
}

export default AlertasSilos; 