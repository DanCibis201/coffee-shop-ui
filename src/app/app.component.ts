import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NotificationComponent } from './components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CoffeeShop';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleRouteChange(event.url);
      }
    });
  }
  
  handleRouteChange(url: string): void {
    if (url === '/' || 
        url === '/contact' ||
        url === '/login' || 
        url === '/profile' ||
        url ===  '/register' ) {
      document.body.classList.remove('scrollable-page');
    } else {
      document.body.classList.add('scrollable-page');
    }
  }
}