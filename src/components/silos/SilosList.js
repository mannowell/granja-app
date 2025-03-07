import React from 'react';

function SilosList({ silos, onSelectSilo, onEditSilo }) {
  const getNivelStatus = (nivel, capacidade, alerta) => {
    const percentual = (nivel / capacidade) * 100;
    if (percentual <= alerta) return 'baixo';
    if (percentual <= 30) return 'medio';
    return 'normal';
  };

  return (
    <div className="silos-list">
      <div className="list-header">
        <div>Nº</div>
        <div>Pavilhão</div>
        <div>Tipo de Ração</div>
        <div>Capacidade</div>
        <div>Nível Atual</div>
        <div>Última Recarga</div>
        <div>Ações</div>
      </div>
      {silos?.map(silo => (
        <div key={silo.id} className="list-item">
          <div>{silo.numero}</div>
          <div>{silo.pavilhao_numero ? `Pavilhão ${silo.pavilhao_numero}` : 'Não associado'}</div>
          <div>{silo.tipo_racao}</div>
          <div>{silo.capacidade_total} kg</div>
          <div className={`nivel ${getNivelStatus(silo.nivel_atual, silo.capacidade_total, silo.alerta_minimo)}`}>
            {silo.nivel_atual} kg ({Math.round((silo.nivel_atual/silo.capacidade_total)*100)}%)
          </div>
          <div>{silo.ultima_recarga ? new Date(silo.ultima_recarga).toLocaleDateString() : 'N/A'}</div>
          <div className="actions">
            <button onClick={() => onSelectSilo(silo)}>Detalhes</button>
            <button onClick={() => onEditSilo(silo)}>Editar</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SilosList; 