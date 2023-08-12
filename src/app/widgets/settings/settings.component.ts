import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('isSeller');
    localStorage.removeItem('userAuthUid');
    localStorage.removeItem('sellerAuthUid');
    window.location.reload();
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1000);
    
  }

}
