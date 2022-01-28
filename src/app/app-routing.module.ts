import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetsComponent } from './components/budgets/budgets.component';
import { ExpensesComponent } from './components/expenses/expenses.component';

const routes: Routes = [
  {path: '', redirectTo: '/expenses', pathMatch: 'full'},
  {path: 'budgets', component: BudgetsComponent},
  {path: 'expenses', component: ExpensesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
