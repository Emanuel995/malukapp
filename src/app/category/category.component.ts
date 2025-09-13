import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Category, CategoryService } from '../services/category.service';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { AlertComponent } from '../utils/alert/alert.component';

@Component({
  selector: 'app-category',
  standalone:true,
  imports: [CommonModule, RouterModule, FormsModule, CategoryDetailComponent, AlertComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})

export class CategoryComponent {
  mode : string = 'LIST';
  categories:Category[] = [];
  categorySelected:Category | undefined;
  isError:boolean=false;
  message:string='';
  
  constructor(private categoryService: CategoryService){}

 ngOnInit():void {
  this.categoryService.getCategories().subscribe(categories => {this.categories = categories})
  
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
}
