import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from 'src/app/Data';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  image_path: string = Data.domain + '/product_images/';
  discountedPrice: Number[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchOrderDetails();
  }

  fetchOrderDetails() {
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

    const url = Data.fetch_order_details + sendUid;

    console.log(url);

    this.http.get(url, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {
        const jsonResponse = response.body;
        const statusCode = response.status;

        if (statusCode == 200) {
          jsonResponse.map((item: any) => {
            this.orders.unshift({
              productId: item.productId,
              productTitle: item.productTitle,
              productImageName: item.productImageName,
              actualCost: item.actualCost,
              discount: item.discount,
              quantity: item.quantity,
              deliveryStatus: item.sellerCanceled ? 'Seller Canceled' : item.markAsSent ? 'Delivered' : 'Yet to sent',
              date: new Date(),
            });

            let discount = Number(item.discount);
            let price = Number(item.actualCost);
            const priceAfterDiscount = price - (discount / 100) * price;

            this.discountedPrice.unshift(Number(priceAfterDiscount));
          });

          console.log(jsonResponse);
        }
      },
      (error) => {}
    );
  }
}
