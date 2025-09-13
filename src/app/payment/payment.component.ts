import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Payment, PaymentService } from '../services/payment.service';
import { AlertComponent } from '../utils/alert/alert.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AlertComponent, PaymentDetailComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  mode: string = 'LIST';
  payments: Payment[] = [];
  paymentSelected: Payment | undefined;
  isError: boolean = false;
  message: string = '';

  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.paymentService.getPayments().subscribe(payments => { this.payments = payments })

  }
  create() {
    this.mode = 'INS';
    this.paymentSelected = { id: 0, name: '' }
  }
  edit(payment: Payment) {
    this.mode = 'UPD';
    this.paymentSelected = payment;
  }
  onModeChanged(newmode: string) {
    this.mode = 'LIST';
    this.ngOnInit();
  }
}
