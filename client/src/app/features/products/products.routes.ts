import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./product-list/product-list.component').then(c => c.ProductListComponent)
    },
    {
        path: 'create',
        loadComponent: () => import('./product-form/product-form.component').then(c => c.ProductFormComponent)
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./product-form/product-form.component').then(c => c.ProductFormComponent)
    },
    // {
    //     path: ':id',
    //     loadComponent: () => import('./product-detail/product-detail.component').then(c => c.ProductDetailComponent)
    // }
];