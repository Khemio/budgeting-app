import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, mergeMap } from 'rxjs';
import { LowerCasePipe } from '@angular/common';

import { Budget } from '../budget';
import { Expense } from '../expense';
import { BudgetsService } from './budgets.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  budgets: Budget[] = [];
  expenses: Expense[] = [];

  private budgetsUrl = 'https://app-budgets.herokuapp.com/api/v1/budgets'
  private expensesUrl = 'https://app-budgets.herokuapp.com/api/v1/expenses'

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  constructor(
    private budgetsService: BudgetsService,
    private http: HttpClient,
    private lowercase: LowerCasePipe) { }

  addedExpense(expense: Expense): any {
    let updatedBudget: Budget | undefined = {
      category: 'uncategorized',
      budgetUsed: 0,
      budgetLimit: 0
    };

    return this.http.get<Budget[]>(this.budgetsUrl).pipe(
      mergeMap((budgets: Budget[]) => {

        if(budgets.some(budget => this.lowercase.transform(budget.category) === this.lowercase.transform(expense.category))) {
          updatedBudget = budgets.find(budget => this.lowercase.transform(budget.category) === this.lowercase.transform(expense.category))

        } else if(budgets.some(budget => this.lowercase.transform(budget.category) === "uncategorized")) {
          updatedBudget = budgets.find(budget => this.lowercase.transform(budget.category) === "uncategorized");
          
        } else {
          this.http.post<Budget>(this.budgetsUrl, updatedBudget, this.httpOptions).subscribe(budget =>{
            console.log(budget);
            budget.budgetUsed += expense.amount;
            return this.http.put(`${this.budgetsUrl}/${budget._id}`, budget, this.httpOptions);
          })
        }
        

        updatedBudget!.budgetUsed += expense.amount;



        return this.http.put(`${this.budgetsUrl}/${updatedBudget?._id}`, updatedBudget, this.httpOptions);
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


        return this.http.put(`${this.budgetsUrl}/${updatedBudget?._id}`, updatedBudget, this.httpOptions);
      }),
      tap(_ => console.log(`Updated Budget id=${updatedBudget!.category}`)),
      catchError(this.handleError<Budget[]>('updateBudget', [])))
      .subscribe();
  }

  addedBudget(budget: Budget, uncategorizedBudget: Budget): any {
    let movedExpenses: Expense[] | undefined;
    // let uncategorizedBudget: Budget; 

    return this.http.get<Expense[]>(this.expensesUrl).pipe(
      mergeMap((expenses: Expense[]) => {
        movedExpenses = expenses.filter(expense => expense.category === budget.category);

        movedExpenses.forEach(expense => {
          budget.budgetUsed += expense.amount;
          uncategorizedBudget.budgetUsed -= expense.amount;
          })

        console.log(movedExpenses);
        
        this.http.put(`${this.budgetsUrl}/${uncategorizedBudget?._id}`, uncategorizedBudget, this.httpOptions).subscribe();
        return this.http.put(`${this.budgetsUrl}/${budget?._id}`, budget, this.httpOptions);
      }),
      tap(_ => console.log(`Updated Budget id=${budget!.category}`)),
      catchError(this.handleError<Budget[]>('updateBudget', [])))
      .subscribe();
  }


  deletedBudget(budget: Budget, uncategorizedBudget: Budget): any {
    let movedExpenses: Expense[] | undefined;
    // let uncategorizedBudget: Budget; 

    return this.http.get<Expense[]>(this.expensesUrl).pipe(
      mergeMap((expenses: Expense[]) => {
        movedExpenses = expenses.filter(expense => expense.category === budget.category);

        movedExpenses.forEach(expense => {
          // budget.budgetUsed += expense.amount;
          uncategorizedBudget.budgetUsed += expense.amount;
          })

        // console.log(movedExpenses);
        
        return this.http.put(`${this.budgetsUrl}/${uncategorizedBudget?._id}`, uncategorizedBudget, this.httpOptions);
        // return this.http.put(`${this.budgetsUrl}/${budget?.id}`, budget, this.httpOptions);
      }),
      tap(_ => console.log(`Updated Budget id=${budget!.category}`)),
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
