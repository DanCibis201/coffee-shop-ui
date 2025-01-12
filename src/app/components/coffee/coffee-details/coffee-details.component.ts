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
import { ReviewService } from '../../../services/review.service';

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
  currentReview: {coffeeId: string;  userName: string; comment: string; rating: number } | null = null;
  reviewSubscription: Subscription | null = null;
  
  reviewIndex: number = 0; 
  reviewRating: number = 0;
  quantity: number = 1;
  
  coffeeId: string | null = null;
  errorMessage: string = '';
  reviewText: string = '';
  
  isReviewEditing: boolean = false;
  isLoggedIn: boolean = false;
  isModalOpen = false;
  
  constructor(
    private route: ActivatedRoute,
    private coffeeService: CoffeeService,
    private orderService: OrderService,
    private reviewService: ReviewService,
    private notificationService: NotificationService,
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    const coffeeId = this.route.snapshot.paramMap.get('id');
    if (coffeeId) {
      this.coffeeId = coffeeId;
      this.loadCoffeeDetails(coffeeId);
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

  loadCoffeeDetails(coffeeId: string): void {
    this.coffeeService.getCoffeeBrandById(coffeeId).subscribe(
      coffee => {
        this.coffee = coffee;
        if (coffee.reviews?.length) {
          this.startReviewRotation();
        }
        this.loadUserReview();
      },
      error => console.error('Error loading coffee details:', error)
    );
  }

  loadUserReview(): void {
    if (this.user && this.coffeeId) {
      this.reviewService.getReviewById(this.coffeeId).subscribe({
        next: (review) => {
          if (review.userName === this.user.userName) {
            this.currentReview = review;
            this.reviewText = review.comment;
            this.reviewRating = review.rating;
          } else {
            this.currentReview = null;
          }
        },
        error: (err) => {
          console.error('Error loading review:', err);
        }
      });
    }
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
  
      // Call the upsert API
      this.orderService.upsertOrder(coffeeId, this.quantity).subscribe({
        next: () => {
          this.closeOrderModal();
          this.notificationService.showNotification(
            'Order placed or updated successfully!',
            '#4caf50', 'white'
          );
        },
        error: () => {
          alert('Failed to place or update the order. Please try again.');
        }
      });
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

  //#region ReviewPostingFunctionality
  submitReview() {
    if (!this.reviewText.trim()) {
      alert('Review comment cannot be empty.');
      return;
    }
  
    if (!this.reviewRating || this.reviewRating < 1 || this.reviewRating > 5) {
      alert('Please select a valid rating between 1 and 5.');
      return;
    }
  
    if (this.reviewText.trim() && this.coffeeId && this.user.userName) {
      this.reviewService.upsertReview(this.coffeeId, this.user.userName, 
                                      this.reviewText.trim(), this.reviewRating)
                                      .subscribe({
        next: () => {
          this.notificationService.showNotification(
            'Review submitted successfully!',
            '#4caf50', 'white'
          );
          
          this.reviewText = '';
          this.reviewRating = 0;
          this.isReviewEditing = true;
  
          if (this.coffeeId) {
            this.loadCoffeeDetails(this.coffeeId);
          }
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Failed to submit review. Please try again.');
        }
      });
    } else {
      console.error('Missing required data: coffeeId or userName');
    }
  }

  onRatingSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      this.reviewRating = Number(input.value);
    }
  }
  //#endregion
}