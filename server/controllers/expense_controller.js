import { Expense } from "../models/Expense.js";

//@desc Get all expenses
//@route GET /api/v1/expenses
//@access Public
export async function getExpenses(req, res, next) {
    try {
        const hasQuery = Object.keys(req.query).length !== 0;

        if (hasQuery) {
            const category = req.query.category;
            const expenses = await Expense.find({category: category}).exec();

            res.status(200).send(expenses);
        } else {
            const expenses = await Expense.find();
            res.status(200).send(expenses);

        }

        // response(expenses)
        // return res.status(200).json({
        //     success: true,
        //     count: expenses.length,
        //     data: expenses
        // })
    } catch (err) {
        return res.status(500).json({
            sucess: false,
            error: 'Server Error'
        })
    }
}

export async function searchExpenses(req, res, next) {
    try {
        const category = req.query.category;
        const expenses = await Expense.findAll({category: category}).exec();

        // console.log('expenses')

        res.status(200).json(expenses);

        // response(expenses)
        // return res.status(200).json({
        //     success: true,
        //     count: expenses.length,
        //     data: expenses
        // })
    } catch (err) {
        return res.status(500).json({
            sucess: false,
            error: 'Server Error'
        })
    }
}

//@desc Add expense
//@route POST /api/v1/expenses
//@access Public
export async function addExpense(req, res, next) {
    try {
        const {text, amount} = req.body;

        const expense = await Expense.create(req.body);

        res.status(201).send(expense)
        // res.send(expense)
        // return res.status(201).json({
        //     sucess: true,
        //     data: expense
    // })
    } catch (err) {
        if(err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                error: messages
            })
        } else {
            return res.status(500).json({
                sucess: false,
                error: 'Server Error'
            })
        }
    }
    
}

//@desc Update expense
//@route PUT /api/v1/expenses
//@access Public
export async function updateExpense(req, res, next) {
    try {
        const id = req.params.id;
        const data = req.body;

        const expense = await Expense.findByIdAndUpdate(id, data)

        res.status(201).send({expense});

    } catch (err) {
        if(err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);

            return res.status(400).json({
                success: false,
                error: messages
            })
        } else {
            return res.status(500).json({
                sucess: false,
                error: 'Server Error'
            })
        }
    }
    
}

//@desc Delete expense
//@route DELETE /api/v1/expenses/:id
//@access Public
export async function deleteExpense(req, res, next) {
    try {
        const expense = await Expense.findById(req.params.id);

        if(!expense) {
            return res.status(404).json({
                success: false,
                error: 'No expense found'
            });
        }

        await expense.remove();

        res.status(200).send({})
        // return res.status(200).json({
        //     success: true,
        //     data: {}
        // })
    } catch (err) {
        return res.status(500).json({
            sucess: false,
            error: 'Server Error'
        })
    }
}