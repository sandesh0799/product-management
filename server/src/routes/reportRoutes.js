const express = require('express');
const { generateCSV, generateXLSX } = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/csv',authMiddleware, generateCSV);
router.get('/xlsx', authMiddleware,generateXLSX);

module.exports = router;
