const express = require('express');
const router = express.Router();
const { createProduct, updateProduct, deleteProduct, getProducts, getProduct } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, createProduct);
router.put('/update/:id', authMiddleware, updateProduct);
router.delete('/delete/:id', authMiddleware, deleteProduct);
router.get('/:id', authMiddleware, getProduct);
router.get('/', getProducts);

module.exports = router;
