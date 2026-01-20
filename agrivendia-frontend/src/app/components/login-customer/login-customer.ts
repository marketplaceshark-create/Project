import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerAuth } from '../../services/customer-auth';

@Component({
  selector: 'app-login-customer',
  standalone: true,
  imports: [FormsModule, RouterLink], // RouterLink is for the "Login as Admin" link
  templateUrl: './login-customer.html',
  styleUrl: './login-customer.css'
})
export class LoginCustomer {
  private auth = inject(CustomerAuth);
  private router = inject(Router);

  // State signals
  email = signal('');
  password = signal('');
  errorMessage = signal('');

  handleLogin() {
    this.errorMessage.set(''); // Clear old errors
    const creds = { email: this.email(), password: this.password() };

    this.auth.login(creds).subscribe({
      next: () => {
        this.router.navigate(['/market']); 
      },
      error: (err) => {
        this.errorMessage.set(err.error?.error || 'Login failed. Check Django.');
      }
    });
  }
}