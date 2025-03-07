import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function RegistroForm({ registro, onClose, onSave }) {
  const [lotes, setLotes] = useState([]);
  const [formData, setFormData] = useState(registro || {
    lote_id: '',
    tipo: 'VACINACAO',
    descricao: '',
    data_prevista: new Date().toISOString().split('T')[0],
    medicamento: '',
    dosagem: '',
    observacoes: '',
    status: 'pendente'
  });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Carregar lista de lotes ativos
    const fetchLotes = async () => {
      try {
        const response = await api.get('/lotes?status=ativo');
        setLotes(response.data);
      } catch (error) {
        console.error('Erro ao carregar lotes:', error);
      }
    };
    fetchLotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    
    try {
      if (registro) {
        await api.put(`/sanitario/registros/${registro.id}`, formData);
      } else {
        await api.post('/sanitario/registros', formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
      setErro('Erro ao salvar o registro sanitário. Verifique se você preencheu todos os campos obrigatórios e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{registro ? 'Editar Registro' : 'Novo Registro'}</h3>
        {erro && <div className="error-message">{erro}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Lote</label>
            <select
              value={formData.lote_id}
              onChange={e => setFormData({...formData, lote_id: e.target.value})}
              required
            >
              <option value="">Selecione um lote</option>
              {lotes.map(lote => (
                <option key={lote.id} value={lote.id}>
                  Lote {lote.id} - {new Date(lote.data_entrada).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <select
              value={formData.tipo}
              onChange={e => setFormData({...formData, tipo: e.target.value})}
              required
            >
              <option value="VACINACAO">Vacinação</option>
              <option value="TRATAMENTO">Tratamento</option>
              <option value="PREVENCAO">Prevenção</option>
            </select>
          </div>

          <div className="form-group">
            <label>Data Prevista</label>
            <input
              type="date"
              value={formData.data_prevista}
              onChange={e => setFormData({...formData, data_prevista: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Medicamento</label>
            <input
              type="text"
              value={formData.medicamento}
              onChange={e => setFormData({...formData, medicamento: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Dosagem</label>
            <input
              type="text"
              value={formData.dosagem}
              onChange={e => setFormData({...formData, dosagem: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={e => setFormData({...formData, descricao: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Observações</label>
            <textarea
              value={formData.observacoes}
              onChange={e => setFormData({...formData, observacoes: e.target.value})}
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

export default RegistroForm; 