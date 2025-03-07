const express = require('express');
const router = express.Router();
const { getConnection } = require('../database');

// Rota para estatísticas de lotes
router.get('/lotes/stats', async (req, res) => {
  try {
    const db = await getConnection();
    
    // Obter total de lotes
    const totalLotes = await db.get('SELECT COUNT(*) as total FROM lotes');
    
    // Obter lotes ativos
    const lotesAtivos = await db.get("SELECT COUNT(*) as ativos FROM lotes WHERE status = 'ativo'");
    
    // Obter total de animais (da tabela animais_status mais recente por lote)
    const totalAnimais = await db.get(`
      SELECT SUM(quantidade_atual) as total 
      FROM animais_status 
      WHERE id IN (
        SELECT MAX(id) 
        FROM animais_status 
        GROUP BY lote_id
      )
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

// Rota para estatísticas de silos
router.get('/silos/stats', async (req, res) => {
  try {
    const db = await getConnection();
    
    // Obter total de silos
    const totalSilos = await db.get('SELECT COUNT(*) as total FROM silos');
    
    // Obter silos ativos (com nível atual > 0)
    const silosAtivos = await db.get('SELECT COUNT(*) as ativos FROM silos WHERE nivel_atual > 0');
    
    // Obter silos por tipo de ração
    const silosPorTipo = await db.all('SELECT tipo_racao, COUNT(*) as quantidade FROM silos GROUP BY tipo_racao');
    
    // Calcular nível médio de estoque
    const nivelEstoque = await db.get('SELECT AVG(nivel_atual) as media FROM silos');
    
    res.json({
      total: totalSilos ? totalSilos.total || 0 : 0,
      ativos: silosAtivos ? silosAtivos.ativos || 0 : 0,
      porTipo: silosPorTipo || [],
      nivelMedio: nivelEstoque && nivelEstoque.media ? nivelEstoque.media : 0
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas de silos:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas de silos', details: error.message });
  }
});

// Rota para estatísticas de registros sanitários
router.get('/sanitario/stats', async (req, res) => {
  try {
    const db = await getConnection();
    
    // Obter total de registros
    const totalRegistros = await db.get('SELECT COUNT(*) as total FROM registros_sanitarios');
    
    // Obter registros dos últimos 30 dias
    const registrosRecentes = await db.get(
      "SELECT COUNT(*) as recentes FROM registros_sanitarios WHERE data_registro >= date('now', '-30 days')"
    );
    
    // Obter registros por tipo
    const registrosPorTipo = await db.all(
      'SELECT tipo, COUNT(*) as quantidade FROM registros_sanitarios GROUP BY tipo'
    );
    
    // Obter registros por status
    const registrosPorStatus = await db.all(
      'SELECT status, COUNT(*) as quantidade FROM registros_sanitarios GROUP BY status'
    );
    
    res.json({
      total: totalRegistros ? totalRegistros.total || 0 : 0,
      recentes: registrosRecentes ? registrosRecentes.recentes || 0 : 0,
      porTipo: registrosPorTipo || [],
      porStatus: registrosPorStatus || []
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas sanitárias:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas sanitárias', details: error.message });
  }
});

// Rota para estatísticas de manutenção
router.get('/manutencao/stats', async (req, res) => {
  try {
    const db = await getConnection();
    
    // Obter total de manutenções
    const totalManutencoes = await db.get('SELECT COUNT(*) as total FROM tarefas_manutencao');
    
    // Obter manutenções pendentes
    const manutencoesPendentes = await db.get(
      "SELECT COUNT(*) as pendentes FROM tarefas_manutencao WHERE status = 'pendente'"
    );
    
    // Obter manutenções por status
    const manutencoesPorStatus = await db.all(
      'SELECT status, COUNT(*) as quantidade FROM tarefas_manutencao GROUP BY status'
    );
    
    // Obter manutenções por prioridade
    const manutencoesPorPrioridade = await db.all(
      'SELECT prioridade, COUNT(*) as quantidade FROM tarefas_manutencao GROUP BY prioridade'
    );
    
    res.json({
      total: totalManutencoes ? totalManutencoes.total || 0 : 0,
      pendentes: manutencoesPendentes ? manutencoesPendentes.pendentes || 0 : 0,
      porStatus: manutencoesPorStatus || [],
      porPrioridade: manutencoesPorPrioridade || []
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas de manutenção:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas de manutenção', details: error.message });
  }
});

// Rota para tarefas de manutenção
router.get('/manutencao/tarefas', async (req, res) => {
  try {
    const db = await getConnection();
    
    // Obter todas as tarefas de manutenção
    const tarefas = await db.all(`
      SELECT id, titulo, descricao, data_criacao, data_prevista, prioridade, status
      FROM tarefas_manutencao
      ORDER BY 
        CASE prioridade
          WHEN 'alta' THEN 1
          WHEN 'media' THEN 2
          WHEN 'baixa' THEN 3
        END,
        data_prevista ASC
    `);
    
    res.json(tarefas);
  } catch (error) {
    console.error('Erro ao buscar tarefas de manutenção:', error);
    res.status(500).json({ error: 'Erro ao buscar tarefas de manutenção', details: error.message });
  }
});

module.exports = router; 