const pool = require('../config/database');

const mysqlController = {
  async create(req, res) {
    try {
      const { name, description, price } = req.body;
      const [result] = await pool.execute(
        'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
        [name, description, price]
      );
      
      const [newProduct] = await pool.execute(
        'SELECT * FROM products WHERE id = ?', 
        [result.insertId]
      );
      
      res.json(newProduct[0]);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const [rows] = await pool.execute('SELECT * FROM products');
      res.json(rows);
    } catch (error) {
      console.error('Error getting products:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price } = req.body;
      
      await pool.execute(
        'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?',
        [name, description, price, id]
      );
      
      const [updatedProduct] = await pool.execute(
        'SELECT * FROM products WHERE id = ?', 
        [id]
      );
      
      if (updatedProduct.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(updatedProduct[0]);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const [result] = await pool.execute(
        'DELETE FROM products WHERE id = ?', 
        [id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json({ id, message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = mysqlController;