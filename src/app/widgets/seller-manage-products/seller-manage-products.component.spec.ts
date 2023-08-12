import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerManageProductsComponent } from './seller-manage-products.component';

describe('SellerManageProductsComponent', () => {
  let component: SellerManageProductsComponent;
  let fixture: ComponentFixture<SellerManageProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellerManageProductsComponent]
    });
    fixture = TestBed.createComponent(SellerManageProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
