const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./src/config/db');
const app = express();
dotenv.config();

const productRoutes = require('./src/routes/productRoutes');
const userRoutes = require('./src/routes/userRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const bulkUploadRoutes = require('./src/routes/bulkUploadRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

// Routes
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/bulk-upload', bulkUploadRoutes);
app.use('/reports', reportRoutes);
app.listen(PORT, () => {
    console.log(`App Running On ${PORT}`)
})