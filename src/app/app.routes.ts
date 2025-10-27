import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { SalesComponent } from './sales/sales.component';
import { ManagementComponent } from './management/management.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login.component';
import { ResetPasswordComponent } from './auth/reset-password.component';
import { InicioComponent } from './home/inicio.component';

export const routes: Routes = [
    { path: '', component: HomeComponent,
      children: [
        { path: 'productos', component: ProductsComponent, canActivate: [AuthGuard] },
        { path: 'productos/edit/:id', component: ProductDetailComponent, canActivate: [AuthGuard] },
        { path: 'productos/view/:id', component: ProductDetailComponent, canActivate: [AuthGuard] },
        { path: 'productos/new', component: ProductDetailComponent, canActivate: [AuthGuard] },
        { path: 'ventas', component:SalesComponent, canActivate: [AuthGuard]},
        { path: 'gestion',component:ManagementComponent, canActivate: [AuthGuard]},
        { path: 'compras',component:PurchaseComponent, canActivate: [AuthGuard]},
        { path: 'login', component: LoginComponent },
        { path: 'reset-password', component: ResetPasswordComponent },
        { path: '',component:InicioComponent}
      ]
     },
];

