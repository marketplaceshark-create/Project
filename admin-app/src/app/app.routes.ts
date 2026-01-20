import { Routes } from '@angular/router';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { CustomerLoginComponent } from './components/customer-login/customer-login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'customer-login', pathMatch: 'full' }, // Default
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'customer-login', component: CustomerLoginComponent },
  { path: 'dashboard', component: DashboardComponent } // Protected Area
];