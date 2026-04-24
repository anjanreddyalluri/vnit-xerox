const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    copies: { type: Number, required: true },
    isColor: { type: Boolean, default: false },
    totalPaid: { type: Number, required: true },
    pdfUrl: { type: String }, 
    paymentScreenshotUrl: { type: String }, // ✅ NEW: Store the payment image
    pickupCode: { type: String, required: true, unique: true }, 
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);