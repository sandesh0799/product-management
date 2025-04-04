const express = require('express');
const { generateCSV, generateXLSX } = require('../controllers/reportController');
const router = express.Router();

router.get('/csv', generateCSV);
router.get('/xlsx', generateXLSX);

module.exports = router;
