import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminAuth } from '../../services/admin-auth';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login-admin.html',
  styleUrl: './login-admin.css'
})
export class LoginAdmin {
  private auth = inject(AdminAuth);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  errorMessage = signal('');

  handleLogin() {
    this.errorMessage.set('');
    const creds = { email: this.email(), password: this.password() };

    this.auth.login(creds).subscribe({
      next: () => {
        this.router.navigate(['/admin-dashboard']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.error || 'Admin Access Denied.');
      }
    });
  }
}