import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent { 
    user: any;
    errorMessage: string = '';

    constructor(private authService: AuthenticationService, private router: Router) { }

    ngOnInit(): void {
        this.authService.getUserInfo().subscribe({
            next: (userData) => {
                this.user = userData;
            },
            error: (err) => {
                this.errorMessage = 'Failed to load user information';
                console.error(err);
            }
        });
    }
}