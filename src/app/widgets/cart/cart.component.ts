import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router, Routes } from '@angular/router';
import { Data } from 'src/app/Data';
import { Products } from 'src/app/Models/Products';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  products: Products[] = [];
  quanties: Number[] = [];
  discountedPrice: Number[] = [];
  image_path: string = Data.domain + '/product_images/';
  totalPrice: number = 0;
  totalDiscountCost: number = 0;
  totalPriceAfterDiscount: number = 0;
  showCheckout: boolean = false;

  openCheckoutModal(): void {
    this.showCheckout = true;
  }

  closeCheckoutModal(): void {
    this.showCheckout = false;
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.fetchCartData();

    setTimeout(() => {
      this.countFinals();
    }, 100);
  }

  countFinals() {
    this.totalPrice = 0;
    this.totalDiscountCost = 0;
    this.totalPriceAfterDiscount = 0;

    for (let i = 0; i < this.products.length; i++) {
      const product = this.products[i];
      const quantity = +this.quanties[i];
      const actualPrice = parseFloat(product.actualCost);
      const discountPercentage = parseFloat(product.discount);

      for (let j = 0; j < quantity; j++) {
        const discountAmount = (actualPrice * discountPercentage) / 100;
        const discountCost = discountAmount * quantity;
        this.totalPrice += actualPrice;
        this.totalDiscountCost += discountCost;
      }
      
    }

    this.totalPriceAfterDiscount = this.totalPrice - this.totalDiscountCost;
  }

  fetchCartData() {
    const url = Data.fetch_cart;

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
    };

    this.http.post(url, body, { observe: 'response' }).subscribe(
      async (response: HttpResponse<any>) => {
        const jsonResponse = response.body;
        const statusCode = response.status;

        if (statusCode == 200) {

          jsonResponse.map((item: any) => {
            this.fetchProductData(item.productId);
            this.quanties.unshift(Number(item.quantity));
          });
          this.countFinals();
        }
      },
      (error) => {
        console.error('Error in fetching product data:');
        console.error(error);
        console.log('Status Code:', error.status);
      }
    );
  }

  fetchProductData(product_id: string) {
    const url = Data.fetch_product + '?product_id=' + product_id;

    this.http.get(url, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {
        const jsonResponse = response.body;
        const statusCode = response.status;

        if (statusCode == 200) {
          const product = new Products();
          product.actualCost = jsonResponse.actualCost;
          product.category = jsonResponse.category;
          product.date = jsonResponse.date;
          product.desc = jsonResponse.desc;
          product.discount = jsonResponse.discount;
          product.offers = jsonResponse.offers;
          product.productFeatures = jsonResponse.productFeatures;
          product.productImages = jsonResponse.productImages;
          product.sellerId = jsonResponse.sellerId;
          product.stock = jsonResponse.stock;
          product.subCategory = jsonResponse.subCategory;
          product.title = jsonResponse.title;
          product._id = jsonResponse._id;

          let discount = Number(product.discount);
          let price = Number(product.actualCost);
          const priceAfterDiscount = price - (discount / 100) * price;

          this.discountedPrice.unshift(Number(priceAfterDiscount));
          this.products.unshift(product);
        }
      },
      (error) => {
        console.error('Error in fetching product data:');
        console.error(error);
        console.log('Status Code:', error.status);
      }
    );
  }

  async changeQuantity(index: number, type: boolean) {
    const url = Data.product_add_to_cart;

    const isSellerLocalVar = localStorage.getItem('isSeller');
    let sendUid = '';

    if (isSellerLocalVar) {
      if (isSellerLocalVar == '0') {
        sendUid = localStorage.getItem('userAuthUid') || '';
      } else {
        sendUid = localStorage.getItem('sellerAuthUid') || '';
      }
    }

    if (type) {
      this.quanties[index] = +this.quanties[index] + 1;
      this.updateCart(
        sendUid,
        this.products[index]._id,
        isSellerLocalVar == '1' ? true : false,
        false
      );
      this.countFinals();
    } else {
      if (+this.quanties[index] == 1) {
        const body = {
          userId: sendUid,
          productId: this.products[index]._id,
          isSeller: isSellerLocalVar == '1' ? true : false,
          remove: true,
          decrease: false,
        };

        this.http.post(url, body, { observe: 'response' }).subscribe(
          (response: HttpResponse<any>) => {
            const jsonResponse = response.body;
            const statusCode = response.status;
            if (statusCode == 200) {
              console.log('receved positive response');
              if (index >= 0 && index < this.products.length) {
                this.quanties.splice(index, 1);
                this.discountedPrice.splice(index, 1);
                this.products.splice(index, 1);
                this.countFinals();
              }
            }
          },
          (error) => {
            console.error('Error:');
            console.error(error);
            console.log('Status Code:', error.status);
          }
        );
      } else if (+this.quanties[index] > 0) {
        this.quanties[index] = +this.quanties[index] - 1;
        this.updateCart(
          sendUid,
          this.products[index]._id,
          isSellerLocalVar == '1' ? true : false,
          true
        );
        this.countFinals();
      }
    }
  }

  updateCart(
    userId: string,
    productId: string,
    isSeller: boolean,
    decrease: boolean
  ) {
    const url = Data.product_add_to_cart;

    const body = {
      userId: userId,
      productId: productId,
      isSeller: isSeller,
      remove: false,
      decrease: decrease,
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
  }
}
