// backend/controllers/reportController.js
const Product = require('../models/Product');
const xlsx = require('xlsx');
// Generate CSV Report
exports.generateCSV = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name');

        // Convert products to CSV format
        const csvData = [
            ['Product', 'Price', 'Category', 'Image']
        ];

        products.forEach(product => {
            csvData.push([product.name, product.price, product.category.name, product.image]);
        });

        const csvString = csvData.map(row => row.join(',')).join('\n');

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=products_report.csv');
        res.status(200).send(csvString);

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
            'Product': product.name,
            'Price': product.price,
            'Category': product.category.name,
            'Image': product.image
        }));

        // Create workbook and worksheet
        const ws = xlsx.utils.json_to_sheet(xlsxData);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Products');

        // Write to buffer instead of file
        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        // Set headers and send buffer directly
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.status(200).send(buffer);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating XLSX report');
    }
};