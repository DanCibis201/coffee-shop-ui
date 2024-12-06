import { Component, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { NotificationService } from "../../services/notification.service";

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="notification" *ngIf="notification" [ngStyle]="{ 'background-color': backgroundColor, 'color' : textColor}">
      {{ notification.message }}
    </div>
  `,
    styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  notification: { message: string, backgroundColor: string } | null = null;
  backgroundColor: string = '#4caf50';
  textColor: string = 'white';

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notification$.subscribe((notification) => {
      this.notification = notification;
      this.backgroundColor = notification.backgroundColor;
      this.textColor = notification.textColor;
      setTimeout(() => {
        this.notification = null;
      }, 3000);
      });
    }
}