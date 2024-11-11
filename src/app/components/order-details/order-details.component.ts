import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Coffee } from '../../models/coffee';
import { CoffeeService } from '../../services/coffee.service';
import { ConfirmationModalModule } from '../confirmation-modal/confirmation-modal.module';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  orders: Order[] = [];
  coffeeDetailsMap: { [key: string]: Coffee } = {};
  selectedOrderId: string | null = null;
  isModalVisible: boolean = false;

  constructor(
    private orderService: OrderService,
    private coffeeService: CoffeeService
) {}

ngOnInit(): void {
    this.orderService.getAllOrders().subscribe(
      (orders) => {
        this.orders = orders;
        this.fetchCoffeeDetails(orders);
      },
      (error) => console.error('Error loading orders:', error)
    );
  }

  fetchCoffeeDetails(orders: Order[]): void {
    orders.forEach((order) => {
      if (order.coffeeId && !this.coffeeDetailsMap[order.coffeeId]) {
        this.coffeeService.getCoffeeBrandById(order.coffeeId).subscribe(
          (coffee) => {
            this.coffeeDetailsMap[order.coffeeId] = coffee;
          },
          (error) => console.error('Error loading coffee details:', error)
        );
      }
    });
  }
  
  openDeleteConfirmation(orderId: string): void {
    this.selectedOrderId = orderId;
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedOrderId = null;
  }

  deleteOrder(orderId: string): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(orderId).subscribe(() => {
        this.orders = this.orders.filter(order => order.id !== orderId);
        alert('Order deleted successfully.');
      }, error => {
        alert('Failed to delete the order. Please try again.');
      });
    }
  }

  cancelDelete(): void {
    this.closeModal();
  }

  calculateOrderTotal(coffeeId: string, quantity: number): number {
    const coffee = this.coffeeDetailsMap[coffeeId];
    if (coffee) {
      return coffee.price * quantity;
    }
    return 0;
  }

  calculateTotalPrice(): number {
    return this.orders.reduce((total, order) => {
      return total + this.calculateOrderTotal(order.coffeeId, order.quantity);
    }, 0);
  }
}