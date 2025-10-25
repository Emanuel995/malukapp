import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, ResponseLogin } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../utils/alert/alert.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls:['./login.component.css'],
  standalone:true,
  imports: [CommonModule, RouterModule, FormsModule, AlertComponent]

})
export class LoginComponent {
  email:string = '';
  password:string = '';
  isError:boolean=false;
  errorMessage:string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        console.log('login exitoso')
        this.isError = false;
        this.errorMessage = '';
        this.router.navigate(['']);
      },
      error: (err) => {
        console.log(err.error.message);
        
        this.errorMessage = 'Error al iniciar sesion. '+err.error.message;
        this.isError = true
      }
    });
  }

  recoveryPassword(){
    this.authService.forgotPassword(this.email).subscribe({
      next : (response) => {
        console.log(typeof response);
        console.log('response component ',response);
        this.validResponse(response);
      },
    })
  }

  validResponse(response:ResponseLogin){
    this.isError = response.error ? true : false;
    this.errorMessage = response.message ? response.message : ''
    console.log('isError: ',this.isError,' errorMessge: ',this.errorMessage);
    
  }
}
