import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Sale, Page, SaleService } from '../services/sale.service';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
import { getDateFormatString } from '../utils/enums';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SaleDetailComponent],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent {
  mode: string = 'LIST';
  saleSelected: Sale | undefined;
  page: Page | undefined;
  sales: Sale[] = [];
  constructor(private saleService: SaleService) { }

  ngOnInit(): void {
    this.saleService.getSales().subscribe(
      page => {
        this.page = page;
        this.sales = page.items;
      }
    )
    this.sales.forEach(sale => {sale.date = new Date(sale.date)})
  }

  search(): void {

  }
  create() {
    this.mode = 'INS';
    this.saleSelected = { id: 0, date: new Date(), payment_id: 0, payment_name: "", state: "", total: 0, products : [] }
  }
  edit(sale: Sale) {
    this.mode = 'UPD';
    this.saleSelected = sale;
  }
  view(sale: Sale) {
    this.mode = 'DSP';
    this.saleSelected = sale;
  }
  onModeChanged(newmode: string) {
    this.mode = 'LIST';
    this.ngOnInit();
  }

}
