import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private baseUrl = 'https://localhost:7149';

    constructor(private http: HttpClient) { }

    login(data: { email: string; password: string; twoFactorCode?: string; twoFactorRecoveryCode?: string }): Observable<any> {
        const params = new URLSearchParams({
            useCookies: 'true',
            useSessionCookies: 'true'
        });
        return this.http.post(`${this.baseUrl}/login?${params.toString()}`, data, { withCredentials: true });
    }

    logout(): Observable<any> {
        return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true });
    }

    register(data: { email: string; password: string }): Observable<any> {
        return this.http.post(`${this.baseUrl}/register`, data, { withCredentials: true });
    }
}