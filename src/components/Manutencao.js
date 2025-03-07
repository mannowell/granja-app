import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import TarefasList from './manutencao/TarefasList';
import TarefaForm from './manutencao/TarefaForm';
import './styles/Manutencao.css';

function Manutencao() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTarefa, setSelectedTarefa] = useState(null);
  const { data: tarefas, loading, error, refetch } = useApi('/manutencao/tarefas');

  const handleAdd = () => {
    setSelectedTarefa(null);
    setShowForm(true);
  };

  const handleEdit = (tarefa) => {
    setSelectedTarefa(tarefa);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedTarefa(null);
  };

  const handleFinalizarTarefa = async (id) => {
    try {
      const response = await fetch(`/api/manutencao/tarefas/${id}/finalizar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (!response.ok) throw new Error('Erro ao finalizar tarefa');
      
      refetch();
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <div className="manutencao">
      <div className="page-header">
        <h2>Manutenção</h2>
        <button className="btn-primary" onClick={handleAdd}>
          Nova Tarefa
        </button>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : error ? (
        <div className="error">Erro ao carregar tarefas: {error}</div>
      ) : (
        <TarefasList 
          tarefas={tarefas}
          onEdit={handleEdit}
          onFinalizar={handleFinalizarTarefa}
        />
      )}

      {showForm && (
        <TarefaForm
          tarefa={selectedTarefa}
          onClose={handleCloseForm}
          onSave={refetch}
        />
      )}
    </div>
  );
}

export default Manutencao; 