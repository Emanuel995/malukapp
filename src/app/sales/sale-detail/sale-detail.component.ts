import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product, ProductService, ProductFilter } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SaleService, Sale, Items } from '../../services/sale.service';
import { AlertComponent } from '../../utils/alert/alert.component';
import { getDateFormatString, getStateOptions, StateOption, StatesPayment, MovementsType, MovementOption, getMovementOptions, getTimeFormatString } from '../../utils/enums';
import { PaymentService, Payment } from '../../services/payment.service';

@Component({
  standalone: true,
  selector: 'app-sale-detail',
  imports: [CommonModule, RouterModule, FormsModule, AlertComponent],
  templateUrl: './sale-detail.component.html',
  styleUrl: './sale-detail.component.css'
})
export class SaleDetailComponent {
  isError: boolean = false;
  message: string = '';
  editable: boolean = false;
  sale: Sale | undefined;
  date: string = '';
  time: string = '';
  items: Items[] = [];
  item: Items | undefined;
  products: Product[] = [];
  newPorduct: Product | undefined;
  filter: string = '';
  suggestions: Product[] = [];
  total: number = 0;
  newQuantity: number = 1;
  newProductPrice: number = 0;
  newtotal:number = 0;
  payments: Payment[] | undefined;
  states = StatesPayment;
  stateSelect : StateOption[] = [];
  movementsType = MovementsType;
  movementsSelect : MovementOption[] = [];
  filters : ProductFilter = {};
  @Input() saleSelected: Sale | undefined;
  @Input() mode: string = '';
  @Output() modeChange = new EventEmitter<string>();
  @Output() isErrorChange = new EventEmitter<Boolean>();
  @Output() messageChange = new EventEmitter<string>();
  constructor(private saleService: SaleService,
    private productService: ProductService,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.sale = this.saleSelected;
    this.filters.includeDeleted = false;
    this.productService.getProducts(this.filters).subscribe(products => this.products = products);
    this.paymentService.getPayments().subscribe(payment => this.payments = payment);
    this.stateSelect = getStateOptions();
    this.movementsSelect = getMovementOptions();

    this.editable = false;
    if (this.mode == 'INS') {
      this.sale = {
        id: 0,
        date: new Date(),
        payment_id: 1,
        payment_name: "",
        total: 0,
        state_id: this.states.Confirmado,
        state_name:'',
        items: [],
        kind_id:1,
        kind_name:''
      }
      this.sale.date = new Date(this.sale.date);
      this.date = getDateFormatString(this.sale.date)
      this.time = getTimeFormatString(this.sale.date);
    }else{
      if (this.sale) {
        this.sale.date = new Date(this.sale.date);
        if (this.sale.date instanceof Date) {
          this.date = getDateFormatString(this.sale.date)
          this.time = getTimeFormatString(this.sale.date);
        }   
        this.saleService.getSaleById(this.sale.id).subscribe(sale => {
          this.items = sale.items;
          this.setTotalSale();
        })
      }
    }
    if (this.mode == 'INS' || this.mode == 'UPD') {
      this.editable = true;
    }

  }


  save() {
    this.isError = false;
    this.message = '';
    switch (this.mode) {
      case 'INS':
        if (this.sale) {
          console.log(this.sale);
          
          this.saleService.createSale(this.sale).subscribe(
            resp => {
              console.log(this.sale);
              
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
        if (this.sale) {
          this.saleService.updateSale(this.sale).subscribe(
            resp => {
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

  back() {
    this.modeChange.emit('LIST');
  }

  onSearch() {
    const value = this.filter.toUpperCase();
    this.suggestions = this.products.filter(p => p.name.toUpperCase().includes(value)).slice(0, 5)
  }
  selectSuggestion(product: Product) {
    this.filter = product.name;
    this.newPorduct = product;
    this.newProductPrice = product.price;
    this.suggestions = [];
  }
  addProduct() {
    if (this.newPorduct) {
      this.item = {
        product_id: this.newPorduct.id,
        product_name: this.newPorduct.description,
        quantity: this.newQuantity,
        sale_id: this.sale ? this.sale.id : 0,
        unit_price: this.newProductPrice,
        subtotal: this.newQuantity * this.newProductPrice,
        product:this.newPorduct,
      }

      this.items.push(this.item);
      if (this.sale){
        this.sale.items = this.items
      }
      this.setTotalSale();
      this.newQuantity = 1;
      this.filter = "";
      this.newProductPrice = 0;
    }
  }
  onQuantitychange(item: Items) {
    item.subtotal = item.quantity * item.unit_price;
    this.setTotalSale();

  }
  setTotalSale() {
    this.total = this.items.reduce((total, item) => total + item.subtotal, 0)
  }
  removeProduct(item: Items) {
    this.items = this.items.filter(i => i.product_id !== item.product_id)
    this.setTotalSale();
  }
  onQuantity(){
    this.newtotal = this.newProductPrice * this.newQuantity
  }
  onTotal(){
    this.newQuantity = this.newtotal / this.newProductPrice;
    this.newQuantity = Number(this.newQuantity.toFixed(2));
  }
}
