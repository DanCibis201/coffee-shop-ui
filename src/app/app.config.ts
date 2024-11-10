import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CoffeeBrandsComponent } from './components/coffee/coffee-brands/coffee-brands.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CoffeeDetailsComponent } from './components/coffee/coffee-details/coffee-details.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'coffee-brands', component: CoffeeBrandsComponent },
      { path: 'coffee/:id', component: CoffeeDetailsComponent}
    ]
  }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes), provideAnimationsAsync()
  ]
};