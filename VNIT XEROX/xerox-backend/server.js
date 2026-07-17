require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // ✅ Cloudinary added
const cloudinary = require('cloudinary').v2; // ✅ Cloudinary added
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5001;

// 🔒 CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// 🛡️ Rate Limiting for Orders
const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { message: "Too many print requests from this IP, please try again after 10 minutes." }
});

// ✅ Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 📁 Cloudinary Storage Setup
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'XeroxIt_Files',
        resource_type: 'auto' 
    }
});

// 🛡️ Strict File Filtering (Kept from your AI update)
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'pdfFile') {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only .pdf, .jpg, and .png files are allowed for documents.'));
        }
    } else if (file.fieldname === 'paymentScreenshot') {
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only .jpg, .jpeg, and .png files are allowed for screenshots.'));
        }
    } else {
        cb(new Error('Unexpected file field.'));
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB hard limit
});

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

// ✅ CREATE ORDER (Cloudinary URL extraction)
app.post('/api/orders', orderLimiter, (req, res, next) => {
    upload.fields([
        { name: 'pdfFile', maxCount: 1 }, 
        { name: 'paymentScreenshot', maxCount: 1 }
    ])(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        const settings = await ShopSettings.findOne();
        if (settings && !settings.isOpen) {
            return res.status(400).json({ message: "Shop is currently closed!" });
        }

        const { studentName, copies, isColor, totalPaid } = req.body;
        const pickupCode = Math.random().toString(36).substring(2, 6).toUpperCase();

        // ⚠️ Grab the full Cloudinary URL (.path instead of .filename)
        const pdfUrl = req.files && req.files['pdfFile'] ? req.files['pdfFile'][0].path : null;
        const paymentScreenshotUrl = req.files && req.files['paymentScreenshot'] ? req.files['paymentScreenshot'][0].path : null;

        const newOrder = new Order({
            studentName,
            copies,
            isColor,
            totalPaid,
            pdfUrl: pdfUrl,
            paymentScreenshotUrl: paymentScreenshotUrl,
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

// ⚠️ DELETE ALL (For Testing)
app.delete('/api/orders/clear', async (req, res) => {
    try {
        await Order.deleteMany({});
        res.json({ message: "All orders permanently deleted!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to clear orders" });
    }
});

// 🚀 START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});