import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { LowerCasePipe } from '@angular/common';

import { Expense } from 'src/app/expense';;
import { BudgetsService } from 'src/app/services/budgets.service';

@Component({
  selector: 'app-search-expenses',
  templateUrl: './search-expenses.component.html',
  styleUrls: ['./search-expenses.component.scss'],
  providers: [LowerCasePipe]
})
export class SearchExpensesComponent implements OnInit {
  expenses$!: Observable<Expense[]>;
  private searchTerms = new Subject<string>();

  constructor(private budgetsService: BudgetsService, private lowercase: LowerCasePipe) { }

  search(term: string) {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.searchBudgets();
  }

  searchBudgets() {
    this.expenses$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.budgetsService.searchExpenses(this.lowercase.transform(term))),
    )
  }

}
