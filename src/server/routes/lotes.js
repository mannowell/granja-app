const express = require('express');
const router = express.Router();
const lotesController = require('../controllers/lotesController');
const { getConnection } = require('../database');

// Listar lotes
router.get('/', async (req, res) => {
  try {
    const lotes = await lotesController.listarTodos();
    res.json(lotes);
  } catch (error) {
    console.error('Erro ao listar lotes:', error);
    res.status(500).json({ error: 'Erro ao listar lotes' });
  }
});

// Rota para estatísticas de lotes - MOVIDA PARA ANTES DAS ROTAS COM ID
router.get('/stats', async (req, res) => {
  try {
    const db = await getConnection();
    
    // Obter total de lotes
    const totalLotes = await db.get('SELECT COUNT(*) as total FROM lotes');
    
    // Obter lotes ativos
    const lotesAtivos = await db.get("SELECT COUNT(*) as ativos FROM lotes WHERE status = 'ativo'");
    
    // Obter total de animais (soma da quantidade inicial dos lotes ativos)
    const totalAnimais = await db.get(`
      SELECT SUM(quantidade_inicial) as total 
      FROM lotes 
      WHERE status = 'ativo'
    `);
    
    // Obter lotes por status
    const lotesPorStatus = await db.all("SELECT status, COUNT(*) as quantidade FROM lotes GROUP BY status");
    
    res.json({
      total: totalLotes ? totalLotes.total || 0 : 0,
      ativos: lotesAtivos ? lotesAtivos.ativos || 0 : 0,
      totalAnimais: totalAnimais && totalAnimais.total ? totalAnimais.total : 0,
      porStatus: lotesPorStatus || []
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas de lotes:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas de lotes', details: error.message });
  }
});

// Criar lote
router.post('/', async (req, res) => {
  try {
    const novoLote = await lotesController.criar(req.body);
    res.status(201).json({
      success: true,
      lote: novoLote,
      message: 'Lote criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar lote:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Buscar lote por ID
router.get('/:id', async (req, res) => {
  try {
    const lote = await lotesController.buscarPorId(req.params.id);
    res.json(lote);
  } catch (error) {
    console.error('Erro ao buscar lote:', error);
    res.status(404).json({ error: error.message });
  }
});

// Atualizar lote
router.put('/:id', async (req, res) => {
  try {
    const loteAtualizado = await lotesController.atualizar(req.params.id, req.body);
    res.json({
      success: true,
      lote: loteAtualizado,
      message: 'Lote atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar lote:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 