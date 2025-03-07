import React from 'react';
import '../../styles/shared/ActionButtons.css';

function LotesList({ lotes, onEdit, onDelete }) {
  const formatarData = (data) => {
    if (!data) return '-';
    try {
      return new Date(data).toLocaleDateString();
    } catch (error) {
      return '-';
    }
  };

  return (
    <div className="lotes-list">
      <div className="list-header">
        <div>Pavilhão</div>
        <div>Data Entrada</div>
        <div>Quantidade</div>
        <div>Peso Médio</div>
        <div>Status</div>
        <div>Ações</div>
      </div>

      {lotes?.map(lote => (
        <div key={lote.id} className={`list-item status-${lote.status}`}>
          <div>Pavilhão {lote.pavilhao_id}</div>
          <div>{formatarData(lote.data_entrada)}</div>
          <div>{lote.quantidade_inicial} animais</div>
          <div>{lote.peso_medio_inicial} kg</div>
          <div className={`status-badge ${lote.status}`}>
            {lote.status}
          </div>
          <div className="actions">
            <button 
              className="btn-icon btn-edit"
              onClick={() => onEdit(lote)}
              title="Editar"
            >
              <i className="fas fa-edit"></i>
            </button>
            
            <button 
              className="btn-icon btn-delete"
              onClick={() => onDelete(lote.id)}
              title="Excluir"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LotesList; 