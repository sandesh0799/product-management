const express = require('express');
const { generateXLSX } = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/xlsx', authMiddleware,generateXLSX);

module.exports = router;
