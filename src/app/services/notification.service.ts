import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private notificationSubject = new Subject<{
        message: string, 
        backgroundColor: string, 
        textColor: string}>();

    notification$ = this.notificationSubject.asObservable();

    showNotification(message: string, backgroundColor: string, textColor: string) {
        this.notificationSubject.next({message, backgroundColor, textColor});
    }
}