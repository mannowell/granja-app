import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import LotesList from './LotesList';
import LoteForm from './LoteForm';
import api from '../../services/api';
import '../../styles/Lotes.css';

function ControleLotes() {
  const [showForm, setShowForm] = useState(false);
  const [selectedLote, setSelectedLote] = useState(null);
  const { data: lotes, loading, error, refetch } = useApi('/lotes');

  const handleAdd = () => {
    setSelectedLote(null);
    setShowForm(true);
  };

  const handleEdit = (lote) => {
    setSelectedLote(lote);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este lote?')) return;
    
    try {
      await api.delete(`/lotes/${id}`);
      refetch();
    } catch (error) {
      console.error('Erro ao excluir lote:', error);
      alert('Erro ao excluir lote');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedLote(null);
  };

  const handleSave = async () => {
    await refetch();
    handleCloseForm();
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar lotes</div>;

  return (
    <div className="controle-lotes">
      <div className="page-header">
        <h2>Controle de Lotes</h2>
        <button onClick={handleAdd} className="btn-add">
          <i className="fas fa-plus"></i> Novo Lote
        </button>
      </div>

      <LotesList 
        lotes={lotes} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <LoteForm
          lote={selectedLote}
          onClose={handleCloseForm}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default ControleLotes; 