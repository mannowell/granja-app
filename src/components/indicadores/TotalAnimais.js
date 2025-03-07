import React from 'react';
import { useApi } from '../../hooks/useApi';

function TotalAnimais({ refreshInterval }) {
  const { data, loading, error } = useApi('/animais/total', refreshInterval);

  if (loading) return <div className="indicador-card">Carregando...</div>;
  if (error) return <div className="indicador-card">Erro ao carregar dados</div>;

  return (
    <div className="indicador-card">
      <h3>Total de Animais</h3>
      <div className="indicador-valor">{data?.total || 0}</div>
      <div className="indicador-detalhes">
        {data?.porFase && Object.entries(data.porFase).map(([fase, quantidade]) => (
          <div key={fase}>
            {fase}: {quantidade}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TotalAnimais; 