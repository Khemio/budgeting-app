import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LowerCasePipe } from '@angular/common';

import { Budget } from '../../budget';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [ LowerCasePipe ]
})
export class ModalComponent implements OnInit {
  @Input() id!: number;
  @Input() refCategory!: string;
  // @Output() newItemEvent = new EventEmitter ();

  constructor(public activeModal: NgbActiveModal, private lowercase: LowerCasePipe) { }

  ngOnInit(): void {
  }

  submit(category: string, budgetLimit: any, budgetUsed: any = 0) {
    const newBudget: Budget = {
      id: this.id, 
      category: this.lowercase.transform(category),
      budgetUsed: Number(budgetUsed),  
      budgetLimit: Number(budgetLimit)}

    this.activeModal.close(newBudget);
  }

  // addNewItem(value: string) {
  //   this.newItemEvent.emit(value);
  // }
}
