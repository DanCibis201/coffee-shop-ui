import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-logout',
    standalone: true,
    template: ''
})
export class LogoutComponent implements OnInit {
    errorMessage = '';

    ngOnInit(): void {
        this.onLogout();
      }

    constructor(private authService: AuthenticationService, private router: Router) { }

    onLogout(): void {
        this.authService.logout().subscribe({
            next: () => this.router.navigate(['/']),
            error: () => this.errorMessage = "Logout failed. Cannot log out if you're not logged in."
        });
    }
}