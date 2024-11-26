const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'products_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

console.log('Attempting to connect to MySQL with config:', {
  ...dbConfig,
  password: '****'
});

const pool = mysql.createPool(dbConfig);

module.exports = pool;