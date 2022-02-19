import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { LowerCasePipe } from '@angular/common';

import { Budget } from 'src/app/budget';
import { BudgetsService } from 'src/app/services/budgets.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [LowerCasePipe]
})
export class SearchComponent implements OnInit {
  @Input() searchCategory?: string;
  @Output() hideEvent = new EventEmitter<any>();
  budgets$!: Observable<Budget[]>;
  private searchTerms = new Subject<string>();

  constructor(private budgetsService: BudgetsService, private lowercase: LowerCasePipe) { }

  search(term: string) {
    this.searchTerms.next(term);
    this.hideList(term);
  }

  ngOnInit(): void {
    this.searchBudgets();
    if (this.searchCategory) {
      this.search(this.searchCategory!);

    }
  }

  ngOnChanges(changes: SimpleChange): void {
    this.search(this.searchCategory!);
  }

  searchBudgets() {
    
    this.budgets$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.budgetsService.searchBudgets(this.lowercase.transform(term))),
    )
  }

  hideList(value: string): void {
    if(value == ''){ 
      this.hideEvent.emit(true);
    } else {
      this.hideEvent.emit(false);
    }
    
  }

}
