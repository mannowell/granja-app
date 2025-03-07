const express = require('express');
const router = express.Router();
const lotesRoutes = require('./lotes');
const pavilhoesRoutes = require('./pavilhoes');
const sanitarioRoutes = require('./sanitario');
const manutencaoRoutes = require('./manutencao');
const silosRoutes = require('./silos');

// Rotas principais
router.use('/lotes', lotesRoutes);
router.use('/pavilhoes', pavilhoesRoutes);
router.use('/sanitario', sanitarioRoutes);
router.use('/manutencao', manutencaoRoutes);
router.use('/silos', silosRoutes);

// Rota de status da API
router.get('/status', (req, res) => {
  res.json({ status: 'online' });
});

// Rota para dados do dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Aqui você pode adicionar a lógica para buscar os dados do dashboard
    res.json({
      totalAnimais: 0,
      lotesAtivos: 0,
      pavilhoesOcupados: 0,
      alertasSanitarios: 0
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
  }
});

module.exports = router; 