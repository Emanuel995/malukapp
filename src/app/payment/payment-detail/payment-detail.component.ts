import { CommonModule } from '@angular/common';
import { Component, EventEmitter , Input, output, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Payment, PaymentService } from '../../services/payment.service';
import { AlertComponent } from '../../utils/alert/alert.component';

@Component({
  selector: 'app-payment-detail',
  standalone:true,
  imports: [CommonModule, RouterModule, FormsModule, AlertComponent],
  templateUrl: './payment-detail.component.html',
  styleUrl: './payment-detail.component.css'
})

export class PaymentDetailComponent {
  isError:boolean = false;
  message:string = '';
  payments:Payment[] = [];
  payment:Payment | undefined;
  editable:boolean=true;
  @Input() paymentSelected : Payment | undefined;
  @Input() mode : string ='';
  @Output() modeChange = new EventEmitter<string>();
  @Output() isErrorChange = new EventEmitter<Boolean>();
  @Output() messageChange = new EventEmitter<string>();
  constructor(private paymentService: PaymentService){}

 ngOnInit():void {
  if (this.mode == 'INS') {
    this.payment = {
      id:0,
      name:'',
    }
  }else{
    this.payment = this.paymentSelected;
  }
 }

 save(){
  this.isError = false;
  this.message = '';
  switch (this.mode) {
    case 'INS':
      if (this.payment){
       this.paymentService.createPayment(this.payment).subscribe(
        resp =>{
          this.isError = resp.isError;
          this.message = resp.message;
          console.log(resp);
       if (this.isError == false) {
        this.modeChange.emit('LIST');
       }
        }
       );
      }
      break;
    case 'UPD':
      if (this.payment){
       this.paymentService.updatePayment(this.payment).subscribe(       
        resp =>{
          this.isError = resp.isError;
          this.message = resp.message;
          console.log(resp);
          if (this.isError == false) {
            this.modeChange.emit('LIST');
          }
        }
       );
      }
      break;
  }
  this.isErrorChange.emit(this.isError);
  this.messageChange.emit(this.message);
 }
 back(){
  this.modeChange.emit('LIST');
 }
}

