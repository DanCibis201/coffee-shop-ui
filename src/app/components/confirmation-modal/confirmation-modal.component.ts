import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent {
  @Output() confirm: EventEmitter<boolean> = new EventEmitter<boolean>();

  closeModal() {
    this.confirm.emit(false);
  }

  confirmDelete() {
    this.confirm.emit(true);
  }
}
