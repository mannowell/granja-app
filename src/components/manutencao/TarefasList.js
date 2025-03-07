import React from 'react';

function TarefasList({ tarefas, onEdit, onFinalizar }) {
  const getPrioridadeClass = (prioridade) => {
    switch (prioridade) {
      case 'alta': return 'prioridade-alta';
      case 'media': return 'prioridade-media';
      case 'baixa': return 'prioridade-baixa';
      default: return '';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'atrasada': return 'status-atrasada';
      case 'pendente': return 'status-pendente';
      case 'em_andamento': return 'status-em-andamento';
      case 'concluida': return 'status-concluida';
      default: return '';
    }
  };

  // Verificar se há tarefas para exibir
  if (!tarefas || tarefas.length === 0) {
    return <div className="no-data">Nenhuma tarefa de manutenção encontrada</div>;
  }

  return (
    <div className="tarefas-list">
      <div className="list-header">
        <div>Data Prevista</div>
        <div>Título</div>
        <div>Descrição</div>
        <div>Prioridade</div>
        <div>Status</div>
        <div>Ações</div>
      </div>
      {tarefas?.map(tarefa => (
        <div key={tarefa.id} className="list-item">
          <div>{tarefa.data_prevista ? new Date(tarefa.data_prevista).toLocaleDateString() : 'Não definida'}</div>
          <div>{tarefa.titulo}</div>
          <div className="descricao-curta">{tarefa.descricao.substring(0, 50)}...</div>
          <div className={`prioridade ${getPrioridadeClass(tarefa.prioridade)}`}>
            {tarefa.prioridade}
          </div>
          <div className={`status ${getStatusClass(tarefa.status)}`}>
            {tarefa.status}
          </div>
          <div className="actions">
            <button onClick={() => onEdit(tarefa)}>Editar</button>
            {tarefa.status !== 'concluida' && (
              <button 
                className="btn-finalizar"
                onClick={() => onFinalizar(tarefa.id)}
              >
                Finalizar
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TarefasList; 