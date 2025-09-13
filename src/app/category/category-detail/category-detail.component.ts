import { CommonModule } from '@angular/common';
import { Component, EventEmitter , Input, output, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Category, CategoryService } from '../../services/category.service';
import { AlertComponent } from '../../utils/alert/alert.component';


@Component({
  selector: 'app-category-detail',
  standalone:true,
  imports: [CommonModule, RouterModule, FormsModule, AlertComponent],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css'
})

export class CategoryDetailComponent {
  isError:boolean = false;
  message:string = '';
  categories:Category[] = [];
  category:Category | undefined;
  editable:boolean=true;
  @Input() categorySelected : Category | undefined;
  @Input() mode : string ='';
  @Output() modeChange = new EventEmitter<string>();
  @Output() isErrorChange = new EventEmitter<Boolean>();
  @Output() messageChange = new EventEmitter<string>();
  constructor(private categoryService: CategoryService){}

 ngOnInit():void {
  if (this.mode == 'INS') {
    this.category = {
      id:0,
      name:'',
    }
  }else{
    this.category = this.categorySelected;
  }
 }

 save(){
  this.isError = false;
  this.message = '';
  switch (this.mode) {
    case 'INS':
      if (this.category){
       this.categoryService.createCategory(this.category).subscribe(
        resp =>{
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
      if (this.category){
       this.categoryService.updateCategory(this.category).subscribe(       
        resp =>{
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
 back(){
  this.modeChange.emit('LIST');
 }
}
