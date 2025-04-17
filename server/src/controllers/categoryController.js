const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).send('Category already exists');
        }

        const category = new Category({ name });
        await category.save();

        res.status(201).send('Category created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Update Category
exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).send('Category not found');
        }
        category.name = name;
        await category.save();

        res.status(200).send('Category updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).send('Category not found');
        }

        res.status(200).send('Category deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
