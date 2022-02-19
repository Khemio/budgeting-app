import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';

import { Budget } from 'src/app/budget';
import { Expense } from '../expense';
import { TitleCasePipe } from '@angular/common';
// import { BUDGETS } from 'src/app/mock-budgets';

@Injectable({
  providedIn: 'root',
})
export class BudgetsService {
  private budgetsUrl = 'https://app-budgets.herokuapp.com/api/v1/budgets'
  private expensesUrl = 'https://app-budgets.herokuapp.com/api/v1/expenses'

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  // BUDGETS
  getBudgets(): Observable<Budget[]>{
    return this.http.get<Budget[]>(this.budgetsUrl)
    .pipe(
      tap(_ => console.log('Fetched Budgets')),
      catchError(this.handleError<Budget[]>('getBudgets', [])));
  }

  getBudget(category: string): Observable<Budget> {
    const url = `${this.budgetsUrl}/${category}`;
    return this.http.get<Budget>(url)
      .pipe(
        tap(_ => console.log(`Fetched budget category=${category}`)),
        catchError(this.handleError<Budget>(`getBudget category=${category}`))
      );
  }

  updateBudget(budget: Budget): Observable<any> {
    return this.http.put(this.budgetsUrl, budget, this.httpOptions)
    .pipe(
      tap(_ => console.log(`Updated Budget id=${budget!._id}`)),
      catchError(this.handleError<Budget[]>('updateBudget', [])));
  }

  addBudget(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this.budgetsUrl, budget, this.httpOptions)
      .pipe(
        tap((newBudget: Budget) => console.log(`Added Budget w/ id=${newBudget._id}`)),
        catchError(this.handleError<Budget>('addBudget'))
      )
  }

  deleteBudget(id: string): Observable<Budget> {
    const url = `${this.budgetsUrl}/${id}`;

    return this.http.delete<Budget>(url, this.httpOptions)
      .pipe(
        tap(_ => console.log(`Deleted Budget id=${id}`)),
        catchError(this.handleError<Budget>('deleteHero'))
      )
  }

  searchBudgets(term: string): Observable<Budget[]> {
    if (!term.trim()) {
      return of([]);
    }

    return this.http.get<Budget[]>(`${this.budgetsUrl}/?category=${term}`)
      .pipe(
        tap( x => x.length ?
          console.log(`found budgets matchng ${term} `) :
          console.log(`no budgets matching ${term}`)),
          catchError(this.handleError<Budget[]>('searchBudgets', []))
      );
  }


  // EXPENSES
  getExpenses(): Observable<Expense[]>{
    return this.http.get<Expense[]>(this.expensesUrl)
    .pipe(
      tap(_ => console.log('Fetched Expenses')),
      catchError(this.handleError<Expense[]>('getExpenses', [])));
  }

  getExpense(id: number): Observable<Expense> {
    const url = `${this.expensesUrl}/${id}`;
    return this.http.get<Expense>(url)
      .pipe(
        tap(_ => console.log(`Fetched expense id=${id}`)),
        catchError(this.handleError<Expense>(`getExpense id=${id}`))
      );
  }

  updateExpense(expense: Expense): Observable<any> {
    return this.http.put(this.expensesUrl, expense, this.httpOptions)
    .pipe(
      tap(_ => console.log(`Updated Budget id=${expense._id}`)),
      catchError(this.handleError<Expense[]>('updateExpense', [])));
  }

  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.expensesUrl, expense, this.httpOptions)
      .pipe(
        tap((newExpense: Expense) => {
          console.log(`Added Expense w/ id=${newExpense._id}`);
        }),
        catchError(this.handleError<Expense>('addExpense')),
      )
  }

  deleteExpense(id: string): Observable<Expense> {
    const url = `${this.expensesUrl}/${id}`;

    return this.http.delete<Expense>(url, this.httpOptions)
      .pipe(
        tap(_ => console.log(`Deleted Expense id=${id}`)),
        catchError(this.handleError<Expense>('deleteExpense'))
      )
  }

  searchExpenses(term: string): Observable<Expense[]> {
    if (!term.trim()) {
      return of([]);
    }

    return this.http.get<Expense[]>(`${this.expensesUrl}/?category=${term}`)
      .pipe(
        tap( x => x.length ?
          console.log(`found expenses matchng ${term} `) :
          console.log(`no expenses matching ${term}`)),
          catchError(this.handleError<Expense[]>('searchExpenses', []))
      );
  }






  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * operation - name of the operation that failed
 * result - optional value to return as the observable result
 */
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
