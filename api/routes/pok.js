const express = require('express');
const { body } = require('express-validator');

const pokController = require('../controllers/pok');

const router = express.Router();

router.get('/', pokController.getPoks);

router.get('/:pokId', pokController.getPok);

router.post('/', pokController.createPok);

router.delete('/:pokId', pokController.deletePok);

module.exports = router;