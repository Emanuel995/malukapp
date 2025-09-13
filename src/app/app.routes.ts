import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { SalesComponent } from './sales/sales.component';
import { ManagementComponent } from './management/management.component';

export const routes: Routes = [
    { path: '', component: HomeComponent,
      children: [
        { path: 'productos', component: ProductsComponent },
        { path: 'productos/edit/:id', component: ProductDetailComponent },
        { path: 'productos/view/:id', component: ProductDetailComponent },
        { path: 'productos/new', component: ProductDetailComponent },
        { path: 'ventas', component:SalesComponent},
        { path: 'gestion',component:ManagementComponent}
      ]
     },
];

