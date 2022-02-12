import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Budget } from '../../budget';
import { ModalComponent } from '../modal/modal.component';

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
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.category = this.budget.category;
    // modalRef.componentInstance.newItemEvent.subscribe((newItem: any) => {
    //   console.log(newItem);
    // })

    modalRef.result.then((result: any) => {
      if (result) {
        // this.addBudget(result);
      }
    },
    (reason) => {
      console.log(reason);
    });
  }

}
