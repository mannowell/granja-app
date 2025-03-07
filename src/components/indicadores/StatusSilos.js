import React from 'react';
import { useApi } from '../../hooks/useApi';

function StatusSilos({ refreshInterval }) {
  const { data: silos, loading, error } = useApi('/silos/status', refreshInterval);

  if (loading) return <div className="indicador-card">Carregando...</div>;
  if (error) return <div className="indicador-card">Erro ao carregar dados</div>;

  return (
    <div className="indicador-card">
      <h3>Status dos Silos</h3>
      <div className="silos-grid">
        {silos?.map(silo => (
          <div key={silo.id} className="silo-item">
            <div className="silo-nome">Silo {silo.id}</div>
            <div className="silo-container">
              <div 
                className="silo-nivel"
                style={{
                  background: `linear-gradient(to top, #3498db ${(silo.nivel_atual/silo.capacidade_total)*100}%, #e0e0e0 0%)`
                }}
              />
            </div>
            <div className="silo-info">
              <div className="silo-tipo">{silo.tipo_racao}</div>
              <div className="silo-percentual">
                {Math.round((silo.nivel_atual/silo.capacidade_total)*100)}%
              </div>
              {silo.nivel_atual <= silo.alerta_minimo && (
                <div className="silo-alerta">Nível Baixo!</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatusSilos; 