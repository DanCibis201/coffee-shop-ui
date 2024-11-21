import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    email = '';
    password = '';
    twoFactorCode?: string;
    twoFactorRecoveryCode?: string;
    errorMessage = '';
    isPasswordVisible: boolean = false;

    constructor(private authService: AuthenticationService, private router: Router) { }

    onLogin(): void {
        const loginPayload = {
            email: this.email,
            password: this.password,
            twoFactorCode: this.twoFactorCode,
            twoFactorRecoveryCode: this.twoFactorRecoveryCode
        };

        this.authService.login(loginPayload).subscribe({
            next: () => this.router.navigate(['/']),
            error: err => this.errorMessage = 'Login failed. Please check your credentials.'
        });
    }

    goToRegister(): void {
        this.router.navigate(['/register']);
    }

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }
}