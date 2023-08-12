import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerAuthLoginComponent } from './seller-auth-login.component';

describe('SellerAuthLoginComponent', () => {
  let component: SellerAuthLoginComponent;
  let fixture: ComponentFixture<SellerAuthLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellerAuthLoginComponent]
    });
    fixture = TestBed.createComponent(SellerAuthLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
