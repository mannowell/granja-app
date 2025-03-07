const { getConnection } = require('../database');

async function verificaECriaSilos() {
  try {
    console.log('📊 Iniciando verificação dos silos e pavilhões...');
    const db = await getConnection();
    
    // Verificar silos existentes
    const silosExistentes = await db.all('SELECT * FROM silos');
    console.log(`Silos existentes: ${silosExistentes.length}`);
    
    // Verificar pavilhões existentes
    const pavilhoesExistentes = await db.all('SELECT * FROM pavilhoes');
    console.log(`Pavilhões existentes: ${pavilhoesExistentes.length}`);
    
    // Primeiro, garantir que existam os 7 pavilhões
    for (let numero = 1; numero <= 7; numero++) {
      // Verificar se o pavilhão com este número já existe
      const pavilhao = pavilhoesExistentes.find(p => p.numero === numero);
      
      if (pavilhao) {
        console.log(`Pavilhão ${numero} já existe.`);
      } else {
        console.log(`Criando pavilhão ${numero}...`);
        
        const capacidadeMaxima = numero % 2 === 0 ? 1050 : 1000;
        
        // Criar o pavilhão
        await db.run(`
          INSERT INTO pavilhoes (numero, status, capacidade_maxima)
          VALUES (?, ?, ?)
        `, [numero, 'disponivel', capacidadeMaxima]);
      }
    }
    
    // Agora, garantir que existam os 7 silos
    for (let numero = 1; numero <= 7; numero++) {
      // Verificar se o silo com este número já existe
      const silo = silosExistentes.find(s => s.numero === numero);
      
      if (silo) {
        console.log(`Silo ${numero} já existe. Atualizando associação com pavilhão ${numero}...`);
        
        // Atualizar o silo para garantir que esteja corretamente associado ao pavilhão
        await db.run(`
          UPDATE silos
          SET pavilhao_id = ?
          WHERE numero = ?
        `, [numero, numero]);
      } else {
        console.log(`Criando silo ${numero}...`);
        
        // Criar o silo associado ao pavilhão
        const tipoRacao = 
          numero <= 2 ? 'Ração Inicial' : 
          numero <= 5 ? 'Ração Crescimento' : 
          'Ração Terminação';
        
        const faseNome = 
          tipoRacao === 'Ração Inicial' ? 'leitao' : 
          tipoRacao === 'Ração Crescimento' ? 'jovem' : 
          'adulto';
          
        const capacidade = numero % 2 === 0 ? 1500 : 2000;
        
        await db.run(`
          INSERT INTO silos (
            numero,
            capacidade_total,
            nivel_atual,
            tipo_racao,
            ultima_recarga,
            fase_nome,
            pavilhao_id
          ) VALUES (?, ?, ?, ?, DATE('now'), ?, ?)
        `, [
          numero,
          capacidade,
          capacidade * 0.75,
          tipoRacao,
          faseNome,
          numero
        ]);
      }
    }
    
    // Verificar se os pavilhões têm a referência correta ao silo
    for (let numero = 1; numero <= 7; numero++) {
      await db.run(`
        UPDATE pavilhoes
        SET silo_associado = ?
        WHERE numero = ?
      `, [numero, numero]);
    }
    
    console.log('✅ Verificação e criação/atualização de silos e pavilhões concluída com sucesso!');
    
    // Verificar resultado final dos silos
    const silosFinal = await db.all(`
      SELECT s.id, s.numero, s.tipo_racao, s.capacidade_total, s.nivel_atual, s.pavilhao_id, p.numero as pavilhao_numero
      FROM silos s
      LEFT JOIN pavilhoes p ON s.pavilhao_id = p.numero
      ORDER BY s.numero
    `);
    
    console.log('Silos após verificação:');
    console.table(silosFinal);
    
    // Verificar resultado final dos pavilhões
    const pavilhoesFinal = await db.all(`
      SELECT p.numero, p.status, p.capacidade_maxima, p.silo_associado
      FROM pavilhoes p
      ORDER BY p.numero
    `);
    
    console.log('Pavilhões após verificação:');
    console.table(pavilhoesFinal);
    
    return { silos: silosFinal, pavilhoes: pavilhoesFinal };
  } catch (error) {
    console.error('❌ Erro ao verificar e criar silos e pavilhões:', error);
    throw error;
  }
}

// Executar a função se este script for executado diretamente
if (require.main === module) {
  verificaECriaSilos()
    .then(() => {
      console.log('Script concluído com sucesso!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Erro ao executar o script:', error);
      process.exit(1);
    });
}

module.exports = { verificaECriaSilos }; 