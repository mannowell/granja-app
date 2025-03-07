import React from 'react';
import { useApi } from '../../hooks/useApi';

function LoteDetails({ lote, onEdit }) {
  const { data: detalhes, loading, error } = useApi(`/lotes/${lote.id}/detalhes`);

  if (loading) return <div className="lote-details loading">Carregando detalhes...</div>;
  if (error) return <div className="lote-details error">Erro ao carregar detalhes</div>;

  return (
    <div className="lote-details">
      <div className="details-header">
        <h3>Detalhes do Lote #{lote.id}</h3>
        <button onClick={onEdit}>Editar</button>
      </div>

      <div className="details-content">
        <div className="details-section">
          <h4>Informações Gerais</h4>
          <div className="info-grid">
            <div className="info-item">
              <label>Data de Entrada</label>
              <span>{new Date(lote.data_entrada).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>Quantidade Inicial</label>
              <span>{lote.quantidade_inicial} animais</span>
            </div>
            <div className="info-item">
              <label>Quantidade Atual</label>
              <span>{detalhes?.quantidade_atual || 0} animais</span>
            </div>
            <div className="info-item">
              <label>Mortalidade</label>
              <span>{detalhes?.mortalidade || 0} animais</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h4>Evolução do Peso</h4>
          <div className="peso-info">
            <div className="info-item">
              <label>Peso Inicial</label>
              <span>{lote.peso_medio_inicial} kg</span>
            </div>
            <div className="info-item">
              <label>Peso Atual</label>
              <span>{detalhes?.peso_medio_atual || 0} kg</span>
            </div>
            <div className="info-item">
              <label>Ganho Médio Diário</label>
              <span>{detalhes?.ganho_medio_diario || 0} kg/dia</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h4>Histórico Sanitário</h4>
          <div className="historico-list">
            {detalhes?.historico_sanitario?.map((registro, index) => (
              <div key={index} className="historico-item">
                <div className="historico-data">
                  {new Date(registro.data_registro).toLocaleDateString()}
                </div>
                <div className="historico-info">
                  <div>{registro.tipo_intervencao}</div>
                  <div>{registro.medicamento} - {registro.dosagem}</div>
                  {registro.observacoes && (
                    <div className="observacoes">{registro.observacoes}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoteDetails; 