import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Data } from 'src/app/Data';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})

export class UserLoginComponent {
  email!: string;
  password!: string;
  loginStatsus: string = 'attempting';
  serverError: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  userLogin() {
    const url = Data.domain + Data.auth_api + 'login';
    const body = { email: this.email, password: this.password };

    this.http.post(url, body, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {

        const jsonResponse = response.body;
        const statusCode = response.status;

        if (statusCode == 200) {

          const uid = jsonResponse.uid;

          if (uid != null) {
          
            console.log(uid)
            localStorage.setItem('userAuthUid', uid);
            localStorage.setItem('isSeller', '0');
            this.loginStatsus = 'success';

            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1000);

          } else {

            const error = jsonResponse.error;
            this.serverError = error;

          }

        }

      },
      (error) => {
        console.error('Error:');
        console.error(error);
        this.loginStatsus = 'failed';
        console.log('Status Code:', error.status);
      }
    );
  }
}
