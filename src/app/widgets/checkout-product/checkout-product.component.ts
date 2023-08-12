import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from 'src/app/Data';
import { Products } from 'src/app/Models/Products';

@Component({
  selector: 'app-checkout-product',
  templateUrl: './checkout-product.component.html',
  styleUrls: ['./checkout-product.component.css'],
})
export class CheckoutProductComponent {
  @Input() products: Products[] = [];
  @Input() quantity: Number[] = [];
  address!: string;
  selectedPaymentOption!: string;
  upiId!: string;
  cardNumber!: string;
  bank!: string;
  userId: string | null | undefined = '';
  customerName!: string;
  customerAddress!: string;
  customerPhone!: string;
  customerEmail!: string;
  orderStatus: string = '';
  order_message : string = '';

  placeOrder(): void {
    console.log(this.selectedPaymentOption);
    if (!this.address) {
      alert('Please enter the delivery address.');
      return;
    }

    if (!this.selectedPaymentOption) {
      alert('Please select a payment option.');
      return;
    }

    if (this.selectedPaymentOption === 'upi' && !this.upiId) {
      alert('Please enter the UPI ID.');
      return;
    }

    if (this.selectedPaymentOption === 'card' && !this.cardNumber) {
      alert('Please enter the card number.');
      return;
    }

    if (this.selectedPaymentOption === 'netbanking' && !this.bank) {
      alert('Please select a bank.');
      return;
    }

    alert('Order placed successfully!');

    const url = Data.place_order;

    let bodies: any[] = [];
    for (let i = 0; i < this.products.length; i++) {
      bodies.push({
        customerId: this.userId,
        customerName: this.customerName,
        customerAddress: this.address,
        customerEmail: this.customerEmail,
        customerPaymentType: this.selectedPaymentOption,
        productId: this.products[i]._id,
        sellerId: this.products[i].sellerId,
        productTitle: this.products[i].title,
        productImageName: this.products[i].productImages[0],
        desc: this.products[i].desc,
        offers: this.products[i].offers,
        quantity: this.quantity[i],
        actualCost: parseInt(this.products[i].actualCost),
        discount: parseInt(this.products[i].discount),
      });
    }

    const bodyString = JSON.stringify(bodies);
    const headers = {
      'Content-Type': 'application/json',
    };

    this.http.post(url, bodyString, { headers, observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {
        const jsonResponse = response.body;
        const statusCode = response.status;

        if (statusCode == 200) {

          this.orderStatus = "success";
          this.order_message = jsonResponse.message;
        }
      },
      (error) => {
        if (error.status == 500) {
          this.orderStatus = "failed";
        }
        console.error('Error:');
        console.error(error);
        console.log('Status Code:', error.status);
      }
    );
  }

  constructor(private http: HttpClient, private router: Router) {
    this.fetchAddress();
  }

  fetchAddress() {
    const url = Data.fetch_user_data;

    let userId;
    let isSeller = false;

    const isSellerLocalVar = localStorage.getItem('isSeller');
    if (isSellerLocalVar) {
      if (isSellerLocalVar == '0') {
        userId = localStorage.getItem('userAuthUid');
      } else {
        isSeller = true;
        userId = localStorage.getItem('sellerAuthUid');
      }
    }

    this.userId = userId;

    const body = {
      userId: userId,
      isSeller: isSeller,
    };

    this.http.post(url, body, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {
        const jsonResponse = response.body;
        const statusCode = response.status;

        if (statusCode == 200) {
          this.address =
            jsonResponse.town +
            '\n' +
            jsonResponse.city +
            '\n' +
            +jsonResponse.state +
            '\n' +
            jsonResponse.country;
          this.customerName = jsonResponse.name;
          this.customerEmail = jsonResponse.email;
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
