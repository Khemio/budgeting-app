import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Budget } from '../../budget';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {
  @Input() budget!: Budget;
  @Output() deleteBudgetEvent = new EventEmitter<Budget>();
  ratio!: number;
  color: string = '';

  constructor() { }

  ngOnInit(): void {
    this.setRatio();
    this.setColor()
  }

  setRatio(): void {
    this.ratio = this.budget.budgetUsed / this.budget.budgetLimit;
  }

  setColor(): void {
    if (this.ratio < 0.5) {
      this.color = 'primary';
    }
    else if (this.ratio < 0.75) {
      this.color = 'warning';
    }
    else {
      this.color = 'danger';
    }
  }

  deleteBudget(budget: Budget): void {
    this.deleteBudgetEvent.emit(budget);
  }

}
