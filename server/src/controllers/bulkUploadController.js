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

// Bulk upload handler (CSV/XLSX)
exports.bulkUpload = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).send('File upload error: ' + err.message);
            }

            const filePath = req.file.path;
            const ext = path.extname(req.file.originalname);

            let products = [];

            if (ext === '.csv') {
                // Read and process CSV file
                fs.createReadStream(filePath)
                    .pipe(csvParser())
                    .on('data', async (row) => {
                        // Process each row and prepare product data
                        const category = await Category.findOne({ name: row.category });
                        if (category) {
                            products.push({
                                name: row.name,
                                price: parseFloat(row.price),
                                image: row.image,
                                category: category._id,
                            });
                        }
                    })
                    .on('end', async () => {
                        // Bulk insert products after processing all rows
                        await Product.insertMany(products);
                        res.status(200).send('Bulk upload completed successfully');
                        fs.unlinkSync(filePath); // Delete the uploaded file after processing
                    });
            } else if (ext === '.xlsx') {
                // Read and process XLSX file
                const workbook = xlsx.readFile(filePath);
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const data = xlsx.utils.sheet_to_json(sheet);

                for (const row of data) {
                    const category = await Category.findOne({ name: row.category });
                    if (category) {
                        products.push({
                            name: row.name,
                            price: parseFloat(row.price),
                            image: row.image,
                            category: category._id,
                        });
                    }
                }

                // Bulk insert products
                await Product.insertMany(products);
                res.status(200).send('Bulk upload completed successfully');
                fs.unlinkSync(filePath); // Delete the uploaded file after processing
            } else {
                res.status(400).send('Invalid file type. Only CSV and XLSX files are allowed.');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error during bulk upload');
    }
};
