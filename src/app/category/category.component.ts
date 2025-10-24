import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Category, CategoryService, Filter } from '../services/category.service';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { AlertComponent } from '../utils/alert/alert.component';
import { ModalComponent } from '../utils/modal/modal.component';

@Component({
  selector: 'app-category',
  standalone:true,
  imports: [CommonModule, RouterModule, FormsModule, CategoryDetailComponent, AlertComponent,ModalComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})

export class CategoryComponent {
  mode : string = 'LIST';
  categories:Category[] = [];
  categorySelected:Category | undefined;
  isError:boolean=false;
  message:string='';
  showModal = false;
  selectedProduct: Category | undefined;
  messageModal:string='';
  filter:Filter={};
  
  constructor(private categoryService: CategoryService){}

 ngOnInit():void {
  this.filter.includeDeleted = true;
  this.categoryService.getCategories(this.filter).subscribe(categories => {this.categories = categories})
  
 }
 create(){
  this.mode = 'INS';
  this.categorySelected = {id:0,name:''}
 }
 edit(category:Category){
  this.mode = 'UPD';
  this.categorySelected = category;
 } 
 onModeChanged(newmode:string){
  this.mode = 'LIST';
  this.ngOnInit();
 }

  setSelectCategory(category: Category){
    this.categorySelected = category;
    if (this.categorySelected.is_deleted == false){
      this.messageModal = '¿Está seguro de inactivar la categoria '+ this.categorySelected.name + '?'
    }else{
      this.messageModal = '¿Está seguro de activar la categoria '+ this.categorySelected.name + '?'
    }
    this.showModal = true;
  }

  activate(category: Category) {
    const index = this.categories.findIndex(c => c.id === category.id);
    this.categoryService.activate(category.id).subscribe(
      response => {
        this.categories[index].is_deleted = false
      }
    )
  }
  deactivate(category: Category) {
    const index = this.categories.findIndex(c => c.id === category.id);
    this.categoryService.deactivate(category.id).subscribe(
      response => {
        this.categories[index].is_deleted = true
      }
    )
  }
  confirmModal() {
    if (this.categorySelected) {
      if (this.categorySelected.is_deleted == true) {
        this.activate(this.categorySelected);
      } else {
        this.deactivate(this.categorySelected);
      }
    }
    this.showModal = false;
  }
  cancelModal() {
    this.showModal = false;
    this.messageModal ='';
  }
}
