import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function ManutencaoForm({ tarefa, onClose, onSave }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_prevista: new Date().toISOString().split('T')[0],
    prioridade: 'baixa',
    status: 'pendente'
  });

  useEffect(() => {
    if (tarefa) {
      setFormData({
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        data_prevista: tarefa.data_prevista,
        prioridade: tarefa.prioridade,
        status: tarefa.status
      });
    }
  }, [tarefa]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (tarefa) {
        await api.put(`/manutencao/tarefas/${tarefa.id}`, formData);
      } else {
        await api.post('/manutencao/tarefas', formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      alert('Erro ao salvar tarefa');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{tarefa ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
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
              required
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
              required
            >
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="finalizada">Finalizada</option>
              <option value="atrasada">Atrasada</option>
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

export default ManutencaoForm; 