import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { forkJoin, Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, concatMap, map } from 'rxjs/operators';
import { LowerCasePipe } from '@angular/common';

import { Expense } from 'src/app/expense';;
import { BudgetsService } from 'src/app/services/budgets.service';

@Component({
  selector: 'app-search-expenses',
  templateUrl: './search-expenses.component.html',
  styleUrls: ['./search-expenses.component.scss'],
  providers: [LowerCasePipe]
})

export class SearchExpensesComponent implements OnInit, OnChanges {
  @Input() searchCategory?: string;
  @Input() searchArray?: string[];
  @Output() hideEvent = new EventEmitter<any>();
  expenses$!: Observable<Expense[]>;
  private searchTerms = new Subject<string>();
  // expenses!: Expense[];
  // private searchTermsArray = new Subject<string[]>();

  // testArray: string[] = [
  //   'study', 'sport', 'entertainment'
  // ]

  constructor(private budgetsService: BudgetsService, private lowercase: LowerCasePipe) { }

  search(term: string) {
    this.searchTerms.next(term);
    this.hideList(term);
  }

  ngOnInit(): void {
    this.searchBudgets();
    // this.searchArray!.forEach((term: string) => this.search(term));
    
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.search(this.searchCategory!);

    for (let propName in changes) { 

      let change = changes[propName];

      if(propName === 'searchArray') {

        this.searchArray = change.currentValue;
  
        this.searchArray?.forEach((term: string) => {
          this.search(term)
        })

          this.searchBudgets();}
          // this.searchArray = [];
        // } else {
        //   this.search(change.currentValue);
        //   console.log(change.currentValue)
        //   this.searchBudgets();

        // }

      }

  }

  searchBudgets() {

    if (this.searchArray!.length > 0) {
      let temp: any[] = [];

        this.searchArray!.forEach((cat) => {
          temp.push(this.budgetsService.searchExpenses(this.lowercase.transform(cat)));
        })
        
        forkJoin(temp!)
        .pipe(map(data => data.reduce((result, arr) => [...result, ...arr], [])))
        .subscribe(data => {
          // this.autoCompleteValues = data;
          this.expenses$ = of(data);
          // console.log(data);
        });

    } else {
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

  hideList(value: string): void {
    if(value == ''){ 
      this.hideEvent.emit(true);
    } else {
      this.hideEvent.emit(false);
    }
    
  }

}
