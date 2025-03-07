const db = require('./index');

async function seedDatabase(databaseConnection) {
  const connection = databaseConnection || db;
  
  try {
    // Limpar todas as tabelas primeiro
    await connection.run('DELETE FROM registros_sanitarios');
    await connection.run('DELETE FROM silos');
    await connection.run('DELETE FROM lotes');
    await connection.run('DELETE FROM pavilhoes');
    await connection.run('DELETE FROM tarefas_manutencao');

    console.log('Tabelas limpas com sucesso');

    // Inserir silos primeiro
    const silos = [
      { numero: 1, tipo: 'Ração Inicial', capacidade: 10000, pavilhao: 1, capacidade_pavilhao: 1000 },
      { numero: 2, tipo: 'Ração Crescimento', capacidade: 11000, pavilhao: 2, capacidade_pavilhao: 1050 },
      { numero: 3, tipo: 'Ração Terminação', capacidade: 12000, pavilhao: 3, capacidade_pavilhao: 1100 },
      { numero: 4, tipo: 'Ração Medicada', capacidade: 10500, pavilhao: 4, capacidade_pavilhao: 1000 },
      { numero: 5, tipo: 'Ração Inicial', capacidade: 12000, pavilhao: 5, capacidade_pavilhao: 1100 },
      { numero: 6, tipo: 'Ração Crescimento', capacidade: 11500, pavilhao: 6, capacidade_pavilhao: 1050 },
      { numero: 7, tipo: 'Ração Terminação', capacidade: 11000, pavilhao: 7, capacidade_pavilhao: 1000 }
    ];

    for (const silo of silos) {
      await connection.run(`
        INSERT INTO silos (
          numero,
          tipo_racao,
          capacidade_total,
          nivel_atual,
          ultima_recarga,
          pavilhao_id,
          fase_nome
        ) VALUES (?, ?, ?, ?, DATE('now'), ?, ?)
      `, [
          silo.numero, 
          silo.tipo, 
          silo.capacidade, 
          silo.capacidade * 0.8, 
          silo.pavilhao,
          silo.tipo === 'Ração Inicial' ? 'leitao' : (silo.tipo === 'Ração Crescimento' ? 'jovem' : 'adulto')
      ]);
    }

    console.log('Silos inseridos com sucesso!');

    // Inserir os 7 pavilhões
    const pavilhoes = [
      { numero: 1, status: 'disponivel', capacidade_maxima: 1000 },
      { numero: 2, status: 'disponivel', capacidade_maxima: 1050 },
      { numero: 3, status: 'disponivel', capacidade_maxima: 1100 },
      { numero: 4, status: 'disponivel', capacidade_maxima: 1000 },
      { numero: 5, status: 'disponivel', capacidade_maxima: 1100 },
      { numero: 6, status: 'disponivel', capacidade_maxima: 1050 },
      { numero: 7, status: 'disponivel', capacidade_maxima: 1000 }
    ];

    for (const pavilhao of pavilhoes) {
      await connection.run(`
        INSERT INTO pavilhoes (numero, status, silo_associado, capacidade_maxima)
        VALUES (?, ?, ?, ?)
      `, [pavilhao.numero, pavilhao.status, pavilhao.numero, pavilhao.capacidade_maxima]);
    }

    console.log('Pavilhões inicializados com sucesso!');

    // Inserir lotes de exemplo
    const lote1Result = await connection.run(`
      INSERT INTO lotes (
        data_entrada, 
        quantidade_inicial, 
        peso_medio_inicial, 
        data_saida_prevista,
        status,
        pavilhao_id
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0],
      1000,
      0.150,
      new Date(Date.now() + 60*24*60*60*1000).toISOString().split('T')[0],
      'ativo',
      1
    ]);

    const lote2Result = await connection.run(`
      INSERT INTO lotes (
        data_entrada, 
        quantidade_inicial, 
        peso_medio_inicial, 
        data_saida_prevista,
        status,
        pavilhao_id
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      new Date(Date.now() - 15*24*60*60*1000).toISOString().split('T')[0],
      1000,
      0.150,
      new Date(Date.now() + 75*24*60*60*1000).toISOString().split('T')[0],
      'ativo',
      2
    ]);

    console.log('Lotes inseridos com sucesso!');

    // Atualizar pavilhões com os lotes
    await connection.run(`
      UPDATE pavilhoes 
      SET status = 'ocupado', lote_atual_id = ?
      WHERE numero = 1
    `, [lote1Result.lastID]);

    await connection.run(`
      UPDATE pavilhoes 
      SET status = 'ocupado', lote_atual_id = ?
      WHERE numero = 2
    `, [lote2Result.lastID]);

    console.log('Pavilhões atualizados com os lotes!');

    // Inserir tarefas de manutenção de exemplo
    await seedTarefasManutencao(connection);
    
    // Inserir registros sanitários para os lotes
    await seedRegistrosSanitarios(connection);

    console.log('Seed completo!');
  } catch (error) {
    console.error('Erro ao inserir dados de exemplo:', error);
    throw error;
  }
}

// Adicionar dados de teste para tarefas de manutenção
async function seedTarefasManutencao(connection) {
  try {
    console.log('Inserindo dados de teste para tarefas de manutenção...');
    
    // Data de hoje, -2 dias, +2 dias, +5 dias
    const hoje = new Date();
    const dataDoisDiasAtras = new Date();
    dataDoisDiasAtras.setDate(hoje.getDate() - 2);
    const dataDoisDiasFrente = new Date();
    dataDoisDiasFrente.setDate(hoje.getDate() + 2);
    const dataCincoDiasFrente = new Date();
    dataCincoDiasFrente.setDate(hoje.getDate() + 5);
    
    // Tarefas de manutenção
    const tarefasManutencao = [
      {
        titulo: 'Manutenção no sistema de alimentação',
        descricao: 'Realizar limpeza e verificação do funcionamento do sistema de alimentação do pavilhão 1',
        data_criacao: dataDoisDiasAtras.toISOString().slice(0, 10),
        data_prevista: dataDoisDiasAtras.toISOString().slice(0, 10),
        prioridade: 'alta',
        status: 'pendente'
      },
      {
        titulo: 'Verificação do sistema de ventilação',
        descricao: 'Verificar funcionamento de todos os ventiladores do pavilhão 2',
        data_criacao: dataDoisDiasAtras.toISOString().slice(0, 10),
        data_prevista: hoje.toISOString().slice(0, 10),
        prioridade: 'media',
        status: 'pendente'
      },
      {
        titulo: 'Manutenção preventiva nos silos',
        descricao: 'Realizar verificação de rotina nos sensores de nível dos silos',
        data_criacao: hoje.toISOString().slice(0, 10),
        data_prevista: dataDoisDiasFrente.toISOString().slice(0, 10),
        prioridade: 'baixa',
        status: 'pendente'
      },
      {
        titulo: 'Calibração de balanças',
        descricao: 'Calibrar as balanças utilizadas para pesagem dos animais',
        data_criacao: hoje.toISOString().slice(0, 10),
        data_prevista: dataCincoDiasFrente.toISOString().slice(0, 10),
        prioridade: 'media',
        status: 'pendente'
      }
    ];
    
    for (const tarefa of tarefasManutencao) {
      await connection.run(`
        INSERT INTO tarefas_manutencao (
          titulo, descricao, data_criacao, data_prevista, prioridade, status
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        tarefa.titulo,
        tarefa.descricao,
        tarefa.data_criacao,
        tarefa.data_prevista,
        tarefa.prioridade,
        tarefa.status
      ]);
    }
    
    console.log('Dados de teste para tarefas de manutenção inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir dados de teste para tarefas de manutenção:', error);
    throw error;
  }
}

// Adicionar dados de teste para registros sanitários
async function seedRegistrosSanitarios(connection) {
  try {
    console.log('Inserindo dados de teste para registros sanitários...');
    
    // Obter IDs dos lotes
    const lotes = await connection.all('SELECT id FROM lotes LIMIT 3');
    if (lotes.length === 0) {
      console.log('Nenhum lote encontrado para associar registros sanitários');
      return;
    }
    
    // Data de hoje, -2 dias, +2 dias, +5 dias
    const hoje = new Date();
    const dataDoisDiasAtras = new Date();
    dataDoisDiasAtras.setDate(hoje.getDate() - 2);
    const dataDoisDiasFrente = new Date();
    dataDoisDiasFrente.setDate(hoje.getDate() + 2);
    const dataCincoDiasFrente = new Date();
    dataCincoDiasFrente.setDate(hoje.getDate() + 5);
    
    // Registros sanitários
    const registrosSanitarios = [
      {
        lote_id: lotes[0].id,
        tipo: 'vacina',
        descricao: 'Vacina contra gripe suína',
        data_registro: dataDoisDiasAtras.toISOString().slice(0, 10),
        data_prevista: dataDoisDiasAtras.toISOString().slice(0, 10),
        medicamento: 'Vacina GS-23',
        dosagem: '2ml por animal',
        observacoes: 'Aplicar em todos os animais do lote',
        status: 'pendente'
      },
      {
        lote_id: lotes[0].id,
        tipo: 'vacina',
        descricao: 'Vacina contra febre aftosa',
        data_registro: dataDoisDiasAtras.toISOString().slice(0, 10),
        data_prevista: hoje.toISOString().slice(0, 10),
        medicamento: 'Vacina FA-10',
        dosagem: '3ml por animal',
        observacoes: 'Priorizar animais mais jovens',
        status: 'pendente'
      },
      {
        lote_id: lotes[0].id,
        tipo: 'tratamento',
        descricao: 'Tratamento preventivo contra parasitas',
        data_registro: hoje.toISOString().slice(0, 10),
        data_prevista: dataDoisDiasFrente.toISOString().slice(0, 10),
        medicamento: 'Anti-parasitário geral',
        dosagem: '5ml por animal',
        observacoes: 'Adicionar ao alimento',
        status: 'pendente'
      },
      {
        lote_id: lotes[0].id,
        tipo: 'vacina',
        descricao: 'Reforço vacinal',
        data_registro: hoje.toISOString().slice(0, 10),
        data_prevista: dataCincoDiasFrente.toISOString().slice(0, 10),
        medicamento: 'Vacina polivalente',
        dosagem: '2.5ml por animal',
        observacoes: 'Reforço da vacinação anterior',
        status: 'pendente'
      }
    ];
    
    for (const registro of registrosSanitarios) {
      await connection.run(`
        INSERT INTO registros_sanitarios (
          lote_id, tipo, descricao, data_registro, data_prevista, 
          medicamento, dosagem, observacoes, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        registro.lote_id,
        registro.tipo,
        registro.descricao,
        registro.data_registro,
        registro.data_prevista,
        registro.medicamento,
        registro.dosagem,
        registro.observacoes,
        registro.status
      ]);
    }
    
    console.log('Dados de teste para registros sanitários inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir dados de teste para registros sanitários:', error);
    throw error;
  }
}

module.exports = seedDatabase; 