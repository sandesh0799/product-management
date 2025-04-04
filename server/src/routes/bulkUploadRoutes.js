const express = require('express');
const { bulkUpload } = require('../controllers/bulkUploadController');
const router = express.Router();

router.post('/upload', bulkUpload);

module.exports = router;