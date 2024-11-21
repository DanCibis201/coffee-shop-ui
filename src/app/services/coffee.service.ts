import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coffee } from '../models/coffee';

@Injectable({
  providedIn: 'root'
})
export class CoffeeService {
  private apiUrl = 'https://localhost:7149/api/coffee';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  };

  constructor(private http: HttpClient) { }

  getCoffeeBrands(): Observable<Coffee[]> {
    return this.http.get<Coffee[]>(this.apiUrl, { withCredentials: true });
  }
  
  getCoffeeBrandById(id: string): Observable<Coffee> {
    return this.http.get<Coffee>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }  
}