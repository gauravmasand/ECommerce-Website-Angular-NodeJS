import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from 'src/app/Data';
import { Category } from 'src/app/Models/Category';

@Component({
  selector: 'app-seller-auth-signup',
  templateUrl: './seller-auth-signup.component.html',
  styleUrls: ['./seller-auth-signup.component.css'],
})
export class SellerAuthSignupComponent {
  name!: string;
  phone!: string;
  email!: string;
  password!: string;
  town!: string;
  city!: string;
  state!: string;
  country!: string;
  bankName!: string;
  accountNumber!: string;
  IFSC!: string;
  swiftCode!: string;
  category!: string;
  subCategory!: string;
  idProof!: File;
  loginStatsus: string = 'attempting';
  serverError: string = '';
  imageUrl!: string;
  allCategories!: [Category];
  selectedCategory: Category | undefined;

  onCategoryChange(): void {
    this.selectedCategory = this.allCategories.find(
      (category) => category.name === this.category
    );
  }

  constructor(private http: HttpClient, private router: Router) {
    this.fetchCategory();
  }

  sellerSignUp() {
    const url = Data.domain + Data.auth_api + 'seller-signup';

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('phone', this.phone);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('town', this.town);
    formData.append('city', this.city);
    formData.append('state', this.state);
    formData.append('country', this.country);
    formData.append('bankName', this.bankName);
    formData.append('accountNumber', this.accountNumber);
    formData.append('IFSC', this.IFSC);
    formData.append('swiftCode', this.swiftCode);
    formData.append('category', this.category);
    formData.append('subCategory', this.subCategory);
    formData.append('idProof', this.idProof, this.idProof.name);

    this.http.post(url, formData, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {
        const jsonResponse = response.body;
        const statusCode = response.status;

        if (statusCode == 200) {
          console.log('receved positive response');

          const uid = jsonResponse.uid;

          if (uid != null) {
            localStorage.setItem('sellerAuthUid', uid);
            localStorage.setItem('isSeller', '1');
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
        console.log(error);
      }
    );
  }

  fetchCategory() {
    const url = Data.category;

    console.log(url);

    this.http.get(url, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {
        const jsonResponse = response.body;
        const statusCode = response.status;

        if (statusCode == 200) {
          console.log('receved positive response');

          console.log(jsonResponse);

          this.allCategories = jsonResponse.map((data: any) => {
            const category: Category = new Category();
            category.name = data.name;
            category.subcategories = data.subcategories;
            category.image = data.image;
            return category;
          });

          // this.sellerSignUp();
        }
      },
      (error) => {}
    );
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.idProof = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
    };

    reader.readAsDataURL(file);
  }
}
