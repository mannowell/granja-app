import React, { useState } from 'react';
import api from '../../services/api';

function RecargaForm({ silo, onClose, onSave }) {
  const [quantidade, setQuantidade] = useState('');
  const espacoDisponivel = silo.capacidade_total - silo.nivel_atual;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/silos/${silo.id}/recarga`, { quantidade: Number(quantidade) });
      onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao registrar recarga:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Registrar Recarga - Silo {silo.id}</h3>
        <form onSubmit={handleSubmit} className="recarga-form">
          <div className="info-row">
            <span className="info-label">Capacidade Total:</span>
            <span className="info-value">{silo.capacidade_total.toFixed(2)} kg</span>
          </div>
          <div className="info-row">
            <span className="info-label">Nível Atual:</span>
            <span className="info-value">{silo.nivel_atual.toFixed(2)} kg</span>
          </div>
          <div className="info-row">
            <span className="info-label">Espaço Disponível:</span>
            <span className="info-value">{espacoDisponivel.toFixed(2)} kg</span>
          </div>

          <div className="form-group">
            <label>Quantidade (kg)</label>
            <input
              type="number"
              step="0.01"
              value={quantidade}
              onChange={e => setQuantidade(e.target.value)}
              max={espacoDisponivel}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecargaForm; 