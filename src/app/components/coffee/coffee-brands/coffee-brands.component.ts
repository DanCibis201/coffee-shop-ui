import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Coffee } from '../../../models/coffee';
import { CoffeeService } from '../../../services/coffee.service';
import { CoffeeBrand } from '../../../models/mapping/coffee-brand.enum';

@Component({
  selector: 'app-coffee-brands',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coffee-brands.component.html',
  styleUrls: ['./coffee-brands.component.css']
})

export class CoffeeBrandsComponent implements OnInit {
  coffees: Coffee[] = [];
  filteredCoffees: Coffee[] = [];
  brands: { id: number; name: string }[] = [];
  selectedBrand: number | null = null;

  constructor(private coffeeService: CoffeeService, private router: Router) { }

  ngOnInit(): void {
    this.getCoffeeBrands();
    this.getBrands();
  }

  getCoffeeBrands(): void {
    this.coffeeService.getCoffeeBrands()
      .subscribe(coffeeBrands => {
        this.coffees = coffeeBrands
        this.filteredCoffees = coffeeBrands
      });
  }

  viewDetails(coffeeId: string): void {
    this.router.navigate(['/coffee/', coffeeId]);
  }

  getBrandName(brand: number): string {
    return CoffeeBrand[brand]
  }

  getBrands(): void {
    this.brands = Object.keys(CoffeeBrand)
      .filter(key => !isNaN(Number(key)) && +key !== CoffeeBrand.None)
      .map(key => ({ id: +key, name: CoffeeBrand[+key] }));
  }
  
  filterByBrand(): void {
    if (this.selectedBrand !== null) {
      this.filteredCoffees = this.coffees.filter(coffee => coffee.brand === this.selectedBrand);
    } else {
      this.filteredCoffees = [...this.coffees];
    }
  }

  toggleBrand(brandId: number): void {
    if (this.selectedBrand === brandId) {
      this.selectedBrand = null;
      this.filteredCoffees = [...this.coffees];
    } else {
      this.selectedBrand = brandId;
      this.filteredCoffees = this.coffees.filter(coffee => coffee.brand === brandId);
    }
  }
}