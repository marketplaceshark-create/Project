import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../app.constants';
import { Admin } from '../interfaces/admin.interface';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminAuth {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  currentAdmin = signal<Admin | null>(null);

  constructor() { 
    if (isPlatformBrowser(this.platformId)) {
      this.checkSession(); 
    }
  }

  login(creds: any): Observable<Admin> {
    return this.http.post<Admin>(`${API_URL}/user/login/`, creds).pipe(
      tap(admin => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentAdmin', JSON.stringify(admin));
        }
        this.currentAdmin.set(admin);
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentAdmin');
    }
    this.currentAdmin.set(null);
  }

  private checkSession() {
    const saved = localStorage.getItem('currentAdmin');
    if (saved) this.currentAdmin.set(JSON.parse(saved));
  }
}