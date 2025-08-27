// src/app/product-detail/product-detail.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../services/product.service';
import { CategoryService, Category } from '../services/category.service';
import { Unit, UnitService } from '../services/unit.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  product: Product | undefined;
  editable:boolean = false;
  mode:string ='';
  categories: Category[] = [];
  units : Unit[] = [];

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private productService: ProductService,
    private categoryService: CategoryService,
    private unitService : UnitService
  ){}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => {this.categories = categories});
    this.units = this.unitService.getUnits();
    this.route.url.subscribe(segments => {
      if (segments.some(seg => seg.path === 'new')) {
        this.mode ='INS';
      } else if (segments.some(seg => seg.path === 'view')) {
        this.mode ='DSP';
      } else if (segments.some(seg => seg.path === 'edit')) {
        this.mode ='UPD';
      }
    });

    this.editable = false;
    if (this.mode == 'INS' || this.mode == 'UPD'){
      this.editable = true;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if(id){
      this.productService.getProducts().subscribe(products =>{
        this.product = products.find(product => product.id === id)
    });
    }else{
      this.product = {
        id: 0,
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category_id:0,
        category_name:"",
        unit_id:0,
        unit_name:""
      }
    } 
  }

  save(){
    if (this.mode == 'INS'){
      if(this.product){
        this.productService.createProduct(this.product).subscribe({
          next: () => {this.router.navigate(['/productos'])},
          error : (error) => {console.log(error.error.error)}
        });
      }
    }
    if(this.mode == 'UPD'){
       if(this.product){
         this.productService.updateProduct(this.product);
         this.router.navigate(['/productos']);
      }     
    }
  }


}
