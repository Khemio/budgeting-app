import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Expense } from 'src/app/expense';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  @Input() expense!: any;
  @Output() deleteExpenseEvent = new EventEmitter<Expense>();

  constructor() { }

  ngOnInit(): void {
  }

  deleteExpense(expense: Expense): void {
    this.deleteExpenseEvent.emit(expense);
  }

}
