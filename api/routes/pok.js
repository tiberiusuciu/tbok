const express = require('express');
const { body } = require('express-validator');

const pokController = require('../controllers/pok');

const router = express.Router();

router.get('/', pokController.getPoks);

router.get('/:pokId', pokController.getPok);

router.put('/:pokId', pokController.putPok);

router.put('/:pokId/add-child/:childPokId', pokController.addChildPok);

router.put('/:pokId/add-parent/:parentPokId', pokController.addParentPok);

router.post('/', pokController.createPok);

router.delete('/:pokId', pokController.deletePok);

module.exports = router;