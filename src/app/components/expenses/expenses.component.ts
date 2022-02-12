import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

import { Expense } from 'src/app/expense';
import { BudgetsService } from '../../services/budgets.service';
import { UpdateService } from 'src/app/services/update.service';
import { AddExpenseModalComponent } from '../add-expense-modal/add-expense-modal.component';
import { Budget } from 'src/app/budget';


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  budgets: Budget[] = [];
  category: string = '';
  categoryArray: string[] = [];

  show = true;

  constructor(private budgetsService: BudgetsService,
    private updatesService: UpdateService, 
    private modalService: NgbModal,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getExpenses();
    
  }

  getExpenses(): void {
    this.budgetsService.getExpenses()
    .subscribe(expenses => {
      this.expenses = expenses;
      // this.getBudgets()

      this.budgetsService.getBudgets()
    .subscribe(budgets => {
      this.budgets = budgets;

    
      this.route.queryParams
        .subscribe(params => {
          if (params['category']) {
            if (expenses.some(expense => params['category'] === expense.category)) {
              this.category = params['category'];

            } else if (params["category"] === 'uncategorized') {
              let uncatExp: Expense[] = this.getMatch(expenses, budgets);
              uncatExp.forEach(expense => this.categoryArray = [...this.categoryArray, expense.category]);
            } else {
              this.category = ' ';
            }
          }
      
        })
    });
    });

  }

  getMatch(a: Expense[], b: Budget[]) {
    let matches: Expense[] = [];
    
    for ( let i = 0; i < a.length; i++ ) {
            if ( !b.some(budget => budget.category === a[i].category)  && 
              !matches.some(expense => expense.category === a[i].category)) {
                matches.push( a[i] )
              
              };
    }
    return matches;
    }

  getExpense(id: number): void {
    this.budgetsService.getExpense(id)
      .subscribe(expense => {
        console.log(expense);
      })
  }

  getBudgets(): void {
    this.budgetsService.getBudgets()
    .subscribe(budgets => {
      this.budgets = budgets;

    
    });
  }

  addExpense(expense: Expense): void {
    this.budgetsService.addExpense(expense).
      subscribe(expense => {
        this.updatesService.addedExpense(expense);
        this.expenses.push(expense);
      })
  }

  deleteExpense(expense: Expense): void {
    console.log(expense);
    this.updatesService.deletedExpense(expense);
    
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

  hide(show: boolean) {
    this.show = show;
  }

}
