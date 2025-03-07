const db = require('../database');

const sanitarioController = {
  async listar(req, res) {
    console.log('Tentando listar registros sanitários...');
    try {
      const registros = await db.all(`
        SELECT 
          rs.*,
          l.data_entrada as lote_data_entrada,
          l.quantidade_inicial as lote_quantidade
        FROM registros_sanitarios rs
        LEFT JOIN lotes l ON rs.lote_id = l.id
        ORDER BY rs.data_registro DESC
      `);
      console.log('Registros encontrados:', registros);
      res.json(registros);
    } catch (error) {
      console.error('Erro detalhado ao listar registros:', error);
      res.status(500).json({ error: 'Erro ao listar registros sanitários' });
    }
  },

  async criar(req, res) {
    console.log('Tentando criar registro sanitário:', req.body);
    try {
      const { 
        lote_id, 
        tipo, 
        descricao, 
        medicamento, 
        dosagem 
      } = req.body;
      
      // Garantir que a data_registro seja a data atual se não for fornecida
      const data_registro = req.body.data_registro || new Date().toISOString().split('T')[0];
      // Garantir que a data_prevista seja a data atual se não for fornecida
      const data_prevista = req.body.data_prevista || data_registro;
      // Definir status inicial como 'pendente' se não for fornecido
      const status = req.body.status || 'pendente';

      // Verificar se o lote existe
      const lote = await db.get('SELECT id FROM lotes WHERE id = ?', [lote_id]);
      if (!lote) {
        return res.status(404).json({ error: 'Lote não encontrado' });
      }

      const result = await db.run(
        `INSERT INTO registros_sanitarios (
          lote_id, 
          tipo, 
          descricao, 
          data_registro, 
          data_prevista,
          medicamento, 
          dosagem, 
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          lote_id,
          tipo,
          descricao,
          data_registro,
          data_prevista,
          medicamento,
          dosagem,
          status
        ]
      );
      console.log('Registro criado com ID:', result.lastID);
      res.status(201).json({ id: result.lastID });
    } catch (error) {
      console.error('Erro detalhado ao criar registro:', error);
      res.status(500).json({ error: 'Erro ao criar registro sanitário' });
    }
  },

  async atualizar(req, res) {
    const { id } = req.params;
    console.log('Tentando atualizar registro:', id, req.body);
    try {
      const { tipo, descricao, medicamento, dosagem, status, data_prevista } = req.body;
      await db.run(
        `UPDATE registros_sanitarios 
         SET tipo = ?, 
             descricao = ?, 
             medicamento = ?, 
             dosagem = ?, 
             status = ?,
             data_prevista = ?
         WHERE id = ?`,
        [tipo, descricao, medicamento, dosagem, status, data_prevista, id]
      );
      res.json({ message: 'Registro atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
      res.status(500).json({ error: 'Erro ao atualizar registro' });
    }
  },

  async concluir(req, res) {
    const { id } = req.params;
    console.log('Tentando concluir registro:', id);
    try {
      await db.run(
        'UPDATE registros_sanitarios SET status = ? WHERE id = ?',
        ['concluido', id]
      );
      res.json({ message: 'Registro concluído com sucesso' });
    } catch (error) {
      console.error('Erro ao concluir registro:', error);
      res.status(500).json({ error: 'Erro ao concluir registro' });
    }
  },

  async excluir(req, res) {
    const { id } = req.params;
    console.log('Tentando excluir registro sanitário:', id);
    try {
      // Primeiro verifica se o registro existe
      const registro = await db.get('SELECT * FROM registros_sanitarios WHERE id = ?', [id]);
      if (!registro) {
        return res.status(404).json({ error: 'Registro sanitário não encontrado' });
      }

      await db.run('DELETE FROM registros_sanitarios WHERE id = ?', [id]);
      res.json({ message: 'Registro sanitário excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir registro sanitário:', error);
      res.status(500).json({ error: 'Erro ao excluir registro sanitário' });
    }
  },

  async reverter(req, res) {
    const { id } = req.params;
    console.log('Tentando reverter registro:', id);
    try {
      await db.run(
        'UPDATE registros_sanitarios SET status = ? WHERE id = ?',
        ['pendente', id]
      );
      res.json({ message: 'Registro revertido para pendente com sucesso' });
    } catch (error) {
      console.error('Erro ao reverter registro:', error);
      res.status(500).json({ error: 'Erro ao reverter registro' });
    }
  }
};

module.exports = sanitarioController; 