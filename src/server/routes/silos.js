const express = require('express');
const router = express.Router();
const { getConnection } = require('../database');

// Listar todos os silos
router.get('/', async (req, res) => {
  try {
    const db = await getConnection();
    const silos = await db.all(`
      SELECT 
        s.*,
        p.numero as pavilhao_numero
      FROM silos s
      LEFT JOIN pavilhoes p ON s.pavilhao_id = p.numero
      ORDER BY s.numero
    `);
    
    // Obter lista de pavilhões para seleção
    const pavilhoes = await db.all(`SELECT numero FROM pavilhoes ORDER BY numero`);
    
    res.json({
      silos,
      pavilhoes
    });
  } catch (error) {
    console.error('Erro ao listar silos:', error);
    res.status(500).json({ error: 'Erro ao listar silos' });
  }
});

// Obter status dos silos
router.get('/status', async (req, res) => {
  try {
    const db = await getConnection();
    const status = await db.all(`
      SELECT 
        s.id, 
        s.numero, 
        s.capacidade_total,
        s.nivel_atual,
        s.tipo_racao,
        (s.nivel_atual / s.capacidade_total * 100) as percentual_nivel,
        p.numero as pavilhao_numero,
        CASE
          WHEN (s.nivel_atual / s.capacidade_total) < 0.2 THEN 'critico'
          WHEN (s.nivel_atual / s.capacidade_total) < 0.4 THEN 'baixo'
          WHEN (s.nivel_atual / s.capacidade_total) < 0.7 THEN 'medio'
          ELSE 'alto'
        END as status_nivel
      FROM silos s
      LEFT JOIN pavilhoes p ON s.pavilhao_id = p.numero
      ORDER BY s.numero
    `);
    res.json(status);
  } catch (error) {
    console.error('Erro ao obter status dos silos:', error);
    res.status(500).json({ error: 'Erro ao obter status dos silos' });
  }
});

// Obter estatísticas de silos
router.get('/stats', async (req, res) => {
  try {
    const db = await getConnection();
    
    // Obter total de silos
    const totalSilos = await db.get('SELECT COUNT(*) as total FROM silos');
    
    // Obter silos com nível crítico
    const silosCriticos = await db.get(`
      SELECT COUNT(*) as criticos 
      FROM silos 
      WHERE (nivel_atual / capacidade_total) < 0.2
    `);
    
    // Obter silos por status
    const silosPorStatus = await db.all(`
      SELECT 
        CASE
          WHEN (nivel_atual / capacidade_total) < 0.2 THEN 'critico'
          WHEN (nivel_atual / capacidade_total) < 0.4 THEN 'baixo'
          WHEN (nivel_atual / capacidade_total) < 0.7 THEN 'medio'
          ELSE 'alto'
        END as status,
        COUNT(*) as quantidade
      FROM silos
      GROUP BY status
    `);
    
    res.json({
      total: totalSilos.total,
      criticos: silosCriticos.criticos,
      por_status: silosPorStatus
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas dos silos:', error);
    res.status(500).json({ error: 'Erro ao obter estatísticas dos silos' });
  }
});

// Obter alertas ativos de silos
router.get('/alertas', async (req, res) => {
  try {
    const db = await getConnection();
    const alertas = await db.all(`
      SELECT 
        a.*,
        s.numero as silo_numero,
        s.tipo_racao,
        p.numero as pavilhao_numero
      FROM alertas_silos a
      JOIN silos s ON a.silo_id = s.id
      LEFT JOIN pavilhoes p ON s.pavilhao_id = p.numero
      WHERE a.resolvido = 0
      ORDER BY a.data_alerta DESC
    `);
    res.json(alertas);
  } catch (error) {
    console.error('Erro ao obter alertas dos silos:', error);
    res.status(500).json({ error: 'Erro ao obter alertas dos silos' });
  }
});

// Marcar alerta como resolvido
router.put('/alertas/:id/resolver', async (req, res) => {
  try {
    const db = await getConnection();
    const alertaId = req.params.id;
    
    // Atualizar o alerta
    await db.run(`
      UPDATE alertas_silos
      SET resolvido = 1, data_resolucao = DATE('now')
      WHERE id = ?
    `, [alertaId]);
    
    res.json({ success: true, message: 'Alerta marcado como resolvido' });
  } catch (error) {
    console.error('Erro ao resolver alerta:', error);
    res.status(500).json({ error: 'Erro ao resolver alerta' });
  }
});

// Reabastecer silo
router.post('/:id/reabastecer', async (req, res) => {
  try {
    const db = await getConnection();
    const siloId = req.params.id;
    const { quantidade } = req.body;
    
    if (!quantidade || isNaN(quantidade) || quantidade <= 0) {
      return res.status(400).json({ error: 'Quantidade inválida para reabastecimento' });
    }
    
    // Obter capacidade do silo
    const silo = await db.get('SELECT id, capacidade_total, nivel_atual FROM silos WHERE id = ?', [siloId]);
    
    if (!silo) {
      return res.status(404).json({ error: 'Silo não encontrado' });
    }
    
    // Calcular novo nível, limitado à capacidade
    const novoNivel = Math.min(silo.nivel_atual + parseFloat(quantidade), silo.capacidade_total);
    
    // Atualizar nível do silo
    await db.run(`
      UPDATE silos
      SET nivel_atual = ?, ultima_recarga = DATE('now')
      WHERE id = ?
    `, [novoNivel, siloId]);
    
    // Resolver alertas pendentes para este silo
    await db.run(`
      UPDATE alertas_silos
      SET resolvido = 1, data_resolucao = DATE('now')
      WHERE silo_id = ? AND resolvido = 0
    `, [siloId]);
    
    res.json({ 
      success: true, 
      message: 'Silo reabastecido com sucesso',
      silo_id: siloId,
      nivel_anterior: silo.nivel_atual,
      nivel_atual: novoNivel,
      quantidade_adicionada: novoNivel - silo.nivel_atual
    });
  } catch (error) {
    console.error('Erro ao reabastecer silo:', error);
    res.status(500).json({ error: 'Erro ao reabastecer silo' });
  }
});

// Criar novo silo
router.post('/', async (req, res) => {
  try {
    const db = await getConnection();
    const { numero, capacidade_total, tipo_racao, fase_nome, pavilhao_id } = req.body;
    
    if (!numero || !capacidade_total || !tipo_racao || !fase_nome) {
      return res.status(400).json({ error: 'Dados incompletos para criar silo' });
    }
    
    // Verificar se já existe um silo com este número
    const siloExistente = await db.get('SELECT id FROM silos WHERE numero = ?', [numero]);
    if (siloExistente) {
      return res.status(409).json({ error: 'Já existe um silo com este número' });
    }
    
    const result = await db.run(`
      INSERT INTO silos (
        numero,
        capacidade_total, 
        nivel_atual, 
        tipo_racao, 
        fase_nome,
        pavilhao_id, 
        ultima_recarga
      ) VALUES (?, ?, ?, ?, ?, ?, DATE('now'))
    `, [
      numero,
      capacidade_total,
      0, // Nível inicial é zero
      tipo_racao,
      fase_nome,
      pavilhao_id || null
    ]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Silo criado com sucesso',
      id: result.lastID
    });
  } catch (error) {
    console.error('Erro ao criar silo:', error);
    res.status(500).json({ error: 'Erro ao criar silo' });
  }
});

// Atualizar silo existente
router.put('/:id', async (req, res) => {
  try {
    const db = await getConnection();
    const siloId = req.params.id;
    const { numero, capacidade_total, tipo_racao, fase_nome, pavilhao_id } = req.body;
    
    if (!numero || !capacidade_total || !tipo_racao || !fase_nome) {
      return res.status(400).json({ error: 'Dados incompletos para atualizar silo' });
    }
    
    // Verificar se o silo existe
    const silo = await db.get('SELECT * FROM silos WHERE id = ?', [siloId]);
    if (!silo) {
      return res.status(404).json({ error: 'Silo não encontrado' });
    }
    
    // Verificar se já existe outro silo com este número
    const siloExistente = await db.get('SELECT id FROM silos WHERE numero = ? AND id != ?', [numero, siloId]);
    if (siloExistente) {
      return res.status(409).json({ error: 'Já existe outro silo com este número' });
    }
    
    await db.run(`
      UPDATE silos
      SET 
        numero = ?,
        capacidade_total = ?,
        tipo_racao = ?,
        fase_nome = ?,
        pavilhao_id = ?
      WHERE id = ?
    `, [numero, capacidade_total, tipo_racao, fase_nome, pavilhao_id || null, siloId]);
    
    res.json({ 
      success: true, 
      message: 'Silo atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar silo:', error);
    res.status(500).json({ error: 'Erro ao atualizar silo' });
  }
});

module.exports = router; 