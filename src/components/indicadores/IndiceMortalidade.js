import React from 'react';
import { useApi } from '../../hooks/useApi';

function IndiceMortalidade({ refreshInterval }) {
  const { data: mortalidade, loading, error } = useApi('/animais/mortalidade', null, true);

  if (loading) return <div className="indicador-card">Carregando dados de mortalidade...</div>;
  if (error) return <div className="indicador-card">Erro ao carregar dados de mortalidade</div>;

  // Valores padrão caso não haja dados
  const dadosMortalidade = mortalidade || {
    total: 0,
    taxaPercentual: 0,
    porDia: []
  };

  return (
    <div className="indicador-card">
      <h3>Índice de Mortalidade</h3>
      <div className="indicador-valor">
        {(dadosMortalidade.taxaPercentual || 0).toFixed(2)}%
      </div>
      <div className="indicador-detalhes">
        <h4>Principais Causas:</h4>
        <div className="causas-lista">
          {dadosMortalidade.causas_principais?.map((causa, index) => (
            <div key={index} className="causa-item">
              <span className="causa-nome">{causa.causa}</span>
              <span className="causa-valor">{causa.total}</span>
            </div>
          ))}
        </div>
        <div className="total-mortes">
          Total de baixas: {dadosMortalidade.total || 0}
        </div>
      </div>
    </div>
  );
}

export default IndiceMortalidade; 