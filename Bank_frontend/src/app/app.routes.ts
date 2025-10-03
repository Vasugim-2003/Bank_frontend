import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

export const routes: Routes = [
 
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  {
    path: 'home',
    loadComponent: () => import('./components/home/home').then(m => m.HomeComponent)
  },
  

  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    canActivate: [GuestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent),
    canActivate: [GuestGuard]
  },

  {
    path: 'admin-login',
    loadComponent: () => import('./components/admin-login/admin-login').then(m => m.AdminLoginComponent)
  },
  

  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard]
  },
  

  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'customer',
    loadComponent: () => import('./components/customer/customer').then(m => m.Customer),
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    loadComponent: () => import('./components/account/account').then(m => m.Account),
    canActivate: [AuthGuard]
  },
  
  { path: '**', redirectTo: '/home' }
];
