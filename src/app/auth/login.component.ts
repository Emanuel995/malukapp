import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, ResponseLogin } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../utils/alert/alert.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AlertComponent]

})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isError: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe({
        next: () => {
          console.log('login exitoso')
          this.isError = false;
          this.errorMessage = '';
          this.router.navigate(['']);
        },
        error: (err) => {
          console.log(err.error.message);

          this.errorMessage = 'Error al iniciar sesion. ' + err.error.message + ' % ' + new Date().toUTCString();
          this.isError = true
        }
      });
    }else{
        this.errorMessage = 'Ingrese su Email y Contraseña' + ' % ' + new Date().toUTCString();
        this.isError = true      
    }
  }

  recoveryPassword() {
    if (this.email) {
      this.authService.forgotPassword(this.email).subscribe({
        next: (response) => {
          console.log(typeof response);
          console.log('response component ', response);
          this.validResponse(response);
        },
      })
    } else {
      this.errorMessage = 'Ingrese su Email para recuperar su contraseña' + ' % ' + new Date().toUTCString();
      this.isError = true
    }
  }

  validResponse(response: ResponseLogin) {
    this.isError = response.error ? true : false;
    this.errorMessage = response.message ? response.message + '%' + new Date().toUTCString() : ''
    console.log('isError: ', this.isError, ' errorMessge: ', this.errorMessage);

  }
}
