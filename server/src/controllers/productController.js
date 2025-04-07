const Product = require('../models/Product');
const Category = require('../models/Category');

exports.createProduct = async (req, res) => {
    const { name, image, price, categoryId } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).send('Category not found');
    const product = new Product({ name, image, price, category: category._id });
    await product.save();
    res.status(201).send({ data: product, message: `Product Created Successfully !` });
};

exports.updateProduct = async (req, res) => {
    const { name, image, price, categoryId } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).send({ message: 'Category not found' });
    const product = await Product.findByIdAndUpdate(req.params.id, { name, image, price, category: category._id }, { new: true });
    res.status(200).send(product);
};

exports.deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: 'Product deleted' });
};

exports.getProducts = async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'name:asc', search = '', categoryId = '' } = req.query;
    const skip = (page - 1) * limit;

    let sortField = 'name';
    let sortOrder = 'asc';

    if (sortBy.includes(':')) {
        [sortField, sortOrder] = sortBy.split(':');
    }

    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    // Prepare the sort options object
    const sortOptions = {};
    if (sortField === 'name') {
        sortOptions.name = sortDirection;
    } else if (sortField === 'price') {
        sortOptions.price = sortDirection;
    }

    try {
        let filterConditions = { name: new RegExp(search, 'i') };

        if (categoryId) {
            filterConditions.category = categoryId;
        }

        const products = await Product.find(filterConditions)
            .populate('category', 'name')
            .skip(skip)
            .limit(Number(limit))
            .sort(sortOptions);

        // Get the total count of products matching the search term
        const totalProducts = await Product.countDocuments(filterConditions);

        // Return the response
        res.status(200).json({ products, total: totalProducts });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving product', error: error.message });
    }
};


