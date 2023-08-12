import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from 'src/app/Data';
import { Products } from 'src/app/Models/Products';

@Component({
  selector: 'app-seller-manage-products',
  templateUrl: './seller-manage-products.component.html',
  styleUrls: ['./seller-manage-products.component.css']
})
export class SellerManageProductsComponent {
  products: Products[] = [];
  productCount: number = 0;
  sellerId!: string|null;
  image_path: string = Data.domain + '/product_images/';

  @Output() dataEvent = new EventEmitter<Products>();

  sendData(product: Products) {
    this.dataEvent.emit(product);
  }

  ngOnInit() {
    this.sellerId = localStorage.getItem('sellerAuthUid');
    this.fetchProductCount();
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

  constructor(private http: HttpClient, private router: Router) {
    this.fetchProducts();
  }
  
  fetchProducts() {
    const sellerId = localStorage.getItem("sellerAuthUid");
    const url = Data.fetch_products_of_seller + "?sellerId=" + sellerId;

    this.http.get(url, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {

        const jsonResponse = response.body;
        const statusCode = response.status; 

        if (statusCode == 200) {
          this.products = jsonResponse.map((item: any) => {
            const product = new Products();
            product.actualCost = item.actualCost;
            product.category = item.category;
            product.date = item.date;
            product.desc = item.desc;
            product.discount = item.discount;
            product.offers = item.offers;
            product.productFeatures = item.productFeatures;
            product.productImages = item.productImages;
            product.sellerId = item.sellerId;
            product.stock = item.stock;
            product.subCategory = item.subCategory;
            product.title = item.title;
            product._id = item._id;
            return product;
          });

          console.log(this.products)

        }

      },
      (error) => {
        console.error('Error:');
        console.error(error);
        console.log('Status Code:', error.status);
      }
    );
  }

  deleteProduct(productId: string) {
    console.log(productId)

    const url = Data.seller_delete_product + "?productId=" + productId;
    
    this.http.get(url, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {

        const statusCode = response.status; 

        if (statusCode == 200) {
          this.productCount = this.productCount - 1;
          this.removeItemById(productId);
          this.products
        } else if (statusCode == 404) {
          console.log("The product not found")
        }

      },
      (error) => {
        console.error('Error:');
        console.error(error);
        console.log('Status Code:', error.status);
      }
    );

  }

  removeItemById(id: string): void {
    const index = this.products.findIndex(item => item._id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
  }

}
