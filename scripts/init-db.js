const db = require('../src/server/database');
const initDatabase = require('../src/server/database/init');

async function main() {
  try {
    const connection = await db.getConnection();
    await initDatabase(connection);
    console.log('Banco de dados inicializado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

main(); 