import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../app.constants';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminData {
  private http = inject(HttpClient);

  // Generic GET: getAll('category/') -> returns list
  getAll(endpoint: string): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/${endpoint}`);
  }

  // Generic DELETE: delete('product/', 5)
  deleteItem(endpoint: string, id: number) {
    return this.http.delete(`${API_URL}/${endpoint}${id}/`);
  }

  // Generic CREATE
  createItem(endpoint: string, data: any) {
    return this.http.post(`${API_URL}/${endpoint}`, data);
  }
}