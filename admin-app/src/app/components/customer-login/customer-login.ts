import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-login.component.html',
  styleUrl: './customer-login.component.css'
})
export class CustomerLoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  onLogin() {
    const credentials = { email: this.email, password: this.password };
    
    this.authService.loginCustomer(credentials).subscribe({
      next: (res) => {
        alert('Welcome back, ' + res.name);
        console.log('Customer Data:', res);
        // Here you would redirect to a Customer Dashboard if you had one
      },
      error: (err) => {
        alert('Login Failed');
      }
    });
  }
}