const express = require('express');
const router = express.Router();
const { getConnection } = require('../database');

// Listar todas as tarefas de manutenção
router.get('/tarefas', async (req, res) => {
  try {
    const db = await getConnection();
    
    const tarefas = await db.all(`
      SELECT 
        id,
        titulo,
        descricao,
        data_criacao,
        data_prevista,
        prioridade,
        status
      FROM tarefas_manutencao
      ORDER BY 
        CASE 
          WHEN status = 'pendente' THEN 1
          WHEN status = 'em_andamento' THEN 2
          ELSE 3
        END,
        data_prevista ASC
    `);
    
    res.json(tarefas);
  } catch (error) {
    console.error('Erro ao listar tarefas de manutenção:', error);
    res.status(500).json({ 
      error: 'Erro ao listar tarefas de manutenção',
      details: error.message
    });
  }
});

// Finalizar tarefa de manutenção
router.put('/tarefas/:id/finalizar', async (req, res) => {
  try {
    const db = await getConnection();
    const tarefaId = req.params.id;
    
    // Verificar se a tarefa existe
    const tarefaExistente = await db.get('SELECT id FROM tarefas_manutencao WHERE id = ?', [tarefaId]);
    if (!tarefaExistente) {
      return res.status(404).json({ 
        error: 'Tarefa não encontrada',
        details: `Não foi encontrada uma tarefa com o ID ${tarefaId}`
      });
    }
    
    // Atualizar status da tarefa para concluída
    await db.run(
      'UPDATE tarefas_manutencao SET status = ? WHERE id = ?', 
      ['concluida', tarefaId]
    );
    
    // Buscar a tarefa atualizada
    const tarefaAtualizada = await db.get('SELECT * FROM tarefas_manutencao WHERE id = ?', [tarefaId]);
    
    res.json({
      success: true,
      message: 'Tarefa finalizada com sucesso',
      tarefa: tarefaAtualizada
    });
  } catch (error) {
    console.error('Erro ao finalizar tarefa de manutenção:', error);
    res.status(500).json({
      error: 'Erro ao finalizar tarefa de manutenção',
      details: error.message
    });
  }
});

// Criar nova tarefa de manutenção
router.post('/tarefas', async (req, res) => {
  try {
    const db = await getConnection();
    
    const {
      titulo,
      descricao,
      data_prevista,
      prioridade
    } = req.body;

    const data_criacao = new Date().toISOString().split('T')[0];

    const result = await db.run(`
      INSERT INTO tarefas_manutencao (
        titulo,
        descricao,
        data_criacao,
        data_prevista,
        prioridade,
        status
      ) VALUES (?, ?, ?, ?, ?, 'pendente')
    `, [
      titulo,
      descricao,
      data_criacao,
      data_prevista,
      prioridade
    ]);

    const novaTarefa = await db.get('SELECT * FROM tarefas_manutencao WHERE id = ?', [result.lastID]);
    res.status(201).json(novaTarefa);
  } catch (error) {
    console.error('Erro ao criar tarefa de manutenção:', error);
    res.status(500).json({ error: 'Erro ao criar tarefa de manutenção' });
  }
});

// Rota base (opcional)
router.get('/', async (req, res) => {
  res.redirect('/api/manutencao/tarefas');
});

module.exports = router; 