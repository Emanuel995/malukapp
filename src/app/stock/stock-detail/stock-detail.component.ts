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
  selector: 'app-stock-detail',
  imports: [CommonModule, RouterModule, FormsModule, AlertComponent],
  templateUrl: './stock-detail.component.html',
  styleUrl: './stock-detail.component.css'
})
export class StockDetailComponent {
  isError: boolean = false;
  message: string = '';
  editable: boolean = false;
  sale: Sale | undefined;
  date: string = '';
  time: string = '';
  items: Items[] = [];
  item: Items | undefined;
  products: Product[] = [];
  newProduct: Product | undefined;
  filter: string = '';
  suggestions: Product[] = [];
  total: number = 0;

  newProductStock: number = 0;
  newStock: number = 0;
  payments: Payment[] | undefined;
  states = StatesPayment;
  stateSelect: StateOption[] = [];
  movementsType = MovementsType;
  movementsSelect: MovementOption[] = [];
  filters: ProductFilter = {};
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
        state_name: '',
        items: [],
        kind_id: 3,
        kind_name: ''
      }
      this.sale.date = new Date(this.sale.date);
      this.date = getDateFormatString(this.sale.date)
      this.time = getTimeFormatString(this.sale.date);
    } else {
      if (this.sale) {
        this.sale.date = new Date(this.sale.date);
        if (this.sale.date instanceof Date) {
          this.date = getDateFormatString(this.sale.date)
          this.time = getTimeFormatString(this.sale.date);
        }
        this.saleService.getSaleById(this.sale.id).subscribe(sale => {
          this.items = sale.items;
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
    this.addProduct();
    switch (this.mode) {
      case 'INS':

        if (this.sale) {
          if (this.sale?.items && this.sale?.items.length > 0) {
            this.saleService.createSale(this.sale).subscribe(
              resp => {
                this.isError = resp.isError;
                this.message = resp.message + ' % ' + new Date().toUTCString();
                console.log(resp);
                if (this.isError == false) {
                  this.modeChange.emit('LIST');
                }
              });
          } else {
            this.isError = true;
            this.message = 'Debe ingresar un producto para realizar el ajuste de stock' + ' % ' + new Date().toUTCString();
          }
        }
        break;
    }
    this.isErrorChange.emit(this.isError);
    this.messageChange.emit(this.message + ' % ' + new Date().toUTCString());
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
    this.newProduct = product;
    this.suggestions = [];

  }
  addProduct() {
    if (this.newStock === 0) {
      this.isError = true;
      this.message = 'El ajuste debe ser distinto de 0' + ' % ' + new Date().toUTCString();
    }
    if (this.newProductStock < 0) {
      this.isError = true;
      this.message = 'El resultado del ajuste debe ser mayor  a 0' + ' % ' + new Date().toUTCString();
    }
    if (this.newProduct && this.isError === false) {
      this.item = {
        product_id: this.newProduct.id,
        product_name: this.newProduct.name,
        quantity: this.newStock,
        sale_id: this.sale ? this.sale.id : 0,
        unit_price: 0,
        subtotal: 0,
      }

      this.items.push(this.item);
      if (this.sale) {
        this.sale.items = this.items
      }
      this.filter = "";
    }
  }
  onQuantitychange() {
    if (isNaN(this.newStock)) {
      this.newStock = 0;
    } else {
      if (this.newProduct) {
        this.newProductStock = this.newProduct?.stock + this.newStock
      }
    }
  }

  removeProduct() {
    this.filter = '';
    this.newProduct = undefined;
    this.newStock = 0;
    this.newProductStock = 0;
  }
}
