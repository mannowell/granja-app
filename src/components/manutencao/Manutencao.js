import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import api from '../../services/api';
import ManutencaoList from './ManutencaoList';
import ManutencaoForm from './ManutencaoForm';
import '../../styles/Manutencao.css';

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

  const handleDelete = async (id) => {
    try {
      await api.delete(`/manutencao/tarefas/${id}`);
      refetch();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      alert('Erro ao excluir tarefa de manutenção');
    }
  };

  const handleFinalizar = async (id) => {
    try {
      await api.put(`/manutencao/tarefas/${id}/finalizar`);
      refetch();
    } catch (error) {
      console.error('Erro ao finalizar tarefa:', error);
      alert('Erro ao finalizar tarefa de manutenção');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedTarefa(null);
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar tarefas</div>;

  return (
    <div className="manutencao">
      <div className="page-header">
        <h2>Manutenção</h2>
        <button onClick={handleAdd} className="btn-add">
          <i className="fas fa-plus"></i> Nova Tarefa
        </button>
      </div>

      <ManutencaoList 
        tarefas={tarefas} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFinalizar={handleFinalizar}
      />

      {showForm && (
        <ManutencaoForm
          tarefa={selectedTarefa}
          onClose={handleCloseForm}
          onSave={refetch}
        />
      )}
    </div>
  );
}

export default Manutencao; 