const db = require('../database');

const pavilhoesController = {
  async listar(req, res) {
    try {
      const pavilhoes = await db.all(`
        SELECT 
          p.*,
          l.data_entrada,
          l.quantidade_inicial,
          l.peso_medio_inicial,
          l.data_saida_prevista,
          l.status as lote_status
        FROM pavilhoes p
        LEFT JOIN lotes l ON p.lote_atual_id = l.id
        ORDER BY p.numero
      `);
      res.json(pavilhoes);
    } catch (error) {
      console.error('Erro ao listar pavilhões:', error);
      res.status(500).json({ error: 'Erro ao listar pavilhões' });
    }
  },

  async atualizarStatus(req, res) {
    const { numero } = req.params;
    const { status, observacao } = req.body;
    
    try {
      await db.run(
        'UPDATE pavilhoes SET status = ?, observacao = ? WHERE numero = ?',
        [status, observacao, numero]
      );
      res.json({ message: 'Status atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      res.status(500).json({ error: 'Erro ao atualizar status do pavilhão' });
    }
  },

  async finalizarLote(req, res) {
    const { numero } = req.params;
    
    try {
      const pavilhao = await db.get('SELECT lote_atual_id FROM pavilhoes WHERE numero = ?', [numero]);
      
      if (!pavilhao.lote_atual_id) {
        return res.status(400).json({ error: 'Pavilhão não possui lote ativo' });
      }

      await db.run('BEGIN TRANSACTION');
      
      // Atualiza o status do lote para finalizado
      await db.run(
        'UPDATE lotes SET status = ? WHERE id = ?',
        ['finalizado', pavilhao.lote_atual_id]
      );

      // Limpa o lote atual do pavilhão e marca como disponível
      await db.run(
        'UPDATE pavilhoes SET lote_atual_id = NULL, status = ? WHERE numero = ?',
        ['disponivel', numero]
      );

      await db.run('COMMIT');
      res.json({ message: 'Lote finalizado com sucesso' });
    } catch (error) {
      await db.run('ROLLBACK');
      console.error('Erro ao finalizar lote:', error);
      res.status(500).json({ error: 'Erro ao finalizar lote' });
    }
  }
};

module.exports = pavilhoesController; 