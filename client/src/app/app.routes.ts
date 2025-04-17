import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(c => c.RegisterComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'products',
        loadChildren: () => import('./features/products/products.routes').then(r => r.PRODUCTS_ROUTES),
        canActivate: [authGuard]
    },
    {
        path: 'categories',
        loadChildren: () => import('./features/categories/categories.routes').then(r => r.CATEGORIES_ROUTES),
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: '/dashboard' }
];