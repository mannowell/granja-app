import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useApi } from '../../hooks/useApi';

function LoteForm({ lote, onClose, onSave }) {
  const { data: pavilhoes } = useApi('/pavilhoes');
  const pavilhoesDisponiveis = pavilhoes?.filter(p => p.status === 'disponivel' || p.numero === lote?.pavilhao_id) || [];

  const [formData, setFormData] = useState({
    data_entrada: new Date().toISOString().split('T')[0],
    data_saida_prevista: '',
    quantidade_inicial: '',
    peso_medio_inicial: '',
    pavilhao_id: '',
    status: 'ativo'
  });

  useEffect(() => {
    if (lote) {
      setFormData({
        data_entrada: lote.data_entrada,
        data_saida_prevista: lote.data_saida_prevista,
        quantidade_inicial: lote.quantidade_inicial,
        peso_medio_inicial: lote.peso_medio_inicial,
        pavilhao_id: lote.pavilhao_id,
        status: lote.status
      });
    }
  }, [lote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validar dados antes de enviar
      if (!formData.pavilhao_id) {
        alert('Por favor, selecione um pavilhão');
        return;
      }
      if (!formData.data_entrada) {
        alert('Por favor, informe a data de entrada');
        return;
      }
      if (!formData.data_saida_prevista) {
        alert('Por favor, informe a data de saída prevista');
        return;
      }
      if (!formData.quantidade_inicial) {
        alert('Por favor, informe a quantidade inicial');
        return;
      }
      if (!formData.peso_medio_inicial) {
        alert('Por favor, informe o peso médio inicial');
        return;
      }

      const dataToSend = {
        ...formData,
        pavilhao_id: parseInt(formData.pavilhao_id, 10),
        quantidade_inicial: parseInt(formData.quantidade_inicial, 10),
        peso_medio_inicial: parseFloat(formData.peso_medio_inicial),
      };

      if (lote) {
        await api.put(`/lotes/${lote.id}`, dataToSend);
      } else {
        await api.post('/lotes', dataToSend);
      }
      onSave();
    } catch (error) {
      console.error('Erro ao salvar lote:', error);
      alert('Erro ao salvar lote.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{lote ? 'Editar Lote' : 'Novo Lote'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Pavilhão</label>
            <select
              value={formData.pavilhao_id}
              onChange={e => setFormData({...formData, pavilhao_id: e.target.value})}
              required
            >
              <option value="">Selecione um pavilhão</option>
              {pavilhoesDisponiveis.map(pavilhao => (
                <option key={pavilhao.numero} value={pavilhao.numero}>
                  Pavilhão {pavilhao.numero}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Data de Entrada</label>
            <input
              type="date"
              value={formData.data_entrada}
              onChange={e => setFormData({...formData, data_entrada: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Data de Saída Prevista</label>
            <input
              type="date"
              value={formData.data_saida_prevista}
              onChange={e => setFormData({...formData, data_saida_prevista: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Quantidade de Animais</label>
            <input
              type="number"
              value={formData.quantidade_inicial}
              onChange={e => setFormData({...formData, quantidade_inicial: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Peso Médio Inicial (kg)</label>
            <input
              type="number"
              step="0.01"
              value={formData.peso_medio_inicial}
              onChange={e => setFormData({...formData, peso_medio_inicial: e.target.value})}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoteForm; 