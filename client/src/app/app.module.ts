import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BudgetsComponent } from './components/budgets/budgets.component';
import { BudgetComponent } from './components/budget/budget.component';
import { ModalComponent } from './components/modal/modal.component';
import { SearchComponent } from './components/search/search.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { SearchExpensesComponent } from './components/search-expenses/search-expenses.component';
import { AddExpenseModalComponent } from './components/add-expense-modal/add-expense-modal.component';
import { LowerCasePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    BudgetsComponent,
    BudgetComponent,
    ModalComponent,
    SearchComponent,
    ExpensesComponent,
    ExpenseComponent,
    SearchExpensesComponent,
    AddExpenseModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [LowerCasePipe],
  bootstrap: [AppComponent],
})
export class AppModule { }
