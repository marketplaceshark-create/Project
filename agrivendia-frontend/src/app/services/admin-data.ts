import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminData {
  private http = inject(HttpClient);

  getAll(endpoint: string): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/${endpoint}`);
  }

  deleteItem(endpoint: string, id: number) {
    return this.http.delete(`${API_URL}/${endpoint}${id}/`);
  }

  createItem(endpoint: string, data: any) {
    return this.http.post(`${API_URL}/${endpoint}`, data);
  }

  // ADD THIS
  updateItem(endpoint: string, id: number, data: any) {
    return this.http.put(`${API_URL}/${endpoint}${id}/`, data);
  }
}