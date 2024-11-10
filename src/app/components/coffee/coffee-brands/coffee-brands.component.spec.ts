import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoffeeBrandsComponent } from './coffee-brands.component';

describe('CoffeeBrandsComponent', () => {
  let component: CoffeeBrandsComponent;
  let fixture: ComponentFixture<CoffeeBrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoffeeBrandsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoffeeBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
