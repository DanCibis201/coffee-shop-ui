import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Coffee } from '../../../models/coffee';
import { CoffeeService } from '../../../services/coffee.service';

@Component({
  selector: 'app-coffee-brands',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coffee-brands.component.html',
  styleUrls: ['./coffee-brands.component.css']
})
export class CoffeeBrandsComponent implements OnInit {
  coffees: Coffee[] = [];
  newCoffee: Omit<Coffee, 'id'> = {
    name: '',
    price: 0,
    description: '',
    imageUrl: ''
  };

  constructor(private coffeeService: CoffeeService, private router: Router) { }

  ngOnInit(): void {
    this.getCoffeeBrands();
  }

  getCoffeeBrands(): void {
    this.coffeeService.getCoffeeBrands()
      .subscribe(coffeeBrands => this.coffees = coffeeBrands);
  }

  viewDetails(coffeeId: string): void {
    this.router.navigate(['/coffee/', coffeeId]);
  }
  
}
