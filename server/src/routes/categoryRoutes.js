const express = require('express');
const router = express.Router();
const { createCategory, updateCategory, deleteCategory, getCategories } = require('../controllers/categoryController');

router.post('/add', createCategory);
router.put('/update/:id', updateCategory);
router.delete('/delete/:id', deleteCategory);
router.get('/', getCategories);

module.exports = router;
