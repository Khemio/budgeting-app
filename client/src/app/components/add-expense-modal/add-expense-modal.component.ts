import { Component, OnInit, Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LowerCasePipe } from '@angular/common';

import { Expense } from 'src/app/expense';

@Component({
  selector: 'app-add-expense-modal',
  templateUrl: './add-expense-modal.component.html',
  styleUrls: ['./add-expense-modal.component.scss'],
  providers: [ LowerCasePipe ]
})
export class AddExpenseModalComponent implements OnInit {
  @Input() id!: string;
  @Input() refCategory!: string;

  constructor(public activeModal: NgbActiveModal, private lowercase: LowerCasePipe) { }

  ngOnInit(): void {
    // console.log(this.refCategory)
  }


  submit(category: string, name: string, amount: any) {
    const newExpense: Expense = {
      // id: this.id, 
      category: this.lowercase.transform(category),
      name: name,  
      amount: Number(amount)}

    this.activeModal.close(newExpense);
  }


}
