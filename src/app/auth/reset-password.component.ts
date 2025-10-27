import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService, ResponseLogin } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../utils/alert/alert.component';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, AlertComponent]

})

export class ResetPasswordComponent {
    email: string = '';
    password: string = '';
    confirmpassword: string = '';
    isError: boolean = false;
    errorMessage: string = '';
    token_PARM: string  = '';
    constructor(private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit(): void {
        this.token_PARM = String(this.route.snapshot.queryParamMap.get('token'));
    }

    resetPassword(password: string, confirmpassword: string) {
        if (this.validatePassword(password,confirmpassword)){
            this.resetPasswordService(password)
        }
    }

    validatePassword(password: string, confirmpassword: string) {
        if (this.token_PARM) {
            if (password === confirmpassword) {
                console.log('contraseñas validas');
                return true
            } else {
                console.log('contraseñas invalidas');
                return false
            }
        }else{
            console.log('token invalido');
            return false
        }
    }

    resetPasswordService(newPassword:string){
        this.authService.resetPassword(this.token_PARM,newPassword).subscribe({
            next: (response)=>{ this.validResponse(response); this.router.navigate(['/login']);}
        
        });
    }

    validResponse(response: ResponseLogin) {
        this.isError = response.error ? true : false;
        this.errorMessage = response.message ? response.message + ' % ' + new Date().toUTCString() : ''

    }
}