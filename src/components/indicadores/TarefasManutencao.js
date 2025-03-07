import React from 'react';
import { useApi } from '../../hooks/useApi';

function TarefasManutencao({ refreshInterval }) {
  const { data: tarefas, loading, error } = useApi('/manutencao/tarefas', [], 
    // Definindo loadOnMount como true para carregar os dados ao inicializar
    true);
  
  // Verifica se a data prevista já passou
  const isAtrasada = (dataPrevista) => {
    const hoje = new Date();
    const data = new Date(dataPrevista);
    return data < hoje;
  };

  // Determina a lista de tarefas pendentes e atrasadas com base nos dados
  const getTarefasFiltradas = () => {
    if (!tarefas || !Array.isArray(tarefas)) return { pendentes: [], atrasadas: [] };
    
    const pendentes = [];
    const atrasadas = [];
    
    tarefas.forEach(tarefa => {
      if (tarefa.status === 'pendente') {
        if (isAtrasada(tarefa.data_prevista)) {
          atrasadas.push(tarefa);
        } else {
          pendentes.push(tarefa);
        }
      }
    });
    
    return { pendentes, atrasadas };
  };
  
  const { pendentes, atrasadas } = getTarefasFiltradas();
  const temTarefas = pendentes.length > 0 || atrasadas.length > 0;

  if (loading) return <div className="indicador-card">Carregando tarefas de manutenção...</div>;
  if (error) return <div className="indicador-card">Erro ao carregar tarefas de manutenção</div>;

  return (
    <div className="indicador-card">
      <h3>Tarefas de Manutenção</h3>
      
      {!temTarefas && (
        <div className="tarefas-vazia">
          <p>Não há tarefas de manutenção pendentes.</p>
        </div>
      )}
      
      {temTarefas && (
        <div className="tarefas-container">
          {atrasadas.length > 0 && (
            <div className="tarefas-atrasadas">
              <h4>Atrasadas ({atrasadas.length})</h4>
              {atrasadas.map(tarefa => (
                <div key={tarefa.id} className="tarefa-item alta">
                  <div className="tarefa-titulo">{tarefa.titulo}</div>
                  <div className="tarefa-data">
                    Previsto: {new Date(tarefa.data_prevista).toLocaleDateString()}
                  </div>
                  <div className="tarefa-prioridade">Prioridade: {tarefa.prioridade}</div>
                </div>
              ))}
            </div>
          )}
          
          {pendentes.length > 0 && (
            <div className="tarefas-pendentes">
              <h4>Pendentes ({pendentes.length})</h4>
              {pendentes.map(tarefa => (
                <div key={tarefa.id} className={`tarefa-item ${tarefa.prioridade}`}>
                  <div className="tarefa-titulo">{tarefa.titulo}</div>
                  <div className="tarefa-data">
                    Previsto: {new Date(tarefa.data_prevista).toLocaleDateString()}
                  </div>
                  <div className="tarefa-prioridade">Prioridade: {tarefa.prioridade}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TarefasManutencao; 