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
}