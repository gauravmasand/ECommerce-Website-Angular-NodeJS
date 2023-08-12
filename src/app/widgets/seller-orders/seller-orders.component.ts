import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Data } from 'src/app/Data';

@Component({
  selector: 'app-seller-orders',
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.css'],
})
export class SellerOrdersComponent {
  orders: any[] = [];
  sellingCostList: number[] = [];
  image_path: string = Data.product_image_path;

  constructor(private http: HttpClient) {}

  markAsSent(order: any): void {
    const url = `${Data.seller_product_mark_as_sent}${order._id}`;

    this.http.post(url, {}).subscribe(
      (response) => {
        console.log(response)
      },
      (error) => {
        console.error(error)
      }
    );
  }

  cancelOrder(order: any): void {
    const url = `${Data.seller_cancel_order}${order._id}`;

    this.http.post(url, {}).subscribe(
      (response) => {
        console.log(response)
      },
      (error) => {
        console.error(error)
      }
    );
  }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
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

    const url = `${Data.check_seller_orders}${sendUid}`;

    this.http.get<any>(url).subscribe(
      (response) => {
        this.orders = response.orders;

        this.orders.forEach((item) => {
          const sellingCost =
            item.actualCost - (item.discount / 100) * item.actualCost;
          this.sellingCostList.push(sellingCost);
        });
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  
}
