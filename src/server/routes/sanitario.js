const express = require('express');
const router = express.Router();
const { getConnection } = require('../database');

// Listar todos os registros sanitários
router.get('/registros', async (req, res) => {
  try {
    const db = await getConnection();
    
    const registros = await db.all(`
      SELECT 
        rs.*,
        l.data_entrada as lote_data_entrada,
        l.quantidade_inicial as lote_quantidade
      FROM registros_sanitarios rs
      LEFT JOIN lotes l ON rs.lote_id = l.id
      ORDER BY rs.data_registro DESC
    `);
    res.json(registros);
  } catch (error) {
    console.error('Erro ao listar registros sanitários:', error);
    res.status(500).json({ error: 'Erro ao listar registros sanitários' });
  }
});

// Adicionar novo registro sanitário
router.post('/registros', async (req, res) => {
  try {
    const db = await getConnection();
    const { 
      lote_id, 
      tipo, 
      descricao, 
      data_prevista, 
      medicamento, 
      dosagem, 
      observacoes,
      status = 'pendente'
    } = req.body;
    
    // Validar campos obrigatórios
    if (!lote_id || !tipo || !descricao || !data_prevista) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios não preenchidos',
        details: 'Os campos lote_id, tipo, descricao e data_prevista são obrigatórios'
      });
    }
    
    // Verificar se o lote existe
    const loteExiste = await db.get('SELECT id FROM lotes WHERE id = ?', [lote_id]);
    if (!loteExiste) {
      return res.status(400).json({
        error: 'Lote inválido',
        details: 'O lote informado não existe'
      });
    }
    
    // Data de registro atual
    const data_registro = new Date().toISOString().split('T')[0];
    
    const result = await db.run(`
      INSERT INTO registros_sanitarios (
        lote_id, 
        tipo, 
        descricao, 
        data_registro, 
        data_prevista, 
        medicamento, 
        dosagem, 
        observacoes, 
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      lote_id,
      tipo,
      descricao,
      data_registro,
      data_prevista,
      medicamento || null,
      dosagem || null,
      observacoes || null,
      status
    ]);
    
    // Buscar o registro inserido para retornar
    const novoRegistro = await db.get('SELECT * FROM registros_sanitarios WHERE id = ?', [result.lastID]);
    
    res.status(201).json({
      success: true,
      message: 'Registro sanitário adicionado com sucesso',
      registro: novoRegistro
    });
  } catch (error) {
    console.error('Erro ao adicionar registro sanitário:', error);
    res.status(500).json({
      error: 'Erro ao adicionar registro sanitário',
      details: error.message
    });
  }
});

// Rota base (opcional)
router.get('/', async (req, res) => {
  res.redirect('/api/sanitario/registros');
});

// Rota para listar registros de vacinação pendentes
router.get('/vacinas/pendentes', async (req, res) => {
  try {
    const db = await getConnection();
    
    const vacinasPendentes = await db.all(`
      SELECT 
        rs.id, 
        rs.tipo as vacina, 
        rs.descricao, 
        rs.data_prevista, 
        rs.lote_id,
        rs.status,
        l.pavilhao_id
      FROM registros_sanitarios rs
      JOIN lotes l ON rs.lote_id = l.id
      WHERE rs.tipo = 'vacina' 
      AND rs.status = 'pendente'
      ORDER BY rs.data_prevista ASC
    `);
    
    res.json(vacinasPendentes);
  } catch (error) {
    console.error('Erro ao buscar vacinas pendentes:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar vacinas pendentes', 
      details: error.message 
    });
  }
});

module.exports = router; 