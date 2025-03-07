import React from 'react';
import { useApi } from '../../hooks/useApi';

function VacinacaoList({ onEdit }) {
  const { data: vacinacoes, loading, error } = useApi('/vacinacao-lote');

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">Erro ao carregar vacinações</div>;

  const getStatusClass = (status, dataPrevista) => {
    if (status === 'realizada') return 'status-realizada';
    if (status === 'atrasada' || 
        (status === 'pendente' && new Date(dataPrevista) < new Date())) {
      return 'status-atrasada';
    }
    return 'status-pendente';
  };

  return (
    <div className="vacinacao-list">
      <div className="list-header">
        <div>Data Prevista</div>
        <div>Lote</div>
        <div>Vacina</div>
        <div>Status</div>
        <div>Data Aplicação</div>
        <div>Ações</div>
      </div>
      {vacinacoes?.map(vacinacao => (
        <div key={vacinacao.id} className="list-item">
          <div>{new Date(vacinacao.data_prevista).toLocaleDateString()}</div>
          <div>#{vacinacao.lote_id}</div>
          <div>{vacinacao.vacina}</div>
          <div className={`status ${getStatusClass(vacinacao.status, vacinacao.data_prevista)}`}>
            {vacinacao.status}
          </div>
          <div>
            {vacinacao.data_aplicacao 
              ? new Date(vacinacao.data_aplicacao).toLocaleDateString()
              : '-'}
          </div>
          <div className="actions">
            <button onClick={() => onEdit(vacinacao)}>Editar</button>
            <button 
              className="btn-view"
              onClick={() => window.location.href = `/lotes/${vacinacao.lote_id}`}
            >
              Ver Lote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VacinacaoList; 