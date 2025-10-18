import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isLogin:boolean = false;
  constructor(private authService: AuthService,
              private router: Router ){}

  ngOnInit(){
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLogin = status;
    });
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
