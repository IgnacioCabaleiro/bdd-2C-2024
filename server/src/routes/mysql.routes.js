const express = require('express');
const router = express.Router();
const mysqlController = require('../controllers/mysql.controller');

router.post('/products', mysqlController.create);
router.get('/products', mysqlController.getAll);
router.put('/products/:id', mysqlController.update);
router.delete('/products/:id', mysqlController.delete);

module.exports = router;