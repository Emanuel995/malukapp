import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './utils/loading/loading.component';
import { LoadingService } from './services/loading.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, LoadingComponent, AsyncPipe],
  template: `
    <app-loading [isLoading]="(loadingService.isLoading$ | async)!"></app-loading>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(public loadingService: LoadingService) {}
}
