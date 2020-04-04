const express = require('express');
const { body } = require('express-validator');

const pokController = require('../controllers/pok');

const router = express.Router();

router.post('/', pokController.createPok);

router.get('/:pokId', pokController.getPok);

module.exports = router;