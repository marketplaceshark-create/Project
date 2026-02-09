import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }

  // Auth
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/login/`, credentials);
  }

  // GET
  getAll(endpoint: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${endpoint}/`);
  }

  // POST (This was missing!)
  postData(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${endpoint}/`, data);
  }
  // Add this to your ApiService class
update(endpoint: string, id: any, data: any): Observable<any> {
  // This sends a PUT request to http://127.0.0.1:8000/customer/56/
  return this.http.put(`${this.baseUrl}/${endpoint}/${id}/`, data);
}

  // DELETE
  delete(endpoint: string, id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${endpoint}/${id}/`);
  }
}