import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Coffee } from '../../../models/coffee';
import { ActivatedRoute } from '@angular/router';
import { CoffeeService } from '../../../services/coffee.service';

@Component({
  selector: 'app-coffee-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coffee-details.component.html',
  styleUrls: ['./coffee-details.component.css']
})

export class CoffeeDetailsComponent implements OnInit {
    coffee: Coffee | null = null;
  
    constructor(
      private route: ActivatedRoute,
      private coffeeService: CoffeeService
    ) {}
  
    ngOnInit(): void {
      const coffeeId = this.route.snapshot.paramMap.get('id');
      if (coffeeId) {
        this.coffeeService.getCoffeeBrandById(coffeeId).subscribe(
          coffee => (this.coffee = coffee),
          error => console.error('Error loading coffee details:', error)
        );
      }
    }
  }