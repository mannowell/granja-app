const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const routes = require('./routes');
const iniciarScheduler = require('./schedulers/consumoScheduler');

// Importar rotas
const lotesRoutes = require('./routes/lotes');
const silosRoutes = require('./routes/silos');
const sanitarioRoutes = require('./routes/sanitario');
const manutencaoRoutes = require('./routes/manutencao');
const statsRoutes = require('./routes/stats');
const animaisRoutes = require('./routes/animais');
const pavilhoesRoutes = require('./routes/pavilhoes');

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware para verificar conexão com banco
app.use(async (req, res, next) => {
  try {
    const conn = await db.getConnection();
    if (!conn) {
      throw new Error('Sem conexão com o banco de dados');
    }
    next();
  } catch (error) {
    console.error('Erro de conexão:', error);
    res.status(500).json({ error: 'Erro de conexão com o banco de dados' });
  }
});

// Prefixo /api para todas as rotas
// app.use('/api', routes);

// Rotas
app.use('/api/lotes', lotesRoutes);
app.use('/api/silos', silosRoutes);
app.use('/api/sanitario', sanitarioRoutes);
app.use('/api/manutencao', manutencaoRoutes);
app.use('/api/animais', animaisRoutes);
app.use('/api/pavilhoes', pavilhoesRoutes);
app.use('/api', statsRoutes);

// Rota 404 para APIs não encontradas
app.use('/api/*', (req, res) => {
  console.log('Rota não encontrada:', req.originalUrl);
  res.status(404).json({ error: 'API não encontrada' });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Inicialização do servidor
const startServer = async () => {
  try {
    // Inicializar banco de dados
    console.log('Inicializando banco de dados...');
    await db.init();
    console.log('Banco de dados inicializado com sucesso');

    // Iniciar o scheduler de consumo
    iniciarScheduler();

    // Iniciar servidor
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Promise rejeitada não tratada:', error);
  process.exit(1);
});

startServer();

module.exports = app; 