const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs').promises;
const path = require('path');
const initDatabase = require('./init');

let db = null;

async function init() {
  if (db) {
    return db;
  }

  try {
    console.log('Conectando ao banco de dados em:', path.resolve('database/database.sqlite'));
    
    // Abrir conexão
    const dbPath = process.env.DB_PATH || path.resolve('database/database.sqlite');
    
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Habilitar foreign keys
    await db.run('PRAGMA foreign_keys = ON');

    // Dropar e recriar tabelas usando o script init.js
    await initDatabase(db);
    
    console.log('Banco de dados inicializado com sucesso!');
    return db;
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

async function getConnection() {
  if (!db) {
    await init();
  }
  return db;
}

module.exports = {
  init,
  getConnection,
  run: async (...args) => {
    const conn = await getConnection();
    console.log('Executando query:', args[0], 'com parâmetros:', args.slice(1));
    return conn.run(...args);
  },
  get: async (...args) => {
    const conn = await getConnection();
    return conn.get(...args);
  },
  all: async (...args) => {
    const conn = await getConnection();
    return conn.all(...args);
  }
}; 