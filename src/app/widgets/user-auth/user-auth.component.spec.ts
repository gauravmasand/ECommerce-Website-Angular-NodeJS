import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuthComponent } from './user-auth.component';

describe('UserAuthComponent', () => {
  let component: UserAuthComponent;
  let fixture: ComponentFixture<UserAuthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserAuthComponent]
    });
    fixture = TestBed.createComponent(UserAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
