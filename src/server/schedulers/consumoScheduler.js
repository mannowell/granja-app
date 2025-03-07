const { getConnection } = require('../database');

async function calcularConsumoRacao() {
  const db = await getConnection();
  const dataAtual = new Date().toISOString().split('T')[0];
  
  console.log(`🔄 Executando cálculo de consumo de ração para: ${dataAtual}`);
  
  try {
    // Obter todos os lotes ativos
    const lotesAtivos = await db.all(`
      SELECT 
        l.id, 
        l.pavilhao_id, 
        l.data_entrada, 
        l.quantidade_inicial, 
        l.fase_atual,
        julianday('now') - julianday(l.data_entrada) as idade_dias,
        COALESCE(
          (SELECT quantidade_atual FROM animais_status 
           WHERE lote_id = l.id 
           ORDER BY data_medicao DESC LIMIT 1), 
          l.quantidade_inicial
        ) as quantidade_atual,
        p.silo_associado,
        s.id as silo_id,
        s.nivel_atual as nivel_silo
      FROM lotes l
      JOIN pavilhoes p ON l.pavilhao_id = p.numero
      JOIN silos s ON p.silo_associado = s.id
      WHERE l.status = 'ativo'
    `);
    
    // Para cada lote, calcular consumo e atualizar silo
    for (const lote of lotesAtivos) {
      // Calcular consumo diário com base na idade e quantidade de animais
      let consumoDiarioAnimal = 0;
      
      // Idade em dias
      const idadeDias = lote.idade_dias;
      
      // Cálculo do consumo por animal baseado na idade
      if (idadeDias <= 30) {
        // Fase inicial (leitão): 1kg por dia
        consumoDiarioAnimal = 1.0;
      } else if (idadeDias <= 60) {
        // Fase de crescimento: 1.5kg por dia
        consumoDiarioAnimal = 1.5;
      } else {
        // Fase de terminação: 2kg por dia
        consumoDiarioAnimal = 2.0;
      }
      
      // Consumo total do lote
      const consumoTotal = Math.round(consumoDiarioAnimal * lote.quantidade_atual);
      
      // Verificar se o silo tem ração suficiente
      if (lote.nivel_silo < consumoTotal) {
        console.warn(`⚠️ ALERTA: Silo ${lote.silo_associado} está com nível crítico (${lote.nivel_silo}kg disponível, necessário ${consumoTotal}kg)`);
        
        // Registrar alerta no banco de dados
        await db.run(`
          INSERT INTO alertas_silos (
            silo_id,
            data_alerta,
            tipo_alerta,
            nivel_atual,
            nivel_necessario,
            resolvido
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
          lote.silo_id,
          dataAtual,
          'nivel_baixo',
          lote.nivel_silo,
          consumoTotal,
          0
        ]);
        
        // Continuar com o que tiver no silo
        await db.run(`
          UPDATE silos
          SET nivel_atual = 0
          WHERE id = ?
        `, [lote.silo_id]);
      } else {
        // Atualizar nível do silo
        await db.run(`
          UPDATE silos
          SET nivel_atual = nivel_atual - ?
          WHERE id = ?
        `, [consumoTotal, lote.silo_id]);
        
        // Registrar o consumo
        await db.run(`
          INSERT INTO consumo_diario_racao (
            lote_id,
            silo_id,
            data_consumo,
            quantidade_consumida,
            fase
          ) VALUES (?, ?, ?, ?, ?)
        `, [
          lote.id,
          lote.silo_id,
          dataAtual,
          consumoTotal,
          lote.fase_atual
        ]);
        
        // Atualizar o consumo diário no lote
        await db.run(`
          UPDATE lotes
          SET consumo_diario_racao = ?
          WHERE id = ?
        `, [consumoDiarioAnimal, lote.id]);
        
        console.log(`✅ Consumo calculado para Lote ${lote.id}: ${consumoTotal}kg (${consumoDiarioAnimal}kg por animal)`);
      }
      
      // Verificar se é necessário atualizar a fase do lote
      let novaFase = lote.fase_atual;
      if (idadeDias <= 30 && lote.fase_atual !== 'leitao') {
        novaFase = 'leitao';
      } else if (idadeDias > 30 && idadeDias <= 60 && lote.fase_atual !== 'jovem') {
        novaFase = 'jovem';
      } else if (idadeDias > 60 && lote.fase_atual !== 'adulto') {
        novaFase = 'adulto';
      }
      
      if (novaFase !== lote.fase_atual) {
        await db.run(`
          UPDATE lotes
          SET fase_atual = ?
          WHERE id = ?
        `, [novaFase, lote.id]);
        console.log(`📊 Fase do lote ${lote.id} atualizada para: ${novaFase}`);
      }
    }
    
    console.log('🎉 Cálculo de consumo de ração finalizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao calcular consumo de ração:', error);
  }
}

function iniciarScheduler() {
  // Executar imediatamente na inicialização
  setTimeout(calcularConsumoRacao, 5000);
  
  // Calcular consumo todos os dias às 00:05
  const INTERVALO_24_HORAS = 24 * 60 * 60 * 1000;
  setInterval(() => {
    const agora = new Date();
    if (agora.getHours() === 0 && agora.getMinutes() === 5) {
      calcularConsumoRacao();
    }
  }, 60 * 1000); // Verificar a cada minuto
  
  console.log('🕒 Scheduler de consumo de ração iniciado');
}

module.exports = iniciarScheduler; 