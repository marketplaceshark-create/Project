import { Routes } from '@angular/router';
import { Login } from './login/login'; // Ensure these paths match your files
import { AdminDashboard} from './admin-dashboard/admin-dashboard';

// 1. Define your routes clearly once
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login},
  { path: 'dashboard', component: AdminDashboard },
];

// Note: If you are using Angular 17+, you usually don't need the @NgModule here 
// because routes are passed directly into the app.config.ts