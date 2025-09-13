import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['message'] && this.message) {
      // Borrar mensaje después de duration
      setTimeout(() => this.message = '', 3000);
    }
  }  
}