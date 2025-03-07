const { getConnection } = require('./index');
const seedDatabase = require('./seed');

async function run() {
  try {
    console.log('Iniciando seed do banco de dados...');
    const db = await getConnection();
    
    // Executar seed
    await seedDatabase(db);
    
    console.log('Seed concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao executar seed:', error);
    process.exit(1);
  }
}

run(); 