import React, { useState } from 'react';
import api from '../services/api';
import { useApi } from '../hooks/useApi';

function MortalidadeLotes() {
  const { data: lotes, loading, error, refetch } = useApi('/lotes');
  const [selectedLote, setSelectedLote] = useState(null);
  const [mortalidade, setMortalidade] = useState('');

  const handleAddMortalidade = async () => {
    if (!selectedLote || mortalidade === '' || mortalidade < 0) {
      alert('Selecione um lote e insira um valor de mortalidade válido.');
      return;
    }

    try {
      await api.post(`/lotes/${selectedLote.id}/mortalidade`, { mortalidade });
      setMortalidade('');
      refetch();
    } catch (error) {
      console.error('Erro ao adicionar mortalidade:', error);
      alert('Erro ao adicionar mortalidade.');
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar lotes</div>;

  return (
    <div className="mortalidade-lotes">
      <h2>Gerenciar Mortalidade dos Lotes</h2>
      <div>
        <label>Selecione um Lote:</label>
        <select onChange={(e) => setSelectedLote(lotes.find(lote => lote.id === e.target.value))}>
          <option value="">Selecione um lote</option>
          {lotes.map(lote => (
            <option key={lote.id} value={lote.id}>
              Lote {lote.id}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Mortalidade:</label>
        <input
          type="number"
          value={mortalidade}
          onChange={(e) => setMortalidade(e.target.value)}
          min="0"
        />
      </div>
      <button onClick={handleAddMortalidade}>Adicionar Mortalidade</button>
    </div>
  );
}

export default MortalidadeLotes; 