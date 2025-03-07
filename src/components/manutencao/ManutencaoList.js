import React from 'react';
import '../../styles/shared/ActionButtons.css';

function ManutencaoList({ tarefas, onEdit, onDelete, onFinalizar }) {
  return (
    <div className="manutencao-list">
      <div className="list-header">
        <div>Data Prevista</div>
        <div>Título</div>
        <div>Área</div>
        <div>Prioridade</div>
        <div>Status</div>
        <div>Ações</div>
      </div>
      
      {tarefas?.map(tarefa => (
        <div key={tarefa.id} className={`list-item status-${tarefa.status}`}>
          <div>{new Date(tarefa.data_prevista).toLocaleDateString()}</div>
          <div>{tarefa.titulo}</div>
          <div>{tarefa.area}</div>
          <div className={`prioridade-badge ${tarefa.prioridade}`}>
            {tarefa.prioridade}
          </div>
          <div className={`status-badge ${tarefa.status}`}>
            {tarefa.status}
          </div>
          <div className="actions">
            <button 
              className="btn-icon btn-edit"
              onClick={() => onEdit(tarefa)}
              title="Editar"
            >
              <i className="fas fa-edit"></i>
            </button>
            
            <button 
              className="btn-icon btn-delete"
              onClick={() => onDelete(tarefa.id)}
              title="Excluir"
            >
              <i className="fas fa-trash"></i>
            </button>

            {tarefa.status === 'pendente' && (
              <button 
                className="btn-icon btn-complete"
                onClick={() => onFinalizar(tarefa.id)} 
                title="Finalizar"
              >
                <i className="fas fa-check"></i>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ManutencaoList; 