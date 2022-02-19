import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
    category:{
        type: String,
        trim: true,
        required: [true, 'Please add category']
    },
    budgetUsed: {
        type: Number,
        required: [true, 'Please add amount']
    },
    budgetLimit: {
        type: Number,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Budget =  mongoose.model('Budget', BudgetSchema);