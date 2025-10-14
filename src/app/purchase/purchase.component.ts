import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Sale, Page, SaleService } from '../services/sale.service';
import { StatesPayment } from '../utils/enums';
import { PurchaseDetailComponent } from './purchase-detail/purchase-detail.component';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,PurchaseDetailComponent],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})
export class PurchaseComponent {
  mode: string = 'LIST';
  saleSelected: Sale | undefined;
  page: Page | undefined;
  sales: Sale[] = [];
  states = StatesPayment;
  constructor(private saleService: SaleService,
              private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.saleService.getSales().subscribe(
      page => {
        this.page = page;
        this.sales = page.items.filter(item => item.kind_id == 2);
      }
    )
    this.sales.forEach(sale => {sale.date = new Date(sale.date)})
  }

  search(): void {

  }
  create() {
    this.mode = 'INS';
    this.saleSelected = { id: 0, date: new Date(), payment_id: 0, payment_name: "", state_id: this.states.Confirmado,state_name:'', total: 0, items : [],kind_id:2, kind_name:'' }
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

  getDateFormatString(date:Date):string{    
    date = new Date(date)     
    let newDate = date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
    });  
    return newDate
  }
  getTimeFormatString(date:Date):string{
    date = new Date(date)
    let newDate = date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
    });
    return newDate
  }
  generatePDF(){
    let query = 'kind_id=2'
    this.reportService.downloadPDF(query).subscribe({
      next: (data) => {
        const fileURL = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = 'report.pdf';
        a.click();
        URL.revokeObjectURL(fileURL);
      },
      error: (error) => {
        console.error('Error al descarga PDF. ',error)
      }
    })
  }
  generateXLSX(){
    let query = 'kind_id=2'
    this.reportService.downloadXSLX(query).subscribe({
      next: (data) => {
        const blob = new Blob([data],{
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const fileURL = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = 'report.xlsx';
        a.click();
        URL.revokeObjectURL(fileURL);
      },
      error: (error) => {
        console.error('Error al descarga Excel. ',error)
      }
    })
  }
}
