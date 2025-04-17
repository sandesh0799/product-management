const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');
const xlsx = require('xlsx');
const fs = require('fs');

// Multer config (accept only .xlsx files)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === '.xlsx') {
        cb(null, true);
    } else {
        cb(new Error('Only .xlsx files are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter }).single('file');

// Helper function
function mapRowToProduct(row, category) {
    return {
        name: row.Product || row.name,
        price: parseFloat(row.Price || row.price),
        image: row.Image || row.image,
        category: category._id
    };
}

async function isDuplicateProduct(name, categoryId) {
    return await Product.exists({ name, category: categoryId });
}

// Only XLSX bulk upload handler
exports.bulkUpload = async (req, res) => {
    try {
        await new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded or file type not allowed (only .xlsx).' });
        }

        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = xlsx.utils.sheet_to_json(sheet);
        const products = [];

        for (const row of rows) {
            const categoryName = row.Category || row.category;
            if (!categoryName) continue;

            const category = await Category.findOne({ name: categoryName });
            if (category) {
                const name = row.Product || row.name;
                const isDuplicate = await isDuplicateProduct(name, category._id);
                if (!isDuplicate) {
                    products.push(mapRowToProduct(row, category));
                }
            }
        }

        if (products.length === 0) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ message: 'No valid products found for import. Check for duplicates or invalid categories.' });
        }

        await Product.insertMany(products);
        fs.unlinkSync(filePath);

        return res.status(200).json({ message: `Bulk upload completed successfully. ${products.length} products imported.` });

    } catch (error) {
        console.error('Bulk upload error:', error);

        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }

        return res.status(500).json({ message: 'Server error during bulk upload: ' + error.message });
    }
};
