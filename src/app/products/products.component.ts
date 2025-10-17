import { Component, OnInit  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product, ProductFilter, ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, CategoryService } from '../services/category.service';
import { map } from 'rxjs';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})


export class ProductsComponent implements OnInit{
  products: Product[] = [];
  filterProducts : Product[] = [];
  filterName:string ='';
  categories:Category[] = [];
  selectedCategoryId:string='';
  filters : ProductFilter = {};
  selectedStateId:string='all';

  constructor(private productService: ProductService, private categoryService:CategoryService){ }
  
  ngOnInit():void {
    this.categoryService.getCategories().subscribe(
      categories => {
        this.categories = categories;
      }
    );
    this.selectedStateId = 'all';
    this.filters.includeDeleted = true;
    this.productService.getProducts(this.filters).subscribe(products =>{
      this.products = products;
      this.filterProducts = products;
    });
    
  }

  search():void{
    const filter = this.filterName.toLowerCase().trim();
    const categoryId = Number(this.selectedCategoryId);
    this.filterProducts = this.products;  
    
    if (this.selectedStateId !== 'all'){
      let isDeleted : boolean;
      isDeleted =  this.selectedStateId === 'true' ? false : true;
      console.log(isDeleted);
      this.filterProducts = this.filterProducts.filter(p => p.is_deleted === isDeleted)
    }
    if (filter.length > 0){
      this.filterProducts = this.products.filter(p => p.name.toLowerCase().trim().includes(filter));
      
    }
    if (categoryId > 0){
      this.filterProducts = this.filterProducts.filter(p => p.category_id == categoryId);
    }
    
  }
  activate(product:Product){
    const index = this.filterProducts.findIndex(p => p.id === product.id);
    this.productService.activateProduct(product).subscribe(
      response => {
        this.filterProducts[index].is_deleted = false
      }
    )
  }
  deactivate(product:Product){
    const index = this.filterProducts.findIndex(p => p.id === product.id);
    this.productService.deactivateProduct(product).subscribe(
      response => {
        this.filterProducts[index].is_deleted = true
      }
    )
  }
}
