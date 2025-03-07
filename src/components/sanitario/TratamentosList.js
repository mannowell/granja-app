import React from 'react';
import { useApi } from '../../hooks/useApi';

function TratamentosList({ onEdit }) {
  const { data: tratamentos, loading, error } = useApi('/tratamentos');

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">Erro ao carregar tratamentos</div>;

  return (
    <div className="tratamentos-list">
      <div className="list-header">
        <div>Data Início</div>
        <div>Lote</div>
        <div>Medicamento</div>
        <div>Motivo</div>
        <div>Status</div>
        <div>Ações</div>
      </div>
      {tratamentos?.map(tratamento => (
        <div key={tratamento.id} className="list-item">
          <div>{new Date(tratamento.data_inicio).toLocaleDateString()}</div>
          <div>#{tratamento.lote_id}</div>
          <div>{tratamento.medicamento}</div>
          <div className="motivo">{tratamento.motivo}</div>
          <div className={`status status-${tratamento.status}`}>
            {tratamento.status}
          </div>
          <div className="actions">
            <button onClick={() => onEdit(tratamento)}>Editar</button>
            <button 
              className="btn-view"
              onClick={() => window.location.href = `/lotes/${tratamento.lote_id}`}
            >
              Ver Lote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TratamentosList; 