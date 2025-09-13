import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading-overlay" *ngIf="isLoading">
      <div class="spinner"></div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top:0;
      left:0;
      width:100%;
      height:100%;
      background-color: rgba(0,0,0,0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .spinner {
      border: 8px solid #f3f3f3;
      border-top: 8px solid var(--accent-coral); /* color del spinner */
      border-radius: 50%;
      width: 60px;
      height: 60px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `],
  imports:[CommonModule]
})
export class LoadingComponent {
  @Input() isLoading: boolean = false;
}
