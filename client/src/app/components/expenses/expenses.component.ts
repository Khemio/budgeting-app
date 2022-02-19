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
    private updateService: UpdateService, 
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
      console.log(this.expenses)

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
    console.log('triggered');
    this.budgetsService.addExpense(expense).
      subscribe(expense => {
        console.log(expense)
        this.updateService.addedExpense(expense);
        this.expenses.push(expense);
      })
  }

  addBudget(budget: Budget) {
    const uncategorizedBudget: Budget | undefined = this.budgets.find(budget => budget.category === 'uncategorized')
    // this.updateService.addedBudget(budget, uncategorizedBudget!)
    this.budgetsService.addBudget(budget).
      subscribe(budget => {
        this.updateService.addedBudget(budget, uncategorizedBudget!)
        this.budgets.push(budget);
        this.budgets[0].budgetUsed += budget.budgetUsed;
        this.budgets[0].budgetLimit! += budget.budgetLimit!;
      })
  }

  deleteExpense(expense: Expense): void {
    this.updateService.deletedExpense(expense);
    
    this.expenses = this.expenses.filter(b => b._id != expense._id);
    this.budgetsService.deleteExpense(expense._id!).subscribe();
  }

  open() {
    const modalRef = this.modalService.open(AddExpenseModalComponent);
    modalRef.componentInstance.id = this.expenses.length;
    // modalRef.componentInstance.newItemEvent.subscribe((newItem: any) => {
    //   console.log(newItem);
    // })

    modalRef.result.then((result: any) => {
      if (result) {
        this.addExpense(result)
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
