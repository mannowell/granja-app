const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { init: initDb } = require('../src/server/database');

async function verificaSilos() {
  try {
    console.log('📊 Iniciando verificação dos silos e pavilhões...');
    
    // Inicializar o banco de dados
    await initDb();
    
    // Conectar ao banco de dados
    const dbPath = path.resolve(__dirname, '../database/database.sqlite');
    console.log(`Conectando ao banco de dados em: ${dbPath}`);
    
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
    
    // Verificar a estrutura da tabela silos
    db.all(`PRAGMA table_info(silos)`, (err, rows) => {
      if (err) {
        console.error('Erro ao obter informações da tabela silos:', err.message);
        closeDb(db);
        return;
      }
      
      console.log('Estrutura da tabela silos:');
      console.table(rows);
      
      // Verificar a estrutura da tabela pavilhoes
      db.all(`PRAGMA table_info(pavilhoes)`, (err, rows) => {
        if (err) {
          console.error('Erro ao obter informações da tabela pavilhoes:', err.message);
          closeDb(db);
          return;
        }
        
        console.log('Estrutura da tabela pavilhoes:');
        console.table(rows);
        
        // Atualizar os silos para associar corretamente aos pavilhões
        db.run(`
          UPDATE silos
          SET pavilhao_id = numero
          WHERE numero BETWEEN 1 AND 7
        `, function(err) {
          if (err) {
            console.error('Erro ao atualizar silos:', err.message);
            closeDb(db);
            return;
          }
          
          console.log(`Silos atualizados: ${this.changes}`);
          
          // Atualizar os pavilhões para associar corretamente aos silos
          db.run(`
            UPDATE pavilhoes
            SET silo_associado = numero
            WHERE numero BETWEEN 1 AND 7
          `, function(err) {
            if (err) {
              console.error('Erro ao atualizar pavilhões:', err.message);
              closeDb(db);
              return;
            }
            
            console.log(`Pavilhões atualizados: ${this.changes}`);
            
            // Verificar os silos após a atualização
            db.all(`
              SELECT s.id, s.numero, s.tipo_racao, s.capacidade_total, s.nivel_atual, s.pavilhao_id, p.numero as pavilhao_numero
              FROM silos s
              LEFT JOIN pavilhoes p ON s.pavilhao_id = p.numero
              ORDER BY s.numero
            `, (err, rows) => {
              if (err) {
                console.error('Erro ao obter silos:', err.message);
                closeDb(db);
                return;
              }
              
              console.log('Silos após atualização:');
              console.table(rows);
              
              // Verificar os pavilhões após a atualização
              db.all(`
                SELECT p.numero, p.status, p.silo_associado
                FROM pavilhoes p
                ORDER BY p.numero
              `, (err, rows) => {
                if (err) {
                  console.error('Erro ao obter pavilhões:', err.message);
                  closeDb(db);
                  return;
                }
                
                console.log('Pavilhões após atualização:');
                console.table(rows);
                
                console.log('✅ Verificação e atualização concluídas com sucesso!');
                closeDb(db);
              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('❌ Erro ao verificar e atualizar silos e pavilhões:', error);
  }
}

function closeDb(db) {
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar o banco de dados:', err.message);
    } else {
      console.log('Conexão com o banco de dados fechada');
    }
  });
}

// Executar a função se este script for executado diretamente
if (require.main === module) {
  verificaSilos();
} 