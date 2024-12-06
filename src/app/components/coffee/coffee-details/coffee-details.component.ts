import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Coffee } from '../../../models/coffee';
import { ActivatedRoute } from '@angular/router';
import { CoffeeService } from '../../../services/coffee.service';
import { OrderService } from '../../../services/order.service';
import { NotificationService } from '../../../services/notification.service';
import { Subscription, interval } from 'rxjs';
import { CoffeeBrand } from '../../../models/mapping/coffee-brand.enum';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-coffee-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coffee-details.component.html',
  styleUrls: ['./coffee-details.component.css']
})

export class CoffeeDetailsComponent implements OnInit {
  user: any;
  coffee: Coffee | null = null;
  coffeeId: string | null = null;
  currentReview: { userName: string; rating: number; comment: string } | null = null;
  reviewIndex: number = 0;
  reviewSubscription: Subscription | null = null;
  isModalOpen = false;
  quantity: number = 1;
  isLoggedIn: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private coffeeService: CoffeeService,
    private orderService: OrderService,
    private notificationService: NotificationService,
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    const coffeeId = this.route.snapshot.paramMap.get('id');
    if (coffeeId) {
      this.coffeeService.getCoffeeBrandById(coffeeId).subscribe(
        coffee => {
          this.coffee = coffee;
          if (coffee.reviews?.length) {
            this.startReviewRotation();
          }
        },
        error => console.error('Error loading coffee details:', error)
      );
    } else {
      console.error('Coffee ID not found in route parameters');
    }
    this.authService.isLoggedIn$.subscribe((state) => {
      this.isLoggedIn = state;
    });
    this.authService.checkAuth();
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

  getBrandName(brand: number): string {
    return CoffeeBrand[brand]
  }

  //#region PlaceOrderFunctionality
  openOrderModal() {
    this.isModalOpen = true;
  }

  closeOrderModal() {
    this.isModalOpen = false;
    this.quantity = 1;
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  placeOrder() {
    if (this.coffee && this.quantity > 0) {
      const coffeeId = this.coffee.id;
      const order = {
        coffeeId: coffeeId,
        quantity: this.quantity
      };

      this.orderService.placeOrder(order).subscribe(
        response => {
          this.closeOrderModal();
          this.notificationService.showNotification('Order placed successfully!', '#4caf50', 'white')
        },
        error => {
          alert('Failed to place order. Please try again.');
        }
      );
    } else {
      console.error('Invalid order details: coffeeId or quantity is missing');
    }
  }
  //#endregion

  //#region ReviewSwappingFunctionality
  ngOnDestroy(): void {
    this.stopReviewRotation();
  }

  startReviewRotation() {
    this.updateCurrentReview();
    this.reviewSubscription = interval(20000).subscribe(() => {
      this.nextReview();
    });
  }

  stopReviewRotation() {
    this.reviewSubscription?.unsubscribe();
  }

  updateCurrentReview() {
    if (this.coffee?.reviews?.length) {
      this.currentReview = this.coffee.reviews[this.reviewIndex];
    }
  }

  nextReview() {
    if (this.coffee?.reviews?.length) {
      this.reviewIndex = (this.reviewIndex + 1) % this.coffee.reviews.length;
      this.updateCurrentReview();
    }
  }

  goToReview(index: number) {
    this.stopReviewRotation();
    this.reviewIndex = index;
    this.updateCurrentReview();
    this.startReviewRotation();
  }
  //#endregion
}