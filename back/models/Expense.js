const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);