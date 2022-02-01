import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, mergeMap } from 'rxjs';

import { Budget } from '../budget';
import { Expense } from '../expense';
import { BudgetsService } from './budgets.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  budgets: Budget[] = [];
  expenses: Expense[] = [];

  private budgetsUrl = 'http://localhost:5000/budgets'
  private expensesUrl = 'http://localhost:5000/expenses'

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  constructor(private budgetsService: BudgetsService, private http: HttpClient) { }

  addedExpense(expense: Expense): any {
    let updatedBudget: Budget | undefined;

    return this.http.get<Budget[]>(this.budgetsUrl).pipe(
      mergeMap((budgets: Budget[]) => {
        updatedBudget = budgets.find(budget => budget.category === expense.category) ?
        budgets.find(budget => budget.category === expense.category) : budgets.find(budget => budget.category === "uncategorized");

        updatedBudget!.budgetUsed += expense.amount;

        console.log(updatedBudget);

        return this.http.put(`${this.budgetsUrl}/${updatedBudget?.id}`, updatedBudget, this.httpOptions);
      }),
      tap(_ => console.log(`Updated Budget id=${updatedBudget!.category}`)),
      catchError(this.handleError<Budget[]>('updateBudget', [])))
      .subscribe();
  }

  deletedExpense(expense: Expense): any {
    let updatedBudget: Budget | undefined;

    return this.http.get<Budget[]>(this.budgetsUrl).pipe(
      mergeMap((budgets: Budget[]) => {
        updatedBudget = budgets.find(budget => budget.category === expense.category) ?
        budgets.find(budget => budget.category === expense.category) : budgets.find(budget => budget.category === "uncategorized");

        updatedBudget!.budgetUsed -= updatedBudget!.budgetUsed > expense.amount ? expense.amount : 0;

        console.log(updatedBudget);

        return this.http.put(`${this.budgetsUrl}/${updatedBudget?.id}`, updatedBudget, this.httpOptions);
      }),
      tap(_ => console.log(`Updated Budget id=${updatedBudget!.category}`)),
      catchError(this.handleError<Budget[]>('updateBudget', [])))
      .subscribe();
  }

    

    handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
        //TODO: Send error to remote logging infrastructure
        console.error(error); 
  
        //TODO: Better job of transforming error fo user consumption
        console.log(`${operation} failed: ${error.message}`)
  
        return of(result as T)
      }
    }

}
