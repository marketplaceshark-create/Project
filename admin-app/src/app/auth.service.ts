import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Your Django Backend URL
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }

  // --- ADMIN ACTIONS ---
  
  // 1. Admin Login (POST /user/login/)
  loginAdmin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/login/`, data);
  }

  // --- CUSTOMER ACTIONS ---

  // 2. Customer Login (POST /customer/login/)
  loginCustomer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/customer/login/`, data);
  }

  // 3. Get All Customers (GET /customer/)
  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/customer/`);
  }

  // 4. Update Customer (PUT /customer/id/) - Used for Image Upload
  updateCustomer(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/customer/${id}/`, data);
  }
}