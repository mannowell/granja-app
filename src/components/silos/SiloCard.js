import React from 'react';

function SiloCard({ silo, onRecarga, onEdit, onDelete }) {
  const nivelPercentual = (silo.nivel_atual / silo.capacidade_total) * 100;
  
  const getNivelClass = () => {
    if (nivelPercentual <= 20) return 'nivel-critical';
    if (nivelPercentual <= 40) return 'nivel-warning';
    return '';
  };

  return (
    <div className="silo-card">
      <div className="silo-header">
        <span className="silo-title">Silo {silo.numero || silo.id}</span>
        <div className="silo-header-actions">
          <button 
            className="btn-edit"
            onClick={() => onEdit(silo)}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button 
            className="btn-delete"
            onClick={() => {
              if (window.confirm('Tem certeza que deseja excluir este silo?')) {
                onDelete(silo.id);
              }
            }}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <span className="fase-badge">{silo.fase_nome}</span>

      <div className="nivel-indicator">
        <div className="nivel-bar">
          <div 
            className={`nivel-fill ${getNivelClass()}`}
            style={{ width: `${nivelPercentual}%` }}
          />
        </div>
      </div>

      <div className="silo-info">
        <div className="info-row">
          <span className="info-label">Tipo de Ração:</span>
          <span className="info-value">{silo.tipo_racao}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Nível Atual:</span>
          <span className="info-value">{silo.nivel_atual.toFixed(2)} kg</span>
        </div>
        <div className="info-row">
          <span className="info-label">Capacidade:</span>
          <span className="info-value">{silo.capacidade_total.toFixed(2)} kg</span>
        </div>
        <div className="info-row">
          <span className="info-label">Última Recarga:</span>
          <span className="info-value">
            {silo.ultima_recarga ? new Date(silo.ultima_recarga).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Pavilhão:</span>
          <span className="info-value">
            {silo.pavilhao_numero ? `Pavilhão ${silo.pavilhao_numero}` : 'Não associado'}
          </span>
        </div>
      </div>

      <div className="silo-actions">
        <button 
          className="btn-recarga"
          onClick={() => onRecarga(silo)}
        >
          <i className="fas fa-fill"></i> Registrar Recarga
        </button>
      </div>
    </div>
  );
}

export default SiloCard; 