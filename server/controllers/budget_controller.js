import { Budget } from "../models/Budget.js";

//@desc Get all transactions
//@route GET /api/v1/transactions
//@access Public
export async function getBudgets(req, res, next) {
    try {
        const hasQuery = Object.keys(req.query).length !== 0;

        if (hasQuery) {
            const category = req.query.category;
            const budgets = await Budget.find({category: category}).exec();

            res.status(200).send(budgets);
        } else {
            const budgets = await Budget.find();
            res.status(200).send(budgets);

        }

        // return res.status(200).json({
        //     success: true,
        //     count: budgets.length,
        //     data: budgets
        // })
    } catch (err) {
        return res.status(500).json({
            sucess: false,
            error: 'Server Error'
        })
    }
}

//@desc Add transaction
//@route POST /api/v1/transactions
//@access Public
export async function addBudget(req, res, next) {
    try {
        const {text, amount} = req.body;

        const budget = await Budget.create(req.body);

        res.status(201).send(budget);
    //     return res.status(201).json({
    //         sucess: true,
    //         data: budget
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

export async function updateBudget(req, res, next) {
    try {
        const id = req.params.id;
        const data = req.body;

        const budget = await Budget.findByIdAndUpdate(id, data, {upsert: true})

        res.status(201).send({budget});

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

//@desc Delete transaction
//@route DELETE /api/v1/transactions/:id
//@access Public
export async function deleteBudget(req, res, next) {
    try {
        const budget = await Budget.findById(req.params.id);

        if(!budget) {
            return res.status(404).json({
                success: false,
                error: 'No budget found'
            });
        }

        await budget.remove();
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