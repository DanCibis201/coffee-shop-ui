import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Coffee } from '../models/coffee';

@Injectable({
  providedIn: 'root'
})
export class CoffeeService {
  private apiUrl = 'https://localhost:7149/api/coffee';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getCoffeeBrands(): Observable<Coffee[]> {
    return this.http.get<Coffee[]>(this.apiUrl);
  }

  getCoffeeBrandById(id: string): Observable<Coffee> {
    return this.http.get<Coffee>(`${this.apiUrl}/${id}`);
  }
}