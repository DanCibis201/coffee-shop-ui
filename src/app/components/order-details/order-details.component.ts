import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Coffee } from '../../models/coffee';
import { CoffeeService } from '../../services/coffee.service';
import { ConfirmationModalModule } from '../confirmation-modal/confirmation-modal.module';
import { NotificationService } from '../../services/notification.service';
import { PaymentService } from '../../services/payment.service';

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
  newQuantity: number | null = null;
  isEditModalVisible: boolean = false;
  isDeleteModalVisible: boolean = false;
  isPaymentModalVisible: boolean = false;
  selectedPaymentMethod: string | null = null

  constructor(
    private orderService: OrderService,
    private coffeeService: CoffeeService,
    private notificationService: NotificationService,
    private paymentService: PaymentService,
  ) { }

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

  //#region Payment
  openPaymentModal(): void {
    this.isPaymentModalVisible = true;
  }

  closePaymentModal(): void {
    this.isPaymentModalVisible = false;
    this.selectedPaymentMethod = null;
  }

  processPayment(): void {
    if (this.selectedPaymentMethod) {
      const amount = this.calculateTotalPrice();
      let paymentObservable;
  
      if (this.selectedPaymentMethod === 'card') {
        paymentObservable = this.paymentService.processCreditCardPayment(amount);
      } else if (this.selectedPaymentMethod === 'cash') {
        paymentObservable = this.paymentService.processCashPayment(amount);
      }
  
      if (paymentObservable) {
        paymentObservable.subscribe(
          (response) => {
            this.notificationService.showNotification(response.message, 'green', 'white');
            this.closePaymentModal();
          },
          (error) => {
            console.error('Error:', error);
            alert('Failed to process payment. Please try again.');
          }
        );
      } else {
        alert('Please select a valid payment method.');
      }
    } else {
      alert('Please select a payment method.');
    }
  }
  //#endregion

  //#region DeleteOrderDetails
  openDeleteModal(orderId: string): void {
    this.selectedOrderId = orderId;
    this.isDeleteModalVisible = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalVisible = false;
    this.selectedOrderId = null;
  }

  cancelDelete(): void {
    this.closeDeleteModal();
  }

  confirmDeleteOrder(): void {
    if (this.selectedOrderId) {
      this.orderService.deleteOrder(this.selectedOrderId).subscribe(
        () => {
          this.orders = this.orders.filter(order => order.id !== this.selectedOrderId);
          this.closeDeleteModal();
          this.notificationService.showNotification('Order deleted successfuly!', 'red', 'white');
        },
        error => {
          alert('Failed to delete the order. Please try again.');
          this.closeDeleteModal();
        }
      );
    }
  }
  //#endregion

  //#region EditOrderDetails
  openEditModal(orderId: string, currentQuantity: number): void {
    this.selectedOrderId = orderId;
    this.newQuantity = currentQuantity;
    this.isEditModalVisible = true;
  }

  closeEditModal(): void {
    this.isEditModalVisible = false;
    this.selectedOrderId = null;
    this.newQuantity = null;
  }

  updateOrder(): void {
    if (this.selectedOrderId && this.newQuantity !== null) {
      const updatedOrder = {
        id: this.selectedOrderId,
        coffeeId: this.orders.find(order => order.id === this.selectedOrderId)?.coffeeId,
        quantity: this.newQuantity,
        orderDate: new Date,
      } as Order;

      this.orderService.updateOrder(updatedOrder).subscribe(() => {
        const orderIndex = this.orders.findIndex(order => order.id === this.selectedOrderId);
        if (orderIndex !== -1) {
          this.orders[orderIndex] = updatedOrder;
        }
        this.notificationService.showNotification('Order updated successfully!', '#FFD700', 'black');
        this.closeEditModal();
      }, error => {
        alert('Failed to update the order. Please try again.');
      });
    }
  }
  //#endregion
}