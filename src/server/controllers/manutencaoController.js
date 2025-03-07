const db = require('../database');

const manutencaoController = {
  async listar(req, res) {
    try {
      const tarefas = await db.all('SELECT * FROM tarefas_manutencao ORDER BY data_prevista ASC');
      res.json(tarefas);
    } catch (error) {
      console.error('Erro ao listar tarefas:', error);
      res.status(500).json({ error: 'Erro ao listar tarefas' });
    }
  },

  async criar(req, res) {
    try {
      const { titulo, descricao, data_prevista, prioridade } = req.body;
      const result = await db.run(
        'INSERT INTO tarefas_manutencao (titulo, descricao, data_criacao, data_prevista, prioridade, status) VALUES (?, ?, DATE("now"), ?, ?, "pendente")',
        [titulo, descricao, data_prevista, prioridade]
      );
      res.status(201).json({ id: result.lastID });
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { titulo, descricao, data_prevista, prioridade, status } = req.body;
      
      await db.run(
        `UPDATE tarefas_manutencao 
         SET titulo = ?, descricao = ?, data_prevista = ?, 
             prioridade = ?, status = ?
         WHERE id = ?`,
        [titulo, descricao, data_prevista, prioridade, status, id]
      );
      
      res.json({ message: 'Tarefa atualizada com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
  },

  async finalizar(req, res) {
    try {
      const { id } = req.params;
      await db.run(
        'UPDATE tarefas_manutencao SET status = ? WHERE id = ?',
        ['finalizada', id]
      );
      res.json({ message: 'Tarefa finalizada com sucesso' });
    } catch (error) {
      console.error('Erro ao finalizar tarefa:', error);
      res.status(500).json({ error: 'Erro ao finalizar tarefa' });
    }
  }
};

module.exports = manutencaoController; 