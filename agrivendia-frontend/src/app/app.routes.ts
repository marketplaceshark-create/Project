import { Routes } from '@angular/router';
import { LoginCustomer } from './components/login-customer/login-customer';
import { LoginAdmin } from './components/login-admin/login-admin';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { Market } from './components/market/market'; // Add this

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginCustomer },
  { path: 'admin-login', component: LoginAdmin },
  { path: 'market', component: Market }, // Add this
  { path: 'admin-dashboard', component: AdminDashboard },
  { path: '**', redirectTo: 'login' }
];