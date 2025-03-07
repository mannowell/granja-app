import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function insertTestData() {
  try {
    // Inserir fases de produção
    await pool.query(`
      INSERT INTO fases_producao (nome, peso_inicial, peso_final, consumo_diario_estimado)
      VALUES 
        ('Inicial', 20, 50, 2.5),
        ('Crescimento', 50, 80, 3.5),
        ('Terminação', 80, 120, 4.5)
    `);

    // Inserir um lote
    const loteResult = await pool.query(`
      INSERT INTO lotes (data_entrada, quantidade_inicial, peso_medio_inicial, status)
      VALUES (CURRENT_DATE - INTERVAL '30 days', 100, 22.5, 'ativo')
      RETURNING id
    `);
    const loteId = loteResult.rows[0].id;

    // Inserir status dos animais
    await pool.query(`
      INSERT INTO animais_status (lote_id, data_medicao, peso_medio, quantidade_atual, mortalidade_periodo)
      VALUES ($1, CURRENT_DATE, 45.5, 98, 2)
    `, [loteId]);

    // Inserir silos
    await pool.query(`
      INSERT INTO silos (capacidade_total, tipo_racao, nivel_atual, ultima_recarga, alerta_minimo)
      VALUES 
        (1000, 'Ração Inicial', 800, CURRENT_DATE - INTERVAL '5 days', 200),
        (1500, 'Ração Crescimento', 600, CURRENT_DATE - INTERVAL '3 days', 300),
        (2000, 'Ração Terminação', 1200, CURRENT_DATE - INTERVAL '2 days', 400)
    `);

    // Inserir mortalidades
    await pool.query(`
      INSERT INTO mortalidade (lote_id, data_morte, quantidade, causa)
      VALUES 
        ($1, CURRENT_DATE - INTERVAL '20 days', 1, 'Morte Súbita'),
        ($1, CURRENT_DATE - INTERVAL '15 days', 1, 'Pneumonia')
    `, [loteId]);

    // Inserir manutenções
    await pool.query(`
      INSERT INTO manutencoes (area, tipo_manutencao, data_programada, status, prioridade)
      VALUES 
        ('Silo 1', 'Limpeza', CURRENT_DATE + INTERVAL '2 days', 'pendente', 'media'),
        ('Galpão A', 'Manutenção Elétrica', CURRENT_DATE + INTERVAL '5 days', 'pendente', 'alta')
    `);

    console.log('Dados de teste inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir dados de teste:', error);
  } finally {
    await pool.end();
  }
}

insertTestData(); 