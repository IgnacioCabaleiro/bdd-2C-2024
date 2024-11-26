const express = require('express');
const router = express.Router();
const elasticController = require('../controllers/elastic.controller');

router.post('/products', elasticController.create);
router.get('/products', elasticController.getAll);
router.put('/products/:id', elasticController.update);
router.delete('/products/:id', elasticController.delete);

module.exports = router;