const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    class: { type: String, required: true },
    rollNumber: { type: Number, required: true, unique: true },
    feeAmount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
