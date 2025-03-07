const db = require('../database');

class LotesController {
  async listarTodos() {
    try {
      return await db.all(`
        SELECT * FROM lotes
        ORDER BY data_entrada DESC
      `);
    } catch (error) {
      console.error('Erro ao listar lotes:', error);
      throw error;
    }
  }

  async criar(dados) {
    const {
      data_entrada,
      quantidade_inicial,
      peso_medio_inicial,
      data_saida_prevista,
      pavilhao_id
    } = dados;

    try {
      await db.run('BEGIN TRANSACTION');

      // Validações
      const pavilhao = await db.get('SELECT * FROM pavilhoes WHERE numero = ?', [pavilhao_id]);
      if (!pavilhao) {
        throw new Error('Pavilhão não encontrado');
      }
      if (pavilhao.status !== 'disponivel') {
        throw new Error('Pavilhão não está disponível');
      }

      // Criar lote
      const result = await db.run(`
        INSERT INTO lotes (
          data_entrada,
          quantidade_inicial,
          peso_medio_inicial,
          data_saida_prevista,
          status,
          pavilhao_id
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        data_entrada,
        quantidade_inicial,
        peso_medio_inicial,
        data_saida_prevista,
        'ativo',
        pavilhao_id
      ]);

      // Atualizar pavilhão
      await db.run(`
        UPDATE pavilhoes 
        SET status = 'ocupado', 
            lote_atual_id = ? 
        WHERE numero = ?
      `, [result.lastID, pavilhao_id]);

      await db.run('COMMIT');

      // Retornar o lote criado
      return await db.get('SELECT * FROM lotes WHERE id = ?', [result.lastID]);
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  }

  async buscarPorId(id) {
    try {
      const lote = await db.get(`
        SELECT l.*, p.numero as pavilhao_numero 
        FROM lotes l
        LEFT JOIN pavilhoes p ON l.pavilhao_id = p.numero
        WHERE l.id = ?
      `, [id]);

      if (!lote) {
        throw new Error('Lote não encontrado');
      }

      return lote;
    } catch (error) {
      console.error('Erro ao buscar lote:', error);
      throw error;
    }
  }

  async atualizar(id, dados) {
    const {
      data_entrada,
      quantidade_inicial,
      peso_medio_inicial,
      data_saida_prevista,
      pavilhao_id
    } = dados;

    try {
      await db.run('BEGIN TRANSACTION');

      await db.run(`
        UPDATE lotes 
        SET data_entrada = ?,
            quantidade_inicial = ?,
            peso_medio_inicial = ?,
            data_saida_prevista = ?,
            pavilhao_id = ?
        WHERE id = ?
      `, [
        data_entrada,
        quantidade_inicial,
        peso_medio_inicial,
        data_saida_prevista,
        pavilhao_id,
        id
      ]);

      await db.run('COMMIT');
      return await this.buscarPorId(id);
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  }

  async excluir(req, res) {
    const { id } = req.params;
    console.log('Tentando excluir lote:', id);
    try {
      // Primeiro verifica se existem registros relacionados
      const registrosSanitarios = await db.get(
        'SELECT COUNT(*) as count FROM registros_sanitarios WHERE lote_id = ?',
        [id]
      );
      
      if (registrosSanitarios.count > 0) {
        return res.status(400).json({ 
          error: 'Não é possível excluir o lote pois existem registros sanitários associados' 
        });
      }

      await db.run('DELETE FROM lotes WHERE id = ?', [id]);
      res.json({ message: 'Lote excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir lote:', error);
      res.status(500).json({ error: 'Erro ao excluir lote' });
    }
  }
}

module.exports = new LotesController(); 