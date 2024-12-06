import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CoffeeBrandsComponent } from './components/coffee/coffee-brands/coffee-brands.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CoffeeDetailsComponent } from './components/coffee/coffee-details/coffee-details.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactComponent } from './components/contact/contact.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { LoginComponent } from './authentication/login-page/login.component';
import { LogoutComponent } from './authentication/logout.component';
import { RegisterComponent } from './authentication/register-page/register.component';
import { ProfilePageComponent } from './authentication/profile-page/profile-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'coffee-brands', component: CoffeeBrandsComponent },
      { path: 'coffee/:id', component: CoffeeDetailsComponent},
      { path: 'about-us', component: AboutUsComponent},
      { path: 'contact', component: ContactComponent},
      { path: 'orders', component: OrderDetailsComponent},
      { path: 'login', component: LoginComponent},
      { path: 'logout', component: LogoutComponent},
      { path: 'register', component: RegisterComponent},
      { path: 'profile', component: ProfilePageComponent}
    ]
  }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes), provideAnimationsAsync()
  ]
};