import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import api from '../../services/api';
import RegistrosList from './RegistrosList';
import RegistroForm from './RegistroForm';
import '../../styles/Sanitario.css';

function RegistroSanitario() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRegistro, setSelectedRegistro] = useState(null);
  const { data: registros, loading, error, refetch } = useApi('/sanitario/registros');

  const handleAdd = () => {
    setSelectedRegistro(null);
    setShowForm(true);
  };

  const handleEdit = (registro) => {
    setSelectedRegistro(registro);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/sanitario/registros/${id}`);
      refetch();
    } catch (error) {
      console.error('Erro ao excluir registro:', error);
      alert('Erro ao excluir registro sanitário');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedRegistro(null);
  };

  const handleConcluir = async (id) => {
    try {
      await api.put(`/sanitario/registros/${id}/concluir`, {
        data_conclusao: new Date().toISOString().split('T')[0]
      });
      refetch();
    } catch (error) {
      console.error('Erro ao concluir registro:', error);
    }
  };

  const handleReverter = async (id) => {
    try {
      await api.put(`/sanitario/registros/${id}/reverter`);
      refetch();
    } catch (error) {
      console.error('Erro ao reverter registro:', error);
      alert('Erro ao reverter registro sanitário');
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar registros</div>;

  return (
    <div className="registro-sanitario">
      <div className="page-header">
        <h2>Registros Sanitários</h2>
        <button onClick={handleAdd} className="btn-add">
          <i className="fas fa-plus"></i> Novo Registro
        </button>
      </div>

      <RegistrosList 
        registros={registros} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        onConcluir={handleConcluir}
        onReverter={handleReverter}
      />

      {showForm && (
        <RegistroForm
          registro={selectedRegistro}
          onClose={handleCloseForm}
          onSave={refetch}
        />
      )}
    </div>
  );
}

export default RegistroSanitario; 