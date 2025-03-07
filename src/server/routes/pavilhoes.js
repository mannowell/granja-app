const express = require('express');
const router = express.Router();
const { getConnection } = require('../database');

// Listar pavilhões
router.get('/', async (req, res) => {
  try {
    const db = await getConnection();
    
    const pavilhoes = await db.all(`
      SELECT
        p.*,
        l.data_entrada,
        l.quantidade_inicial,
        l.peso_medio_inicial,
        l.data_saida_prevista,
        l.status as lote_status
      FROM pavilhoes p
      LEFT JOIN lotes l ON p.lote_atual_id = l.id
      ORDER BY p.numero
    `);
    res.json(pavilhoes);
  } catch (error) {
    console.error('Erro ao listar pavilhões:', error);
    res.status(500).json({ error: 'Erro ao listar pavilhões' });
  }
});

// ... outras rotas ...

module.exports = router; 