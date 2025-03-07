import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function SiloForm({ silo, onClose, onSave }) {
  const [formData, setFormData] = useState({
    numero: '',
    capacidade_total: '',
    tipo_racao: '',
    fase_nome: '',
    pavilhao_id: ''
  });
  const [pavilhoes, setPavilhoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPavilhoes();
    
    if (silo) {
      setFormData({
        numero: silo.numero || '',
        capacidade_total: silo.capacidade_total || '',
        tipo_racao: silo.tipo_racao || '',
        fase_nome: silo.fase_nome || '',
        pavilhao_id: silo.pavilhao_id || ''
      });
    }
  }, [silo]);

  const fetchPavilhoes = async () => {
    try {
      const response = await api.get('/pavilhoes');
      if (response.data) {
        setPavilhoes(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar pavilhões:', err);
      setError('Não foi possível carregar a lista de pavilhões');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (silo) {
        await api.put(`/silos/${silo.id}`, formData);
      } else {
        await api.post('/silos', formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar silo:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Erro ao salvar silo. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{silo ? 'Editar Silo' : 'Novo Silo'}</h3>
        
        {error && (
          <div className="form-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Número do Silo (1-7)</label>
            <input
              type="number"
              min="1"
              max="7"
              value={formData.numero}
              onChange={e => setFormData({...formData, numero: parseInt(e.target.value) || ''})}
              required
            />
            <small>Escolha um número de 1 a 7 para o silo</small>
          </div>
          
          <div className="form-group">
            <label>Pavilhão Associado</label>
            <select
              value={formData.pavilhao_id}
              onChange={e => setFormData({...formData, pavilhao_id: e.target.value})}
            >
              <option value="">-- Selecione um pavilhão --</option>
              {pavilhoes.map(pavilhao => (
                <option key={pavilhao.numero} value={pavilhao.numero}>
                  Pavilhão {pavilhao.numero}
                </option>
              ))}
            </select>
            <small>Recomendado associar ao pavilhão com o mesmo número</small>
          </div>

          <div className="form-group">
            <label>Tipo de Ração</label>
            <input
              type="text"
              value={formData.tipo_racao}
              onChange={e => setFormData({...formData, tipo_racao: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Capacidade Total (kg)</label>
            <input
              type="number"
              step="0.01"
              value={formData.capacidade_total}
              onChange={e => setFormData({...formData, capacidade_total: parseFloat(e.target.value) || ''})}
              required
            />
          </div>

          <div className="form-group">
            <label>Fase</label>
            <select
              value={formData.fase_nome}
              onChange={e => setFormData({...formData, fase_nome: e.target.value})}
              required
            >
              <option value="">Selecione uma fase</option>
              <option value="leitao">Inicial (Leitão)</option>
              <option value="jovem">Crescimento (Jovem)</option>
              <option value="adulto">Terminação (Adulto)</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={loading}>Cancelar</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SiloForm; 