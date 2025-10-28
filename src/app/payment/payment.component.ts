import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Filter, Payment, PaymentService } from '../services/payment.service';
import { AlertComponent } from '../utils/alert/alert.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';
import { ModalComponent } from '../utils/modal/modal.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AlertComponent, PaymentDetailComponent,ModalComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  mode: string = 'LIST';
  payments: Payment[] = [];
  paymentSelected: Payment | undefined;
  isError: boolean = false;
  message: string = '';
  showModal = false;
  selectedProduct: Payment | undefined;
  messageModal:string='';
  filter:Filter={};

  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.filter.includeDeleted = true;
    this.paymentService.getPayments(this.filter).subscribe(payments => { this.payments = payments })

  }
  create() {
    this.mode = 'INS';
    this.paymentSelected = { id: 0, name: '' , is_deleted:false}
  }
  edit(payment: Payment) {
    this.mode = 'UPD';
    this.paymentSelected = payment;
  }
  onModeChanged(newmode: string) {
    this.mode = 'LIST';
    this.ngOnInit();
  }

 setSelectPayment(payment: Payment){
    this.paymentSelected = payment;
    if (this.paymentSelected.is_deleted == false){
      this.messageModal = '¿Está seguro de inactivar la forma de pago '+ this.paymentSelected.name + '?'
    }else{
      this.messageModal = '¿Está seguro de activar la forma de pago '+ this.paymentSelected.name + '?'
    }
    this.showModal = true;
  }

  activate(payment: Payment) {
    const index = this.payments.findIndex(p => p.id === payment.id);
    this.paymentService.activate(payment.id).subscribe(
      response => {
        this.payments[index].is_deleted = false
      }
    )
  }
  deactivate(payment: Payment) {
    const index = this.payments.findIndex(p => p.id === payment.id);
    this.paymentService.deactivate(payment.id).subscribe(
      response => {
        this.payments[index].is_deleted = true
      }
    )
  }
  confirmModal() {
    if (this.paymentSelected) {
      if (this.paymentSelected.is_deleted == true) {
        this.activate(this.paymentSelected);
      } else {
        this.deactivate(this.paymentSelected);
      }
    }
    this.showModal = false;
  }
  cancelModal() {
    this.showModal = false;
    this.messageModal ='';
  }
}
