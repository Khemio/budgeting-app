export interface Budget {
    _id?: string,
    category: string,
    budgetUsed: number,
    budgetLimit?: number,
    createdAt?: Date
}