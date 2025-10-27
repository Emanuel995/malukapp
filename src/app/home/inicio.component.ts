import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, ResponseLogin } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../utils/alert/alert.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})

export class InicioComponent {}