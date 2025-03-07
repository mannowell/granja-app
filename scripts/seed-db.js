const seedDatabase = require('../src/server/database/seed');

async function main() {
  try {
    await seedDatabase();
    console.log('Dados de exemplo inseridos com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao inserir dados de exemplo:', error);
    process.exit(1);
  }
}

main(); 