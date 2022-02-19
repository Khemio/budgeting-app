import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    category:{
        type: String,
        trim: true,
        required: [true, 'Please add category']
    },
    name:{
        type: String,
        trim: true,
        required: [true, 'Please add name']
    },
    amount: {
        type: Number,
        required: [true, 'Please add amount']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Expense =  mongoose.model('Expense', ExpenseSchema);