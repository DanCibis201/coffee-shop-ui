import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  isLoggedIn: boolean = false;
  private timeoutId: any;
  
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((state) => {
      this.isLoggedIn = state;
    });
    this.authService.checkAuth();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        console.error('Failed to log out.');
      }
    });
  }

  showDropdown(): void {
    const dropdown = document.getElementById('dropdownContent');
    if (dropdown) {
      clearTimeout(this.timeoutId);
      dropdown.style.display = 'block';
    }
  }

  hideDropdown(): void {
    this.timeoutId = setTimeout(() => {
      const dropdown = document.getElementById('dropdownContent');
      if (dropdown) {
        dropdown.style.display = 'none';
      }
    }, 50);
  }
}
