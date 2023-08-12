import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerAuthSignupComponent } from './seller-auth-signup.component';

describe('SellerAuthSignupComponent', () => {
  let component: SellerAuthSignupComponent;
  let fixture: ComponentFixture<SellerAuthSignupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SellerAuthSignupComponent]
    });
    fixture = TestBed.createComponent(SellerAuthSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
