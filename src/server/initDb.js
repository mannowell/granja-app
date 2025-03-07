const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Garantir que o diretório database existe
const dbDir = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)){
    fs.mkdirSync(dbDir);
}

const db = new sqlite3.Database(path.join(dbDir, 'granja.db'));

async function initializeDatabase() {
  try {
    const schemaPath = path.join(__dirname, '../../database/schema.sqlite.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    db.serialize(() => {
      // Habilitar foreign keys
      db.run('PRAGMA foreign_keys = ON');

      // Executar cada comando do schema separadamente
      schema.split(';').forEach((command) => {
        if (command.trim()) {
          db.run(command, (err) => {
            if (err) {
              console.error('Erro ao executar comando:', command);
              console.error(err);
            }
          });
        }
      });
    });

    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
  }
}

initializeDatabase();

module.exports = db; 