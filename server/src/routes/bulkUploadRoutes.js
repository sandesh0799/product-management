const express = require('express');
const { bulkUpload } = require('../controllers/bulkUploadController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/upload',authMiddleware, bulkUpload);

module.exports = router;