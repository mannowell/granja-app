import React, { useState } from 'react';
import api from '../../services/api';
import './PavilhoesList.css';

function PavilhoesList({ pavilhoes, onAddLote, onRefresh }) {
  const [loading, setLoading] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case 'ocupado': return 'status-ocupado';
      case 'manutencao': return 'status-manutencao';
      default: return 'status-disponivel';
    }
  };

  const handleStatusChange = async (pavilhao, newStatus) => {
    try {
      setLoading(true);
      await api.put(`/pavilhoes/${pavilhao.numero}/status`, { 
        status: newStatus,
        observacao: newStatus === 'manutencao' ? 'Em manutenção' : ''
      });
      onRefresh();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do pavilhão');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizarLote = async (pavilhao) => {
    if (!window.confirm('Tem certeza que deseja finalizar este lote?')) return;
    
    try {
      setLoading(true);
      await api.put(`/pavilhoes/${pavilhao.numero}/finalizar-lote`);
      onRefresh();
    } catch (error) {
      console.error('Erro ao finalizar lote:', error);
      alert('Erro ao finalizar lote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pavilhoes-grid">
      {pavilhoes?.map(pavilhao => (
        <div key={pavilhao.numero} className={`pavilhao-card ${getStatusClass(pavilhao.status)}`}>
          <div className="pavilhao-header">
            <h3>Pavilhão {pavilhao.numero}</h3>
            <span className="status-badge">{pavilhao.status}</span>
          </div>

          {pavilhao.lote_atual_id ? (
            <>
              <div className="lote-info">
                <div className="info-row">
                  <span>Quantidade:</span>
                  <strong>{pavilhao.quantidade_inicial} animais</strong>
                </div>
                <div className="info-row">
                  <span>Entrada:</span>
                  <strong>{new Date(pavilhao.data_entrada).toLocaleDateString()}</strong>
                </div>
                <div className="info-row">
                  <span>Saída Prevista:</span>
                  <strong>{new Date(pavilhao.data_saida_prevista).toLocaleDateString()}</strong>
                </div>
                <div className="info-row">
                  <span>Status:</span>
                  <strong>{pavilhao.lote_status}</strong>
                </div>
              </div>
              <div className="pavilhao-actions">
                <button 
                  className="btn-finalizar"
                  onClick={() => handleFinalizarLote(pavilhao)}
                  disabled={loading}
                >
                  <i className="fas fa-check-circle"></i>
                  Finalizar Lote
                </button>
              </div>
            </>
          ) : (
            <div className="pavilhao-empty">
              {pavilhao.status === 'disponivel' ? (
                <>
                  <button 
                    className="btn-add-lote"
                    onClick={() => onAddLote(pavilhao)}
                    disabled={loading}
                  >
                    <i className="fas fa-plus"></i>
                    Adicionar Lote
                  </button>
                  <button 
                    className="btn-manutencao"
                    onClick={() => handleStatusChange(pavilhao, 'manutencao')}
                    disabled={loading}
                  >
                    <i className="fas fa-tools"></i>
                    Colocar em Manutenção
                  </button>
                </>
              ) : pavilhao.status === 'manutencao' ? (
                <button 
                  className="btn-disponivel"
                  onClick={() => handleStatusChange(pavilhao, 'disponivel')}
                  disabled={loading}
                >
                  <i className="fas fa-check"></i>
                  Marcar como Disponível
                </button>
              ) : (
                <p className="status-message">Pavilhão em {pavilhao.status}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PavilhoesList; 