import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';

function SiloDetails({ silo, onEdit, onSave }) {
  const [showRecargaForm, setShowRecargaForm] = useState(false);
  const [quantidade, setQuantidade] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRecarga = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/silos/${silo.id}/reabastecer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantidade: Number(quantidade) }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao registrar recarga');
      }
      
      setShowRecargaForm(false);
      setQuantidade('');
      
      // Notificar que houve alteração nos dados
      if (onSave) onSave();
      else window.location.reload();
    } catch (error) {
      console.error('Erro:', error);
      setError(error.message || 'Erro ao registrar recarga');
    } finally {
      setLoading(false);
    }
  };

  const getNivelPercentual = () => {
    return Math.round((silo.nivel_atual / silo.capacidade_total) * 100);
  };

  return (
    <div className="silo-details">
      <div className="details-header">
        <h3>Silo #{silo.numero}</h3>
        <button onClick={onEdit}>Editar</button>
      </div>

      <div className="silo-nivel-visual">
        <div 
          className="silo-nivel-fill"
          style={{ height: `${getNivelPercentual()}%` }}
        />
      </div>

      <div className="silo-info">
        <div className="silo-info-item">
          <span className="silo-info-label">Pavilhão Associado:</span>
          <span className="silo-info-value">
            {silo.pavilhao_numero ? `Pavilhão ${silo.pavilhao_numero}` : 'Não associado'}
          </span>
        </div>
        <div className="silo-info-item">
          <span className="silo-info-label">Tipo de Ração:</span>
          <span className="silo-info-value">{silo.tipo_racao}</span>
        </div>
        <div className="silo-info-item">
          <span className="silo-info-label">Capacidade Total:</span>
          <span className="silo-info-value">{silo.capacidade_total} kg</span>
        </div>
        <div className="silo-info-item">
          <span className="silo-info-label">Nível Atual:</span>
          <span className="silo-info-value">
            {silo.nivel_atual} kg ({getNivelPercentual()}%)
          </span>
        </div>
        <div className="silo-info-item">
          <span className="silo-info-label">Última Recarga:</span>
          <span className="silo-info-value">
            {silo.ultima_recarga ? new Date(silo.ultima_recarga).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        <div className="silo-info-item">
          <span className="silo-info-label">Fase de Produção:</span>
          <span className="silo-info-value">{silo.fase_nome}</span>
        </div>
      </div>

      <div className="recarga-section">
        <button 
          className="btn-primary"
          onClick={() => setShowRecargaForm(!showRecargaForm)}
          disabled={loading}
        >
          Registrar Recarga
        </button>

        {showRecargaForm && (
          <form className="recarga-form" onSubmit={handleRecarga}>
            {error && <div className="form-error">{error}</div>}
            
            <div className="form-group">
              <label>Quantidade (kg)</label>
              <input
                type="number"
                value={quantidade}
                onChange={e => setQuantidade(e.target.value)}
                max={silo.capacidade_total - silo.nivel_atual}
                required
                disabled={loading}
              />
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => {
                  setShowRecargaForm(false);
                  setError(null);
                }}
                disabled={loading}
              >
                Cancelar
              </button>
              <button type="submit" disabled={loading}>
                {loading ? 'Processando...' : 'Confirmar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default SiloDetails; 