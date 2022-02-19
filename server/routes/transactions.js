import express from 'express';
import { getExpenses, addExpense, deleteExpense, updateExpense,searchExpenses } from '../controllers/expense_controller.js';
import { getBudgets, addBudget, deleteBudget, updateBudget } from '../controllers/budget_controller.js';

const router = express.Router();

router.route('/expenses')
    .get(getExpenses)
    .post(addExpense);

router.route('/expenses/:id')
    .delete(deleteExpense)
    .put(updateExpense);

router.route('/budgets')
    .get(getBudgets)
    .post(addBudget);

router.route('/budgets/:id')
    .delete(deleteBudget)
    .put(updateBudget);
    
export {router};