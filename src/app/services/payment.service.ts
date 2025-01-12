import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrlCard = 'https://localhost:7149/api/payment/creditcard';
  private apiUrlCash = 'https://localhost:7149/api/payment/cash';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) { }

  processCreditCardPayment(amount: number): Observable<any> {
    return this.http.post<any>(this.apiUrlCard, { amount }, this.httpOptions);
  }

  processCashPayment(amount: number): Observable<any> {
    return this.http.post<any>(this.apiUrlCash, { amount }, this.httpOptions);
  }
}
