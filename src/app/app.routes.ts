import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent,
      children: [
        { path: 'productos', component: ProductsComponent },
        { path: 'productos/edit/:id', component: ProductDetailComponent },
        { path: 'productos/view/:id', component: ProductDetailComponent },
        { path: 'productos/new', component: ProductDetailComponent },
      ]
     },
];

