require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const crypto = require('crypto');

// 📁 Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, crypto.randomUUID() + ext); // Secure, unpredictable filenames
    }
});
const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB strict limit
});
app.use('/uploads', express.static('uploads'));
console.log(process.env.MONGO_URI);
// 🔗 MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🟢 Connected to MongoDB"))
    .catch(err => console.log(err));

// 🏪 SHOP SETTINGS
const ShopSettingsSchema = new mongoose.Schema({ isOpen: Boolean });
const ShopSettings = mongoose.model('ShopSettings', ShopSettingsSchema);

app.get('/api/shop/status', async (req, res) => {
    let settings = await ShopSettings.findOne();
    if (!settings) settings = await ShopSettings.create({ isOpen: true });
    res.json({ isOpen: settings.isOpen });
});

app.post('/api/shop/toggle', async (req, res) => {
    let settings = await ShopSettings.findOne();
    settings.isOpen = !settings.isOpen;
    await settings.save();
    res.json({ isOpen: settings.isOpen });
});

// ✅ CREATE ORDER (Now accepts TWO files)
app.post('/api/orders', upload.fields([
    { name: 'pdfFile', maxCount: 1 }, 
    { name: 'paymentScreenshot', maxCount: 1 }
]), async (req, res) => {
    try {
        const settings = await ShopSettings.findOne();
        if (settings && !settings.isOpen) {
            return res.status(400).json({ message: "Shop is currently closed!" });
        }

        const { studentName, copies, isColor, totalPaid } = req.body;
        
        // Secure, collision-free code generation
        let pickupCode;
        let isUnique = false;
        while (!isUnique) {
            pickupCode = Math.random().toString(36).substring(2, 6).toUpperCase();
            if (pickupCode.length === 4) {
                const existing = await Order.findOne({ pickupCode });
                if (!existing) isUnique = true;
            }
        }

        // Safely extract both filenames if they exist
        const pdfFilename = req.files && req.files['pdfFile'] ? req.files['pdfFile'][0].filename : null;
        const paymentFilename = req.files && req.files['paymentScreenshot'] ? req.files['paymentScreenshot'][0].filename : null;

        const newOrder = new Order({
            studentName,
            copies,
            isColor,
            totalPaid,
            pdfUrl: pdfFilename,
            paymentScreenshotUrl: paymentFilename, // Save payment image
            pickupCode
        });

        await newOrder.save();

        res.status(201).json({
            message: "Order uploaded successfully!",
            pickupCode: pickupCode 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Upload failed" });
    }
});

// 📥 GET all orders
app.get('/api/orders', async (req, res) => {
    try {
        const allOrders = await Order.find().sort({ createdAt: -1 });
        res.json(allOrders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
});

// 🔄 UPDATE order status
app.patch('/api/orders/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
});

// 🔍 SEARCH by PICKUP CODE
app.get('/api/orders/status/:code', async (req, res) => {
    try {
        const order = await Order.findOne({ pickupCode: req.params.code.toUpperCase() });
        res.json(order || null);
    } catch (error) {
        res.status(500).json({ message: "Search failed" });
    }
});

// 🚀 START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});