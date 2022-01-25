import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Budget } from 'src/app/budget';
import { BUDGETS } from 'src/app/mock-budgets';

@Injectable({
  providedIn: 'root'
})
export class BudgetsService {

  constructor() { }

  getBudgets(): Observable<Budget[]> {
    const budgets = of(BUDGETS);
    return budgets;
  }
}
