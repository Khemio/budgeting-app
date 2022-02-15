import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Expense } from 'src/app/expense';
import { Budget } from '../../budget';
import { AddExpenseModalComponent } from '../add-expense-modal/add-expense-modal.component';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {
  @Input() budget!: Budget;
  @Output() deleteBudgetEvent = new EventEmitter<Budget>();
  @Output() addExpenseEvent = new EventEmitter<Expense>();
  ratio!: number;
  color: string = '';

  constructor(private modalService: NgbModal) { }

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

  open() {
    const modalRef = this.modalService.open(AddExpenseModalComponent);
    modalRef.componentInstance.refCategory = this.budget.category;

    modalRef.result.then((result: any) => {
      if (result) {
        this.addExpenseEvent.emit(result);
      }
    },
    (reason) => {
      console.log(reason);
    });
  }

}
