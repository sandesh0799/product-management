const Product = require('../models/Product');
const Category = require('../models/Category');

exports.createProduct = async (req, res) => {
    const { name, image, price, categoryID } = req.body;
    const category = await Category.findById(categoryID);
    if (!category) return res.status(400).send('Category not found');
    const product = new Product({ name, image, price, category: category._id });
    await product.save();
    res.status(201).send('Product created');
};

exports.updateProduct = async (req, res) => {
    const { name, image, price, categoryID } = req.body;
    const category = await Category.findById(categoryID);
    if (!category) return res.status(400).send('Category not found');
    const product = await Product.findByIdAndUpdate(req.params.id, { name, image, price, category: category._id }, { new: true });
    res.status(200).send(product);
};

exports.deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).send('Product deleted');
};

exports.getProducts = async (req, res) => {
    const { page = 1, limit = 10, sortByPrice = 'asc', search = '' } = req.query;
    const skip = (page - 1) * limit;

    const sortOptions = { price: sortByPrice === 'asc' ? 1 : -1 };

    const products = await Product.find({ name: new RegExp(search, 'i') })
        .populate('category', 'name')
        .skip(skip)
        .limit(Number(limit))
        .sort(sortOptions);

    const totalProducts = await Product.countDocuments({ name: new RegExp(search, 'i') });
    res.status(200).json({ products, total: totalProducts });
};
