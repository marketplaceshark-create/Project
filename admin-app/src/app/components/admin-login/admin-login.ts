import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Required for [(ngModel)]
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    const credentials = { email: this.email, password: this.password };
    
    this.authService.loginAdmin(credentials).subscribe({
      next: (res) => {
        alert('Admin Login Success!');
        // Store session logic if needed
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert('Login Failed: ' + (err.error.error || 'Check console'));
        console.error(err);
      }
    });
  }
}