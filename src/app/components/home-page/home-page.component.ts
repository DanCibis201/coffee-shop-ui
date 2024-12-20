import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  images: string[] = [
    'https://images.hdqwalls.com/wallpapers/i-love-coffee.jpg',
    'https://w0.peakpx.com/wallpaper/531/501/HD-wallpaper-coffee-espresso-latte-art-cup-food.jpg',
  ];
  currentImage = 0;
  imageInterval: any;
  messageOfTheDay: string = "Start your day with a cup of joy. Every sip counts!";
  specialOffer: string | null = "Get 20% off on all coffee products this weekend only!";

  ngOnInit() {
    this.startAutoSwitch();
  }

  ngOnDestroy() {
    clearInterval(this.imageInterval);
  }

  prevImage() {
    this.currentImage = (this.currentImage === 0) ? this.images.length - 1 : this.currentImage - 1;
  }

  nextImage() {
    this.currentImage = (this.currentImage === this.images.length - 1) ? 0 : this.currentImage + 1;
  }

  startAutoSwitch() {
    this.imageInterval = setInterval(() => {
      this.nextImage();
    }, 15000);
  }
}
