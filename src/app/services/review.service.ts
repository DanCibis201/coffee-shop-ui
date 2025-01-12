import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { Review } from "../models/review";

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private apiUrl = 'https://localhost:7149/api/review';

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true
    };

    constructor(private http: HttpClient) { }

    getAllReviews(): Observable<Review[]> {
        return this.http.get<Review[]>(this.apiUrl, { withCredentials: true});
    }

    getReviewById(id: string): Observable<Review> {
        return this.http.get<Review>(`${this.apiUrl}/${id}`, {withCredentials: true});
    }

    upsertReview(coffeeId: string, userName: string, comment: string, rating: number): Observable<void> {
        const payload = { coffeeId, userName, comment, rating };
        return this.http.post<void>(`${this.apiUrl}/upsert`, payload, {withCredentials: true});
    }

    //Fix this later:
    deleteReview(id: string): Observable<void> {
        const payload = { id };
        return this.http.delete<void>(`${this.apiUrl}/${payload}`, {withCredentials: true});
    }
}