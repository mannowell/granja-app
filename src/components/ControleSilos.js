import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import SilosList from './silos/SilosList';
import SiloForm from './silos/SiloForm';
import SiloDetails from './silos/SiloDetails';
import './styles/Silos.css';

function ControleSilos() {
  const [selectedSilo, setSelectedSilo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { data, loading, error, refetch } = useApi('/silos');

  const silos = data?.silos || [];
  const pavilhoes = data?.pavilhoes || [];

  const handleAddSilo = () => {
    setSelectedSilo(null);
    setShowForm(true);
  };

  const handleEditSilo = (silo) => {
    setSelectedSilo(silo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedSilo(null);
  };

  return (
    <div className="controle-silos">
      <div className="page-header">
        <h2>Controle de Silos</h2>
        <button className="btn-primary" onClick={handleAddSilo}>
          Novo Silo
        </button>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : error ? (
        <div className="error">Erro ao carregar silos: {error}</div>
      ) : (
        <div className="silos-container">
          <SilosList 
            silos={silos} 
            onSelectSilo={setSelectedSilo}
            onEditSilo={handleEditSilo}
          />
          {selectedSilo && !showForm && (
            <SiloDetails 
              silo={selectedSilo} 
              onEdit={() => handleEditSilo(selectedSilo)}
              onSave={refetch}
            />
          )}
        </div>
      )}

      {showForm && (
        <SiloForm
          silo={selectedSilo}
          onClose={handleCloseForm}
          onSave={refetch}
        />
      )}
    </div>
  );
}

export default ControleSilos; 