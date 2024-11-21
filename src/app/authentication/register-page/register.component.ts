import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})

export class RegisterComponent {
    email = '';
    password = '';
    errorMessage = '';
    isPasswordVisible: boolean = false;

    constructor(private authService: AuthenticationService, private router: Router) { }

    onRegister(): void {
        const registrationPayload = {
            email: this.email,
            password: this.password
        };

        this.authService.register(registrationPayload).subscribe({
            next: () => this.router.navigate(['/login']),
            error: err => this.errorMessage = 'Registration failed. Please insert proper data into both fields.' 
        });
    }

    goToLogin(): void {
        this.router.navigate(['/login']);
    }

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }
}