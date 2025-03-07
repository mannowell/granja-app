import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import LotesList from './lotes/LotesList';
import LoteForm from './lotes/LoteForm';
import LoteDetails from './lotes/LoteDetails';

function GestaoLotes() {
  const [showForm, setShowForm] = useState(false);
  const [selectedLote, setSelectedLote] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const { data: lotes, loading, error, refetch } = useApi('/lotes');

  const handleAdd = () => {
    setSelectedLote(null);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleEdit = (lote) => {
    setSelectedLote(lote);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/lotes/${id}`);
      refetch();
    } catch (error) {
      console.error('Erro ao excluir lote:', error);
      alert('Erro ao excluir lote. Verifique se não existem registros associados.');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedLote(null);
  };

  const handleSave = async (lote) => {
    try {
      if (selectedLote) {
        await api.put(`/lotes/${selectedLote.id}`, lote);
      } else {
        await api.post('/lotes', lote);
      }
      refetch();
      handleCloseForm();
    } catch (error) {
      console.error('Erro ao salvar lote:', error);
      alert('Erro ao salvar lote.');
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar lotes</div>;

  return (
    <div className="gestao-lotes">
      <div className="page-header">
        <h2>Gestão de Lotes</h2>
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

      {showDetails && selectedLote && (
        <LoteDetails
          lote={selectedLote}
          onClose={() => setShowDetails(false)}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

export default GestaoLotes; 