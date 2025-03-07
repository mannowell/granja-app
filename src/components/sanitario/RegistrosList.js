import React from 'react';
import '../../styles/shared/ActionButtons.css';

function RegistrosList({ registros, onEdit, onDelete, onConcluir, onReverter }) {
  return (
    <div className="registros-list">
      <div className="list-header">
        <div>Data</div>
        <div>Lote</div>
        <div>Tipo</div>
        <div>Descrição</div>
        <div>Status</div>
        <div>Ações</div>
      </div>
      
      {registros?.map(registro => (
        <div key={registro.id} className={`list-item status-${registro.status}`}>
          <div>{new Date(registro.data_prevista).toLocaleDateString()}</div>
          <div>Lote {registro.lote_id}</div>
          <div>{registro.tipo}</div>
          <div>{registro.descricao}</div>
          <div className={`status-badge ${registro.status}`}>
            {registro.status}
          </div>
          <div className="actions">
            <button 
              className="btn-icon btn-edit"
              onClick={() => onEdit(registro)}
              title="Editar"
            >
              <i className="fas fa-edit"></i>
            </button>
            
            <button 
              className="btn-icon btn-delete"
              onClick={() => onDelete(registro.id)}
              title="Excluir"
            >
              <i className="fas fa-trash"></i>
            </button>

            {registro.status === 'pendente' && (
              <button 
                className="btn-icon btn-complete"
                onClick={() => onConcluir(registro.id)} 
                title="Concluir"
              >
                <i className="fas fa-check"></i>
              </button>
            )}

            {registro.status === 'concluido' && (
              <button 
                className="btn-icon btn-revert"
                onClick={() => onReverter(registro.id)} 
                title="Reverter"
              >
                <i className="fas fa-undo"></i>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RegistrosList; 