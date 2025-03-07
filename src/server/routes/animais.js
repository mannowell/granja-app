const express = require('express');
const router = express.Router();
const { getConnection } = require('../database');

// Retorna o total de animais na granja
router.get('/total', async (req, res) => {
  try {
    const db = await getConnection();
    
    // Calculamos o total de animais somando a quantidade inicial dos lotes ativos
    const totalResult = await db.get(`
      SELECT SUM(quantidade_inicial) as total 
      FROM lotes 
      WHERE status = 'ativo'
    `);
    
    const total = totalResult && totalResult.total ? totalResult.total : 0;
    
    res.json({ total });
  } catch (error) {
    console.error('Erro ao buscar total de animais:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar total de animais', 
      details: error.message 
    });
  }
});

// Retorna dados de mortalidade
router.get('/mortalidade', async (req, res) => {
  try {
    const db = await getConnection();
    
    // Dados de mortalidade dos últimos 30 dias (simulado)
    // Em um cenário real, você buscaria esses dados de uma tabela específica de registros de mortalidade
    const totalAnimaisResult = await db.get(`
      SELECT SUM(quantidade_inicial) as total 
      FROM lotes 
      WHERE status = 'ativo'
    `);
    
    const totalAnimais = totalAnimaisResult && totalAnimaisResult.total ? totalAnimaisResult.total : 0;
    
    // Como não temos registros reais de mortalidade, vamos simular dados
    const taxaMortalidade = 0.02; // 2% de mortalidade
    const totalMortalidade = Math.round(totalAnimais * taxaMortalidade);
    
    // Últimos 30 dias representados como objeto com data e quantidade
    const mortalidadePorDia = [];
    const hoje = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const dia = new Date(hoje);
      dia.setDate(hoje.getDate() - i);
      
      // Distribuição aleatória da mortalidade pelos dias
      const quantidadeDia = i === 0 ? 0 : Math.round(totalMortalidade / 30 * (Math.random() + 0.5));
      
      mortalidadePorDia.push({
        data: dia.toISOString().split('T')[0],
        quantidade: quantidadeDia
      });
    }
    
    res.json({
      total: totalMortalidade,
      taxaPercentual: taxaMortalidade * 100,
      porDia: mortalidadePorDia
    });
  } catch (error) {
    console.error('Erro ao buscar dados de mortalidade:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar dados de mortalidade', 
      details: error.message 
    });
  }
});

module.exports = router; 