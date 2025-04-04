// backend/controllers/reportController.js
const Product = require('../models/Product');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Generate CSV Report
exports.generateCSV = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name');

        // Convert products to CSV format
        const csvData = [
            ['Product Name', 'Price', 'Category', 'Image']
        ];

        products.forEach(product => {
            csvData.push([product.name, product.price, product.category.name, product.image]);
        });

        const csvFilePath = path.join(__dirname, '../../reports/products_report.csv');
        const csvString = csvData.map(row => row.join(',')).join('\n');

        // Write CSV to file
        fs.writeFileSync(csvFilePath, csvString);

        // Send CSV file as response
        res.download(csvFilePath, 'products_report.csv', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Error downloading the file');
            }

            // Clean up the file after download
            fs.unlinkSync(csvFilePath);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating CSV report');
    }
};

// Generate XLSX Report
exports.generateXLSX = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name');

        // Convert products to JSON format for XLSX
        const xlsxData = products.map(product => ({
            'Product Name': product.name,
            'Price': product.price,
            'Category': product.category.name,
            'Image': product.image
        }));

        const ws = xlsx.utils.json_to_sheet(xlsxData);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Products');

        const xlsxFilePath = path.join(__dirname, '../../reports/products_report.xlsx');
        xlsx.writeFile(wb, xlsxFilePath);

        // Send XLSX file as response
        res.download(xlsxFilePath, 'products_report.xlsx', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Error downloading the file');
            }

            // Clean up the file after download
            fs.unlinkSync(xlsxFilePath);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating XLSX report');
    }
};
