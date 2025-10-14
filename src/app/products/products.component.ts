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

  constructor(private productService: ProductService, private categoryService:CategoryService){ }
  
  ngOnInit():void {
    this.categoryService.getCategories().subscribe(
      categories => {
        this.categories = categories;
      }
    );
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
    if (filter.length > 0){
      this.filterProducts = this.products.filter(p => p.name.toLowerCase().trim().includes(filter));
      
    }
    if (categoryId > 0){
      this.filterProducts = this.filterProducts.filter(p => p.category_id == categoryId);
    }
    
  }
  activate(product:Product){
    this.productService.activateProduct(product).subscribe(
      response => {
      }
    )
  }
  deactivate(product:Product){
    this.productService.deactivateProduct(product).subscribe(
      response => console.log(response)
    )
  }
}
