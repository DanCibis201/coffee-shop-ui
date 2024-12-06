import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private baseUrl = 'https://localhost:7149';
    private loggedIn = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {}

    isLoggedIn$ = this.loggedIn.asObservable();

    login(data: { email: string; password: string; twoFactorCode?: string; twoFactorRecoveryCode?: string }): Observable<any> {
        const params = new URLSearchParams({
            useCookies: 'true',
            useSessionCookies: 'true'
        });
        return this.http.post(`${this.baseUrl}/login?${params.toString()}`, data, { withCredentials: true }).pipe(
            tap(() => this.loggedIn.next(true))
        );
    }

    logout(): Observable<any> {
        return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).pipe(
            tap(() => this.loggedIn.next(false))
        );
    }

    register(data: { email: string; password: string }): Observable<any> {
        return this.http.post(`${this.baseUrl}/register`, data, { withCredentials: true });
    }

    checkAuth(): void {
        this.getUserInfo().subscribe({
            next: () => this.loggedIn.next(true),
            error: () => this.loggedIn.next(false)
        });
    }

    getUserInfo(): Observable<any> {
        return this.http.get(`${this.baseUrl}/users/me`, { withCredentials: true });
    }
}