const client = require('../config/elasticsearch');

const elasticController = {
  async create(req, res) {
    try {
      const { name, description, price } = req.body;
      const document = {
        name,
        description,
        price,
        created_at: new Date()
      };
      
      const result = await client.index({
        index: process.env.ELASTIC_INDEX || 'products',
        body: document,
        refresh: 'wait_for' // Espera a que el documento sea indexado
      });
      
      // Forzar un refresh del índice
      await client.indices.refresh({ index: process.env.ELASTIC_INDEX || 'products' });
      
      res.json({
        id: result._id,
        ...document
      });
    } catch (error) {
      console.error('Elasticsearch create error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      // Forzar un refresh antes de buscar
      await client.indices.refresh({ index: process.env.ELASTIC_INDEX || 'products' });
      
      const result = await client.search({
        index: process.env.ELASTIC_INDEX || 'products',
        body: {
          query: {
            match_all: {}
          }
        }
      });
      
      const products = result.hits.hits.map(hit => ({
        id: hit._id,
        ...hit._source
      }));
      
      res.json(products);
    } catch (error) {
      console.error('Elasticsearch getAll error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price } = req.body;
      const document = {
        name,
        description,
        price,
        updated_at: new Date()
      };
      
      await client.update({
        index: process.env.ELASTIC_INDEX || 'products',
        id,
        body: {
          doc: document
        },
        refresh: 'wait_for' // Espera a que la actualización se complete
      });

      // Forzar un refresh del índice
      await client.indices.refresh({ index: process.env.ELASTIC_INDEX || 'products' });

      res.json({
        id,
        ...document
      });
    } catch (error) {
      console.error('Elasticsearch update error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await client.delete({
        index: process.env.ELASTIC_INDEX || 'products',
        id,
        refresh: 'wait_for'
      });

      await client.indices.refresh({ index: process.env.ELASTIC_INDEX || 'products' });

      res.json({ id, message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Elasticsearch delete error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = elasticController;