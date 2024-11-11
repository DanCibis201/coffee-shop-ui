import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Coffee } from '../../../models/coffee';
import { ActivatedRoute } from '@angular/router';
import { CoffeeService } from '../../../services/coffee.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-coffee-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coffee-details.component.html',
  styleUrls: ['./coffee-details.component.css']
})

export class CoffeeDetailsComponent implements OnInit {
  coffee: Coffee | null = null;
  isModalOpen = false;
  quantity: number = 1;
  coffeeId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private coffeeService: CoffeeService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    const coffeeId = this.route.snapshot.paramMap.get('id');
    if (coffeeId) {
      this.coffeeService.getCoffeeBrandById(coffeeId).subscribe(
        coffee => {
          this.coffee = coffee;
        },
        error => console.error('Error loading coffee details:', error)
      );
    } else {
      console.error('Coffee ID not found in route parameters');
    }
  }

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
          alert('Order placed successfully!');
          this.closeOrderModal();
        },
        error => {
          alert('Failed to place order. Please try again.');
        }
      );
    } else {
      console.error('Invalid order details: coffeeId or quantity is missing');
    }
  }
}