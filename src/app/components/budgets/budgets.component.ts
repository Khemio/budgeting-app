import { Component, OnInit } from '@angular/core';

import { Budget } from '../../budget';
import { BudgetsService } from '../../services/budgets.service';


@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss']
})
export class BudgetsComponent implements OnInit {
  total: Budget = {
    id: 0,
    category: 'Total',
    curAmount: 0,
    maxAmount: 0
  };

  budgets: Budget[] = [];



  constructor(private budgetsSrvice: BudgetsService) { }

  ngOnInit(): void {
    this.getBudgets();
    this.setTotal();
  }

  getBudgets(): void {
    this.budgetsSrvice.getBudgets()
    .subscribe(budgets => this.budgets = budgets)
  }

  setTotal(): void {
    this.budgets.map(budget => {
      this.total.curAmount += budget.curAmount;
      this.total.maxAmount += budget.maxAmount;
    })


    this.budgets.unshift(this.total);
  }

}
