const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const mysqlRoutes = require('./routes/mysql.routes');
const elasticRoutes = require('./routes/elastic.routes');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.use('/api/mysql', mysqlRoutes);
app.use('/api/elastic', elasticRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;