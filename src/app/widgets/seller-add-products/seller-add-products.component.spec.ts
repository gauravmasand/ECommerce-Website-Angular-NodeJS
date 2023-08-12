import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerAddProductsComponent } from './seller-add-products.component';

describe('SellerAddProductsComponent', () => {
  let component: SellerAddProductsComponent;
  let fixture: ComponentFixture<SellerAddProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellerAddProductsComponent]
    });
    fixture = TestBed.createComponent(SellerAddProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
