const express = require('express');
const router = express.Router();
const { createCategory, updateCategory, deleteCategory, getCategories } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add',authMiddleware, createCategory);
router.put('/update/:id',authMiddleware,updateCategory);
router.delete('/delete/:id',authMiddleware, deleteCategory);
router.get('/', authMiddleware,getCategories);

module.exports = router;
