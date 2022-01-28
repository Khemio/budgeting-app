import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import { Expense } from 'src/app/expense';
import { BudgetsService } from '../../services/budgets.service';
import { AddExpenseModalComponent } from '../add-expense-modal/add-expense-modal.component';


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];

  constructor(private budgetsService: BudgetsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getExpeses();
  }

  getExpeses(): void {
    this.budgetsService.getExpenses()
    .subscribe(expeses => {
      this.expenses = expeses;
    });
  }

  getExpense(id: number): void {
    this.budgetsService.getExpense(id)
      .subscribe(expense => {
        console.log(expense);
      })
  }

  addExpense(expense: Expense): void {
    this.budgetsService.addExpense(expense).
      subscribe(expense => {
        this.expenses.push(expense);
      })
  }

  deleteExpense(expense: Expense): void {
    this.expenses = this.expenses.filter(b => b.id != expense.id);
    this.budgetsService.deleteExpense(expense.id).subscribe();
  }

  open() {
    const modalRef = this.modalService.open(AddExpenseModalComponent);
    modalRef.componentInstance.id = this.expenses.length;
    // modalRef.componentInstance.newItemEvent.subscribe((newItem: any) => {
    //   console.log(newItem);
    // })

    modalRef.result.then((result: any) => {
      if (result) {
        this.addExpense(result);
      }
    },
    (reason) => {
      console.log(reason);
    })
  }

}
