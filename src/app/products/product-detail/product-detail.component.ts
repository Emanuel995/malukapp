// src/app/product-detail/product-detail.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product, ProductFilter } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';
import { Unit, UnitService } from '../../services/unit.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../../utils/alert/alert.component';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule,RouterModule,FormsModule, AlertComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  product: Product | undefined;
  editable:boolean = false;
  mode:string ='';
  categories: Category[] = [];
  units : Unit[] = [];
  isError:boolean = false;
  message:string = '';
  filters : ProductFilter = {};

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private productService: ProductService,
    private categoryService: CategoryService,
    private unitService : UnitService
  ){}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => {this.categories = categories});
    this.unitService.getUnits().subscribe(units => {this.units = units});
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
      this.filters.includeDeleted=true;
      this.productService.getProducts(this.filters).subscribe(products =>{
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
        unit_name:"",
        is_deleted:false
      }
    } 
  }
  volver(){
    this.router.navigateByUrl('/productos');
  }
  save(){
    this.isError = false;
    this.message = '';
    if (this.mode == 'INS'){
      if(this.product){
        this.productService.createProduct(this.product).subscribe(
          resp =>{
            this.isError = resp.isError;
            this.message = resp.message;
            if (this.isError == false){
              this.router.navigate(['/productos'])
            }
          }
        );
      }
    }
    if(this.mode == 'UPD'){
       if(this.product){
         this.productService.updateProduct(this.product).subscribe(
            resp =>{
              this.isError = resp.isError;
              this.message = resp.message;
              if (this.isError == false){
                this.router.navigate(['/productos'])
              }
            } 
         );
         
      }     
    }
  }


}
