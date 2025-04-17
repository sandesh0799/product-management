// backend/controllers/bulkUploadController.js
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');
const csvParser = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');

// Set up file upload configuration using Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Save files to the "uploads" folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique filenames
    }
});

const upload = multer({ storage: storage }).single('file');

// Helper function to map input fields to model fields
function mapRowToProduct(row, category) {
    return {
        name: row.Product || row.name,
        price: parseFloat(row.Price || row.price),
        image: row.Image || row.image,
        category: category._id
    };
}

// Bulk upload handler (CSV/XLSX)
exports.bulkUpload = async (req, res) => {
    try {
        // Wrap the upload function in a promise to ensure proper async handling
        await new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });

        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        const filePath = req.file.path;
        const ext = path.extname(req.file.originalname);

        let products = [];

        if (ext === '.csv') {
            // For CSV files, use a promise-based approach to collect all rows first
            const csvRows = await new Promise((resolve, reject) => {
                const rows = [];

                fs.createReadStream(filePath)
                    .pipe(csvParser())
                    .on('data', (row) => {
                        rows.push(row);
                    })
                    .on('end', () => {
                        resolve(rows);
                    })
                    .on('error', (error) => {
                        reject(error);
                    });
            });

            // Now process all rows sequentially
            for (const row of csvRows) {
                // Look for category by name (both field formats)
                const categoryName = row.Category || row.category;
                if (!categoryName) continue;

                const category = await Category.findOne({ name: categoryName });
                if (category) {
                    products.push(mapRowToProduct(row, category));
                }
            }

        } else if (ext === '.xlsx') {
            // XLSX file processing
            const workbook = xlsx.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = xlsx.utils.sheet_to_json(sheet);

            for (const row of data) {
                // Look for category by name (both field formats)
                const categoryName = row.Category || row.category;
                if (!categoryName) continue;

                const category = await Category.findOne({ name: categoryName });
                if (category) {
                    products.push(mapRowToProduct(row, category));
                }
            }
        } else {
            // Clean up file if invalid type
            fs.unlinkSync(filePath);
            return res.status(400).send('Invalid file type. Only CSV and XLSX files are allowed.');
        }

        // Check if we have products to insert
        if (products.length === 0) {
            fs.unlinkSync(filePath);
            return res.status(400).send('No valid products found for import. Please check your category names match existing categories.');
        }

        // Bulk insert products
        await Product.insertMany(products);

        // Clean up file after successful processing
        fs.unlinkSync(filePath);

        return res.status(200).send(`Bulk upload completed successfully. ${products.length} products imported.`);

    } catch (error) {
        console.error('Bulk upload error:', error);

        // Clean up file if it exists
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }

        return res.status(500).send('Server error during bulk upload: ' + error.message);
    }
};