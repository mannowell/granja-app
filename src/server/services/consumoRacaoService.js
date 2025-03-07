const db = require('../database');

const consumoRacaoService = {
  async calcularConsumo() {
    try {
      // Buscar lotes ativos e seus respectivos pavilhões
      const lotes = await db.all(`
        SELECT 
          id,
          pavilhao,
          quantidade_inicial,
          data_entrada,
          data_saida_prevista
        FROM lotes 
        WHERE status = 'ativo'
      `);

      const hoje = new Date().toISOString().split('T')[0];

      for (const lote of lotes) {
        // Buscar o silo correspondente ao pavilhão
        const silo = await db.get(
          'SELECT id, nivel_atual FROM silos WHERE numero = ?',
          [lote.pavilhao]
        );

        if (silo) {
          // Calcular consumo diário (1kg por animal)
          const consumoDiario = lote.quantidade_inicial;
          
          // Verificar se já foi registrado consumo hoje
          const consumoHoje = await db.get(
            'SELECT id FROM consumo_racao WHERE silo_id = ? AND data_consumo = ?',
            [silo.id, hoje]
          );

          if (!consumoHoje) {
            // Registrar o consumo
            await db.run(
              `INSERT INTO consumo_racao (
                silo_id, 
                lote_id,
                data_consumo, 
                quantidade_consumida
              ) VALUES (?, ?, ?, ?)`,
              [silo.id, lote.id, hoje, consumoDiario]
            );

            // Atualizar nível do silo
            const novoNivel = silo.nivel_atual - consumoDiario;
            await db.run(
              'UPDATE silos SET nivel_atual = ? WHERE id = ?',
              [Math.max(0, novoNivel), silo.id]
            );

            // Se o nível estiver baixo, enviar alerta
            if (novoNivel <= 0) {
              console.log(`ALERTA: Silo ${silo.id} precisa de recarga!`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao calcular consumo:', error);
    }
  }
};

module.exports = consumoRacaoService; 