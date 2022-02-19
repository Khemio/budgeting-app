import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalComponent } from '../modal/modal.component';
import { Expense } from 'src/app/expense';
import { Budget } from 'src/app/budget';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  @Input() expense!: any;
  @Output() deleteExpenseEvent = new EventEmitter<Expense>();
  @Output() addBudgetEvent = new EventEmitter<Budget>();

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  deleteExpense(expense: Expense): void {
    this.deleteExpenseEvent.emit(expense);
  }

  open() {
    const modalRef = this.modalService.open(ModalComponent);
    // modalRef.componentInstance.id = this.expenses.length;
    modalRef.componentInstance.refCategory = this.expense.category;

    modalRef.result.then((result: any) => {
      if (result) {
        // this.addExpense(result);
        this.addBudgetEvent.emit(result);
      }
    },
    (reason) => {
      console.log(reason);
    })
  }

}
