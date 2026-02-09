import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginData = { email: '', password: '' };
  errorMessage: string = '';

  constructor(private router: Router, private apiService: ApiService) {}

  onLogin() {
    this.apiService.login(this.loginData).subscribe({
      next: (response: any) => {
        // Django returns the user object on success
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('adminName', response.name);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        // Show the specific error from your Django "return Response"
        this.errorMessage = err.error?.error || 'Login Failed';
      }
    });
  }
}