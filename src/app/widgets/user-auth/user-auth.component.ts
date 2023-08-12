import { Component } from '@angular/core';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent {

  currentTab: string = "login";

  changeTab(status: string) {
    this.currentTab = status;
  }
}
