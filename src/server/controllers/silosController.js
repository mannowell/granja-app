const db = require('../database');

const silosController = {
  async listar(req, res) {
    try {
      const silos = await db.all('SELECT * FROM silos');
      res.json(silos);
    } catch (error) {
      console.error('Erro ao listar silos:', error);
      res.status(500).json({ error: 'Erro ao listar silos' });
    }
  },

  async criar(req, res) {
    try {
      const { capacidade_total, nivel_atual, tipo_racao } = req.body;
      const result = await db.run(
        'INSERT INTO silos (capacidade_total, nivel_atual, tipo_racao, ultima_recarga) VALUES (?, ?, ?, DATE("now"))',
        [capacidade_total, nivel_atual, tipo_racao]
      );
      res.status(201).json({ id: result.lastID });
    } catch (error) {
      console.error('Erro ao criar silo:', error);
      res.status(500).json({ error: 'Erro ao criar silo' });
    }
  },

  async registrarRecarga(req, res) {
    try {
      const { id } = req.params;
      const { quantidade } = req.body;
      
      const silo = await db.get('SELECT nivel_atual, capacidade_total FROM silos WHERE id = ?', [id]);
      if (!silo) {
        return res.status(404).json({ error: 'Silo não encontrado' });
      }

      const novoNivel = silo.nivel_atual + quantidade;
      if (novoNivel > silo.capacidade_total) {
        return res.status(400).json({ error: 'Quantidade excede a capacidade do silo' });
      }

      await db.run(
        'UPDATE silos SET nivel_atual = ?, ultima_recarga = DATE("now") WHERE id = ?',
        [novoNivel, id]
      );

      res.json({ message: 'Recarga registrada com sucesso' });
    } catch (error) {
      console.error('Erro ao registrar recarga:', error);
      res.status(500).json({ error: 'Erro ao registrar recarga' });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { capacidade_total, tipo_racao, fase_nome } = req.body;
      
      await db.run(
        'UPDATE silos SET capacidade_total = ?, tipo_racao = ?, fase_nome = ? WHERE id = ?',
        [capacidade_total, tipo_racao, fase_nome, id]
      );
      
      res.json({ message: 'Silo atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar silo:', error);
      res.status(500).json({ error: 'Erro ao atualizar silo' });
    }
  },

  async excluir(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar se existem recargas associadas
      const recargas = await db.get(
        'SELECT COUNT(*) as count FROM historico_recargas WHERE silo_id = ?',
        [id]
      );
      
      if (recargas.count > 0) {
        return res.status(400).json({ 
          error: 'Não é possível excluir o silo pois existem recargas associadas' 
        });
      }

      await db.run('DELETE FROM silos WHERE id = ?', [id]);
      res.json({ message: 'Silo excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir silo:', error);
      res.status(500).json({ error: 'Erro ao excluir silo' });
    }
  }
};

module.exports = silosController; 