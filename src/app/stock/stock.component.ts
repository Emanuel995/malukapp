import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Sale, Page, SaleService, Filters } from '../services/sale.service';
import { SaleDetailComponent } from '../sales/sale-detail/sale-detail.component'
import { StatePayment, StatesPayment, getStateLabel, getStateOptions} from '../utils/enums';
import { ReportService } from '../services/report.service';
import { getDateFormatString, getTimeFormatString, getDateFormatISO } from '../utils/enums';
import { ModalComponent } from '../utils/modal/modal.component';
import { StockDetailComponent } from './stock-detail/stock-detail.component';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, StockDetailComponent,ModalComponent],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent {
  mode: string = 'LIST';
  saleSelected: Sale | undefined;
  page: Page | undefined;
  sales: Sale[] = [];
  states = StatesPayment;
  filters : Filters = {};
  filterDateFrom:string = '';
  filterDateTo:string = '';
  filterStateId:number=0;
  newState:number=0;
  showModal:boolean=false;
  messageModal:string='';

  constructor(private saleService: SaleService,
               private reportService: ReportService) { }

  ngOnInit(): void {
    let yesterday:Date= new Date();
    let tomorrow:Date = new Date();
    yesterday.setHours(0,0,0,0)
    tomorrow.setHours(0,0,0,0)
    yesterday.setDate(yesterday.getDate()-1)
    tomorrow.setDate(tomorrow.getDate()+1)

    this.filterDateFrom = getDateFormatString(yesterday);
    this.filterDateTo = getDateFormatString(tomorrow);
    
    this.filters.state_id = undefined;
    if (this.filterStateId > 0){
      this.filters.state_id = this.filterStateId;
    }
    this.filters.dateFrom = yesterday.toISOString();
    this.filters.dateTo = tomorrow.toISOString();
    this.filters.kind_id = 3;
    
    this.saleService.getSales(this.filters).subscribe(
      page => {
        this.page = page;        
        this.sales = page.items;
      }
    )
    
    this.sales.forEach(sale => {sale.date = new Date(sale.date)})
  }

  search(): void {
    this.filters.dateFrom = this.filterDateFrom
    this.filters.dateTo = this.filterDateTo
    
    this.filters.state_id = undefined;
    if (this.filterStateId > 0){
      this.filters.state_id = this.filterStateId;
    }
    this.filters.dateFrom = getDateFormatISO(this.filters.dateFrom);
    this.filters.dateTo =getDateFormatISO(this.filters.dateTo);
    
    this.saleService.getSales(this.filters).subscribe(
      page => {
        this.page = page;        
        this.sales = page.items.filter(item => item.kind_id == 3);
      }
    )
    
    this.sales.forEach(sale => {sale.date = new Date(sale.date)})
  }
  create() {
    this.mode = 'INS';
    this.saleSelected = { id: 0, date: new Date(), payment_id: 1, payment_name: "", state_id: this.states.Confirmado,state_name:'', total: 0, items : [],kind_id:3,kind_name:'' }
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
  getStateDescription(state:StatePayment):string{
    return getStateLabel(state)
  }
  generatePDF(){
    let query = 'kind_id=1'
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
    let query = 'kind_id=1'
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
  changeState(sale:Sale, newState:number){
    this.saleSelected = sale;
    this.newState = newState;
    this.showModal = true;
    this.messageModal = '¿Está seguro que desea cambiar el estado de la venta?'
  }
  confirmModal(){   
    if (this.saleSelected){
      this.saleService.updateStateSale(this.saleSelected,this.newState).subscribe({
        next:(resp)=>{
          console.log(resp.isError,resp.message);
          const index = this.sales.findIndex(sale => sale.id === this.saleSelected?.id);
          this.sales[index].state_id = this.newState
        },
        error:(err)=>{
          console.log(err);
        }

      });
    }
    this.showModal = false;

  }
  cancelModal(){
    this.showModal = false;
  }
}
