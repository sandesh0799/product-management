const express = require('express');
const router = express.Router();
const { createProduct, updateProduct, deleteProduct, getProducts } = require('../controllers/productController');

router.post('/add', createProduct);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);
router.get('/', getProducts);

module.exports = router;
