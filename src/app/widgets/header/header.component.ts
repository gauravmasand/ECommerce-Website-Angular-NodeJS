import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Data } from 'src/app/Data';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  searchForm: FormGroup;

  currentPage: String = 'home';
  userUid: number = -1;
  sellerUid: number = -1;

  loginVisibility: boolean = true;
  isSeller: boolean = false;
  hasOrders: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {

    const isSellerLocalVar = localStorage.getItem('isSeller');
    if (isSellerLocalVar) {
      if (isSellerLocalVar == '0') {
        this.isSeller = false;
      } else {
        this.isSeller = true;
      }
    }

    const uid = localStorage.getItem('userAuthUid');
    if (uid) {
      this.userUid = Number.parseInt(uid);
      if (this.userUid > 0) {
        this.loginVisibility = false;
      }
    }

    const sellerUidLocalVar = localStorage.getItem('sellerAuthUid');
    if (sellerUidLocalVar) {
      this.sellerUid = Number.parseInt(sellerUidLocalVar);
      if (this.sellerUid > 0) {
        this.loginVisibility = false;
      }
    }

    this.searchForm = this.formBuilder.group({
      searchQuery: [''],
    });

    this.checkOrders();
  }

  ngOnInit() {}

  checkOrders() {
    const isSellerLocalVar = localStorage.getItem('isSeller');
    console.log(isSellerLocalVar);
    let sendUid;

    if (isSellerLocalVar) {
      if (isSellerLocalVar == '0') {
        sendUid = localStorage.getItem('userAuthUid');
      } else {
        sendUid = localStorage.getItem('sellerAuthUid');
      }
    }
  
    const url = Data.check_orders + sendUid;

    console.log(url);

    this.http.get(url, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {
        const jsonResponse = response.body;
        const statusCode = response.status;

        if (statusCode == 200) {
          this.hasOrders = jsonResponse.hasOrders;
        }
      },
      (error) => {
        if (error.status == 500) {
          this.hasOrders = false;
        }
        console.error('Error:');
        console.error(error);
        console.log('Status Code:', error.status);
      }
    );
  }

  submitSearch() {
    const searchQueryControl = this.searchForm.get('searchQuery');
    if (searchQueryControl && searchQueryControl.value) {
      const searchQuery = searchQueryControl.value;
      this.router.navigate(['/search'], { queryParams: { s: searchQuery } });
    }
  }

  changeNavPage(page: string) {
    this.currentPage = page;
  }
}
