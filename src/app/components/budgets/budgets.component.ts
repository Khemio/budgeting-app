import { Component, OnInit, Input } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap'; //Modal
import { ActivatedRoute } from '@angular/router';

import { Budget } from '../../budget';
import { BudgetsService } from '../../services/budgets.service';
import { UpdateService } from 'src/app/services/update.service';
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
  category: string = '';



  constructor(private budgetsService: BudgetsService, 
    private updateService: UpdateService, 
    private modalService: NgbModal,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getBudgets();
    
  }

  getBudgets(): void {
    this.budgetsService.getBudgets()
    .subscribe(budgets => {
      this.budgets = budgets;
      this.setTotal();

      this.route.queryParams
        .subscribe(params => {
          if (params['category']) {
            
            // console.log(this.category)
            // console.log(this.budgets)
            
            if(!budgets.find(budget => budget.category === params['category'])) {
              this.category = 'uncategorized'
              console.log(this.category);
            } else {
              this.category = params['category'];
              console.log(this.category);
  
            }
          }
      
        }
      );
    });
  }

  // getBudget(id: number): void {
  //   this.budgetsService.getBudget(id)
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
    const uncategorizedBudget: Budget | undefined = this.budgets.find(budget => budget.category === 'uncategorized')
    // this.updateService.addedBudget(budget, uncategorizedBudget!)
    this.budgetsService.addBudget(budget).
      subscribe(budget => {
        this.updateService.addedBudget(budget, uncategorizedBudget!)
        this.budgets.push(budget);
        this.budgets[0].budgetUsed += budget.budgetUsed;
        this.budgets[0].budgetLimit += budget.budgetLimit;
      })
  }

  deleteBudget(budget: Budget): void {
    const uncategorizedBudget: Budget | undefined = this.budgets.find(budget => budget.category === 'uncategorized')
    this.updateService.deletedBudget(budget, uncategorizedBudget!)
    this.budgets = this.budgets.filter(b => b.id != budget.id);
    this.budgetsService.deleteBudget(budget.id).subscribe();
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
