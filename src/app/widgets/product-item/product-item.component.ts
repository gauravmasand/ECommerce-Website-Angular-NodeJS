import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from 'src/app/Data';
import { Products } from 'src/app/Models/Products';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
})
export class ProductItemComponent implements OnInit {
  image_path: string = Data.domain + '/product_images/';

  @Input() product!: Products;
  price: number = 200;
  discount: number = 51;
  userUid: number = -1;
  sellerUid: number = -1;

  ngOnInit() {
    this.discount = Number(this.product.discount);
    this.price = Number(this.product.actualCost);
  }

  constructor(private http: HttpClient, private router: Router) {}

  isLogin() {
    const uid = localStorage.getItem('userAuthUid');
    if (uid) {
      this.userUid = Number.parseInt(uid);
      if (this.userUid > 0) {
        return true;
      }
    }

    const sellerUidLocalVar = localStorage.getItem('sellerAuthUid');
    if (sellerUidLocalVar) {
      this.sellerUid = Number.parseInt(sellerUidLocalVar);
      if (this.sellerUid > 0) {
        return true;
      }
    }

    return false;
  }

  addToCart() {
    if (this.isLogin()) {
      const url = Data.product_add_to_cart;

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

      const body = {
        userId: sendUid,
        productId: this.product._id,
        isSeller: isSellerLocalVar == '1' ? true : false,
        remove: false,
        decrease: false,
      };

      this.http.post(url, body, { observe: 'response' }).subscribe(
        (response: HttpResponse<any>) => {
          const jsonResponse = response.body;
          const statusCode = response.status;

          if (statusCode == 200) {
            console.log('receved positive response');
            const uid = jsonResponse.uid;
          }
        },
        (error) => {
          console.error('Error:');
          console.error(error);
          console.log('Status Code:', error.status);
        }
      );
    } else {
      console.log("first login")
    }
  }

  checkOutProduct() {
    if (this.isLogin()) {
      this.addToCart();
      this.router.navigateByUrl('/cart')
    } else {

    }
  }

}
