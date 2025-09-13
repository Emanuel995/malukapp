import { Component, OnInit  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, CategoryService } from '../services/category.service';
import { Product, ProductService } from '../services/product.service';
import { UnitService } from '../services/unit.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent {
  selectedCategoryId : number = 0;
  categories : Category[] = [];
  filterName : string ='';

  constructor(
    private productService: ProductService, 
    private categoryService:CategoryService,
    private unitService:UnitService
  ){ }

  ngOnInit():void {

  }
  
  search():void{

  }
}
