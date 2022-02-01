import { Component, OnInit } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap'; //Modal

import { Budget } from '../../budget';
import { BudgetsService } from '../../services/budgets.service';
import { ModalComponent } from '../modal/modal.component';


// Budgets
@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss']
})
export class BudgetsComponent implements OnInit {
  total: Budget = {
    id: 0,
    category: 'Total',
    budgetUsed: 0,
    budgetLimit: 0
  };

  show = true;
  budgets: Budget[] = [];
  closeResult = '';


  constructor(private budgetsSrvice: BudgetsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getBudgets();
  }

  getBudgets(): void {
    this.budgetsSrvice.getBudgets()
    .subscribe(budgets => {
      this.budgets = budgets;
      this.setTotal();
    });
  }

  // getBudget(id: number): void {
  //   this.budgetsSrvice.getBudget(id)
  //     .subscribe(budget => {
  //       console.log(budget);
  //     })
  // }

  setTotal(): void {
    this.budgets.map(budget => {
      this.total.budgetUsed += budget.budgetUsed;
      this.total.budgetLimit += budget.budgetLimit;
    })

    this.budgets.unshift(this.total);
  }

  addBudget(budget: Budget): void {
    this.budgetsSrvice.addBudget(budget).
      subscribe(budget => {
        this.budgets.push(budget);
        this.budgets[0].budgetUsed += budget.budgetUsed;
        this.budgets[0].budgetLimit += budget.budgetLimit;
      })
  }

  deleteBudget(budget: Budget): void {
    this.budgets = this.budgets.filter(b => b.id != budget.id);
    this.budgetsSrvice.deleteBudget(budget.id).subscribe();
  }

  open() {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.id = this.budgets.length;
    // modalRef.componentInstance.newItemEvent.subscribe((newItem: any) => {
    //   console.log(newItem);
    // })

    modalRef.result.then((result: any) => {
      if (result) {
        this.addBudget(result);
      }
    },
    (reason) => {
      console.log(reason);
    });
  }

  hide(show: boolean) {
    this.show = show;
  }

}
