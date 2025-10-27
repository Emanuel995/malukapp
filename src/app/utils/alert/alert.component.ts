import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone:true,
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
  imports: [CommonModule]
})
export class AlertComponent {
  @Input() message: string = '';
  @Input() isError: boolean = false;

  constructor(private cdr: ChangeDetectorRef){}
  ngOnChanges(changes: SimpleChanges) {
    this.message = this.message.split('%')[0]
    if (changes['message'] && this.message) {
      setTimeout(() => {
        this.message = '';
        this.cdr.detectChanges();
      }, 3000);
      
    }
  }  
}