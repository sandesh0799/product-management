const Product = require('../models/Product');
const xlsx = require('xlsx');

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
        res.setHeader('Content-Disposition', 'attachment; filename=products_report.xlsx');
        res.status(200).send(buffer);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating XLSX report');
    }
};
