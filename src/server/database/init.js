const db = require('./index');

async function initDatabase(db) {
  console.log('🚀 Iniciando inicialização do banco de dados');
  const startTime = Date.now();

  try {
    // Desabilitar verificação de chave estrangeira temporariamente
    await db.run('PRAGMA foreign_keys = OFF');
    console.log('✅ Verificação de chave estrangeira desabilitada');

    // Array de definições de tabelas para processamento sequencial
    const tabelasParaCriar = [
      {
        nome: 'silos',
        sql: `
          CREATE TABLE IF NOT EXISTS silos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero INTEGER NOT NULL CHECK (numero BETWEEN 1 AND 7),
            capacidade_total REAL NOT NULL,
            nivel_atual REAL NOT NULL,
            tipo_racao TEXT NOT NULL,
            ultima_recarga DATE,
            fase_nome TEXT DEFAULT 'Não definida',
            pavilhao_id INTEGER
          )
        `
      },
      {
        nome: 'pavilhoes',
        sql: `
          CREATE TABLE IF NOT EXISTS pavilhoes (
            numero INTEGER PRIMARY KEY CHECK (numero BETWEEN 1 AND 7),
            status TEXT DEFAULT 'finalizado',
            lote_atual_id INTEGER,
            silo_associado INTEGER,
            capacidade_maxima INTEGER DEFAULT 1000
          )
        `
      },
      {
        nome: 'lotes',
        sql: `
          CREATE TABLE IF NOT EXISTS lotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pavilhao_id INTEGER NOT NULL,
            data_entrada DATE NOT NULL,
            data_saida_prevista DATE NOT NULL,
            quantidade_inicial INTEGER NOT NULL,
            peso_medio_inicial REAL NOT NULL,
            status TEXT CHECK (status IN ('ativo', 'finalizado', 'em_quarentena')),
            idade_atual INTEGER DEFAULT 0,
            fase_atual TEXT CHECK (fase_atual IN ('leitao', 'jovem', 'adulto')) DEFAULT 'leitao',
            consumo_diario_racao REAL DEFAULT 0
          )
        `
      },
      {
        nome: 'consumo_diario_racao',
        sql: `
          CREATE TABLE IF NOT EXISTS consumo_diario_racao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lote_id INTEGER NOT NULL,
            silo_id INTEGER NOT NULL,
            data_consumo DATE NOT NULL,
            quantidade_consumida REAL NOT NULL,
            fase TEXT NOT NULL DEFAULT 'leitao',
            FOREIGN KEY (lote_id) REFERENCES lotes (id),
            FOREIGN KEY (silo_id) REFERENCES silos (id)
          )
        `
      },
      {
        nome: 'animais_status',
        sql: `
          CREATE TABLE IF NOT EXISTS animais_status (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lote_id INTEGER NOT NULL,
            data_medicao DATE NOT NULL,
            peso_medio REAL,
            quantidade_atual INTEGER,
            mortalidade_periodo INTEGER,
            causa_mortalidade TEXT,
            FOREIGN KEY (lote_id) REFERENCES lotes (id)
          )
        `
      },
      {
        nome: 'registros_sanitarios',
        sql: `
          CREATE TABLE IF NOT EXISTS registros_sanitarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lote_id INTEGER NOT NULL,
            tipo TEXT NOT NULL,
            descricao TEXT NOT NULL,
            data_registro DATE NOT NULL,
            data_prevista DATE NOT NULL,
            medicamento TEXT,
            dosagem TEXT,
            observacoes TEXT,
            status TEXT NOT NULL DEFAULT 'pendente',
            FOREIGN KEY (lote_id) REFERENCES lotes (id)
          )
        `
      },
      {
        nome: 'tarefas_manutencao',
        sql: `
          CREATE TABLE IF NOT EXISTS tarefas_manutencao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descricao TEXT NOT NULL,
            data_criacao DATE NOT NULL,
            data_prevista DATE NOT NULL,
            prioridade TEXT NOT NULL CHECK (prioridade IN ('baixa', 'media', 'alta')),
            status TEXT NOT NULL DEFAULT 'pendente'
          )
        `
      },
      {
        nome: 'consumo_racao',
        sql: `
          CREATE TABLE IF NOT EXISTS consumo_racao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lote_id INTEGER NOT NULL,
            data_consumo DATE NOT NULL,
            quantidade_racao REAL NOT NULL,
            FOREIGN KEY (lote_id) REFERENCES lotes (id)
          )
        `
      },
      {
        nome: 'alertas_silos',
        sql: `
          CREATE TABLE IF NOT EXISTS alertas_silos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            silo_id INTEGER NOT NULL,
            data_alerta DATE NOT NULL,
            tipo_alerta TEXT NOT NULL,
            nivel_atual REAL NOT NULL,
            nivel_necessario REAL NOT NULL,
            resolvido INTEGER DEFAULT 0,
            data_resolucao DATE,
            FOREIGN KEY (silo_id) REFERENCES silos (id)
          )
        `
      }
    ];

    // Criação sequencial de tabelas com log de progresso
    for (const tabela of tabelasParaCriar) {
      try {
        console.log(`🔨 Criando tabela: ${tabela.nome}`);
        await db.run(tabela.sql);
        console.log(`✅ Tabela ${tabela.nome} criada com sucesso`);
      } catch (tabelaError) {
        console.error(`❌ Erro ao criar tabela ${tabela.nome}:`, tabelaError);
        throw tabelaError; // Interromper inicialização em caso de erro
      }
    }

    // Reabilitar verificação de chave estrangeira
    await db.run('PRAGMA foreign_keys = ON');
    console.log('✅ Verificação de chave estrangeira reabilitada');

    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`🎉 Inicialização do banco de dados concluída em ${duration}ms`);
  } catch (error) {
    console.error('❌ Erro crítico durante inicialização do banco de dados:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });

    // Tentar reabilitar chaves estrangeiras mesmo em caso de erro
    try {
      await db.run('PRAGMA foreign_keys = ON');
    } catch (pragmaError) {
      console.error('❌ Erro ao reabilitar chaves estrangeiras:', pragmaError);
    }

    throw error; // Propagar erro para tratamento superior
  }
}

module.exports = initDatabase;