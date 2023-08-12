import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from 'src/app/Data';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent {

  name: string = "Demo";
  email!: string;
  password!: string;
  town!: string;
  city!: string;
  state!: string;
  country!: string;
  loginStatsus: string = 'attempting';
  serverError: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  userSignup() {

    const url = Data.domain + Data.auth_api + 'signup';

    const body = { name: this.name, email: this.email, password: this.password, town: this.town, city: this.city, state: this.state, country: this.country};

    this.http.post(url, body, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {

        const jsonResponse = response.body;
        const statusCode = response.status;

        if (statusCode == 200) {
          console.log("receved positive response");

          const uid = jsonResponse.uid;

          if (uid!=null) {
            localStorage.setItem('userAuthUid', uid)
            localStorage.setItem('isSeller', '0')
            this.loginStatsus = "success";

            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1000);

          } else {

            const error = jsonResponse.error;
            this.serverError = error;

          }
        };
      },
      (error) => {
        this.loginStatsus = "failed";
        console.log("Status Code:", error.status);
      }
    );
    
  }


}
