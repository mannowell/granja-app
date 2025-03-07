import React, { useState } from 'react';

function TarefaForm({ tarefa, onClose, onSave }) {
  const [formData, setFormData] = useState(tarefa || {
    titulo: '',
    descricao: '',
    data_prevista: new Date().toISOString().split('T')[0],
    prioridade: 'media'
  });

  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = tarefa 
        ? `/api/manutencao/tarefas/${tarefa.id}`
        : '/api/manutencao/tarefas';
      
      const method = tarefa ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar tarefa');
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{tarefa ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
        
        {erro && <div className="error-message">{erro}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={e => setFormData({...formData, titulo: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={e => setFormData({...formData, descricao: e.target.value})}
              required
              rows={4}
            />
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
            <label>Prioridade</label>
            <select
              value={formData.prioridade}
              onChange={e => setFormData({...formData, prioridade: e.target.value})}
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
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

export default TarefaForm; 