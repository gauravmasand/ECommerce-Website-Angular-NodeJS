import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from "../../Data";

@Component({
  selector: 'app-seller-auth-login',
  templateUrl: './seller-auth-login.component.html',
  styleUrls: ['./seller-auth-login.component.css']
})
export class SellerAuthLoginComponent {

  email!: string;
  password!: string;
  loginStatsus: string = 'attempting';
  serverError: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  sellerLogin() {

    const url = Data.domain + Data.auth_api + 'seller-login';
    const body = { email: this.email, password: this.password };

    this.http.post(url, body, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {

        const jsonResponse = response.body;
        const statusCode = response.status;

        if (statusCode == 200) {
          console.log("receved positive response");

          const uid = jsonResponse.uid;

          if (uid!=null) {
            localStorage.setItem('sellerAuthUid', uid)
            localStorage.setItem('isSeller', '1')
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
        console.error("Error:");
        console.error(error);
        this.loginStatsus = "failed";
        console.log("Status Code:", error.status);
      }
    );
    
  }

}
