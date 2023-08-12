import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Data } from 'src/app/Data';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent implements OnInit {
  orders: any[] = [];
  sellingCostList: number[] = [];
  productCount: number = 0;
  ordersCount: number = 0;
  ordersCompleted: number = 0;
  salesCost: number = 0;
  sellerId!: string|null;
  product_image_path: string = Data.domain + '/product_images/';
  higgestOrders: any[] = [];
  higgestSellingCostList: number[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.sellerId = localStorage.getItem('sellerAuthUid');
    this.fetchProductCount();
    this.fetchTotalOrders();
    this.fetchTotalOrdersComplted();
    this.fetchSalesCost();
    this.fetchSellerRecentOrders();
    this.fetchOrdersWithHighestSales();
  }

  fetchOrdersWithHighestSales(): void {
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
  
    const url = `${Data.fetch_seller_highest_ordrs}${sendUid}`;
  
    this.http.get<any>(url).subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.higgestOrders = response;

          this.higgestSellingCostList = [];
  
          this.higgestOrders.forEach((item) => {
            const sellingCost = item.actualCost - (item.discount / 100) * item.actualCost;
            this.higgestSellingCostList.push(sellingCost);
          });
  
        } else {
          console.error('Error: Empty or invalid API response.');
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  
  
  fetchSellerRecentOrders(): void {
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

    const url = `${Data.fetch_seller_recent_orders}${sendUid}`;

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

  fetchSalesCost() {
    const url = Data.seller_sales_cost + this.sellerId;

    this.http.get<{ totalSalesCost: number }>(url).subscribe(
      (response) => {
        this.salesCost = response.totalSalesCost;
        console.log("completed orders");
        console.log(response.totalSalesCost);
      },
      (error) => {
        console.error('Error fetching product count:', error);
      }
    );
    
  }

  fetchTotalOrdersComplted() {
    const url  = Data.count_orders_completed_of_seller + this.sellerId;

    this.http.get<{ count: number }>(url).subscribe(
      (response) => {
        this.ordersCompleted = response.count;
        console.log("completed orders");
        console.log(response.count);
      },
      (error) => {
        console.error('Error fetching product count:', error);
      }
    );
    
  }

  fetchTotalOrders() {
    const url  = Data.count_orders_of_seller + this.sellerId;

    this.http.get<{ count: number }>(url).subscribe(
      (response) => {
        this.ordersCount = response.count;
      },
      (error) => {
        console.error('Error fetching product count:', error);
      }
    );
    
  }

  fetchProductCount() {

    const url = `${Data.fetch_seller_products_count}?sellerId=${this.sellerId}`;

    this.http.get<{ count: number }>(url).subscribe(
      (response) => {
        this.productCount = response.count;
      },
      (error) => {
        console.error('Error fetching product count:', error);
      }
    );
  }

}
