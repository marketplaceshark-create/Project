import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core'; // Added PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // Added this
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../app.constants';
import { Customer } from '../interfaces/customer.interface';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomerAuth {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID); // Inject Platform ID
  
  currentUser = signal<Customer | null>(null);

  constructor() { 
    // ONLY check session if we are in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.checkSession(); 
    }
  }

  login(creds: any): Observable<Customer> {
    return this.http.post<Customer>(`${API_URL}/customer/login/`, creds).pipe(
      tap(user => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentCustomer', JSON.stringify(user));
        }
        this.currentUser.set(user);
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentCustomer');
    }
    this.currentUser.set(null);
  }

  private checkSession() {
    const saved = localStorage.getItem('currentCustomer');
    if (saved) this.currentUser.set(JSON.parse(saved));
  }
}