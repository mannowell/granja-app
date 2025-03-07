import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import api from '../../services/api';
import SiloCard from './SiloCard';
import RecargaForm from './RecargaForm';
import SiloForm from './SiloForm';
import '../../styles/Silos.css';

function ControleSilos({ onSiloUpdate }) {
  const [showRecargaForm, setShowRecargaForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSilo, setSelectedSilo] = useState(null);
  const { data, loading, error, refetch } = useApi('/silos');
  
  // Extrair silos da resposta
  const silos = data?.silos || [];

  const handleRecarga = (silo) => {
    setSelectedSilo(silo);
    setShowRecargaForm(true);
  };

  const handleEdit = (silo) => {
    setSelectedSilo(silo);
    setShowEditForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/silos/${id}`);
      refetch();
      if (onSiloUpdate) onSiloUpdate();
    } catch (error) {
      console.error('Erro ao excluir silo:', error);
      alert(error.response?.data?.error || 'Erro ao excluir silo');
    }
  };

  const handleCloseForm = () => {
    setShowRecargaForm(false);
    setShowEditForm(false);
    setShowAddForm(false);
    setSelectedSilo(null);
  };

  const handleSaveSuccess = () => {
    refetch();
    if (onSiloUpdate) onSiloUpdate();
  };

  return (
    <div className="controle-silos">
      <div className="page-header">
        <h2>Controle de Silos</h2>
        <button 
          className="btn-add"
          onClick={() => setShowAddForm(true)}
        >
          <i className="fas fa-plus"></i> Novo Silo
        </button>
      </div>

      {loading ? (
        <div className="loading">Carregando silos...</div>
      ) : error ? (
        <div className="error">
          <p>Erro ao carregar silos: {error}</p>
          <button onClick={refetch} className="btn-retry">Tentar novamente</button>
        </div>
      ) : silos.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum silo cadastrado.</p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-add"
          >
            Cadastrar Silo
          </button>
        </div>
      ) : (
        <div className="silos-grid">
          {silos.map(silo => (
            <SiloCard
              key={silo.id}
              silo={silo}
              onRecarga={handleRecarga}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showRecargaForm && (
        <RecargaForm
          silo={selectedSilo}
          onClose={handleCloseForm}
          onSave={handleSaveSuccess}
        />
      )}

      {(showEditForm || showAddForm) && (
        <SiloForm
          silo={showEditForm ? selectedSilo : null}
          onClose={handleCloseForm}
          onSave={handleSaveSuccess}
        />
      )}
    </div>
  );
}

ControleSilos.defaultProps = {
  onSiloUpdate: () => {}
};

export default ControleSilos; 