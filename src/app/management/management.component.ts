import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, CategoryService } from '../services/category.service';
import { Product, ProductService } from '../services/product.service';
import { UnitService } from '../services/unit.service';
import { UnitsComponent } from "../units/units.component";
import { CategoryComponent } from "../category/category.component";
import { ViewOption, ViewOptions } from '../utils/enums';
import { PaymentComponent } from "../payment/payment.component";
import { StockComponent } from '../stock/stock.component';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, UnitsComponent, CategoryComponent, PaymentComponent, StockComponent],
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})

export class ManagementComponent {
  constructor() { }
  ViewOptions = ViewOptions;
  view: ViewOption = ViewOptions.Categories;
  ngOnInit(): void {

  }


  setView(newView: ViewOption) {
    this.view = newView;
  }
}

