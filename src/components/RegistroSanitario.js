import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import RegistrosList from './sanitario/RegistrosList';
import RegistroForm from './sanitario/RegistroForm';
import VacinacaoList from './sanitario/VacinacaoList';
import TratamentosList from './sanitario/TratamentosList';
import './styles/Sanitario.css';

function RegistroSanitario() {
  const [activeTab, setActiveTab] = useState('registros');
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAdd = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedItem(null);
  };

  return (
    <div className="registro-sanitario">
      <div className="page-header">
        <h2>Registro Sanitário</h2>
        <button className="btn-primary" onClick={handleAdd}>
          Novo Registro
        </button>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'registros' ? 'active' : ''}`}
          onClick={() => setActiveTab('registros')}
        >
          Registros Sanitários
        </button>
        <button 
          className={`tab ${activeTab === 'vacinacao' ? 'active' : ''}`}
          onClick={() => setActiveTab('vacinacao')}
        >
          Vacinação
        </button>
        <button 
          className={`tab ${activeTab === 'tratamentos' ? 'active' : ''}`}
          onClick={() => setActiveTab('tratamentos')}
        >
          Tratamentos
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'registros' && (
          <RegistrosList onEdit={handleEdit} />
        )}
        {activeTab === 'vacinacao' && (
          <VacinacaoList onEdit={handleEdit} />
        )}
        {activeTab === 'tratamentos' && (
          <TratamentosList onEdit={handleEdit} />
        )}
      </div>

      {showForm && (
        <RegistroForm
          registro={selectedItem}
          tipo={activeTab}
          onClose={handleCloseForm}
          onSave={() => {
            handleCloseForm();
            // Recarregar dados
          }}
        />
      )}
    </div>
  );
}

export default RegistroSanitario; 