import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PavilhoesList from './PavilhoesList';
import LoteForm from './LoteForm';

function Lotes() {
  const [pavilhoes, setPavilhoes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPavilhao, setSelectedPavilhao] = useState(null);

  useEffect(() => {
    loadPavilhoes();
  }, []);

  const loadPavilhoes = async () => {
    try {
      const response = await api.get('/pavilhoes');
      setPavilhoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar pavilhões:', error);
    }
  };

  const handleAdicionarLote = (pavilhaoNumero) => {
    setSelectedPavilhao(pavilhaoNumero);
    setShowForm(true);
  };

  const handleSaveLote = async () => {
    await loadPavilhoes();
    setShowForm(false);
    setSelectedPavilhao(null);
  };

  return (
    <div className="lotes-container">
      <h2>Gestão de Lotes</h2>
      <PavilhoesList 
        pavilhoes={pavilhoes} 
        onAdicionarLote={handleAdicionarLote}
      />
      {showForm && (
        <LoteForm
          pavilhaoId={selectedPavilhao}
          onClose={() => setShowForm(false)}
          onSave={handleSaveLote}
        />
      )}
    </div>
  );
}

export default Lotes; 