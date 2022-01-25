import { Component, OnInit, Input } from '@angular/core';

import { Budget } from '../../budget';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {
  @Input() budget!: Budget;
  ratio!: number;
  color: string = '';

  constructor() { }

  ngOnInit(): void {
    this.setRatio();
    this.setColor()
  }

  setRatio(): void {
    this.ratio = this.budget.curAmount / this.budget.maxAmount;
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

}
