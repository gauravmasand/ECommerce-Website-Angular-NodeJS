import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router, Routes } from '@angular/router';
import { Data } from 'src/app/Data';
import { Products } from 'src/app/Models/Products';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  featuredImageList: string[] = [];
  currentDisplayedIndex: number = 0;
  list!: number[];
  price: number = 200;
  discount: number = 51;
  product_id!: string;
  old_product_id: string = "";
  product!: Products;
  sellerName!: string;
  sellerAddress!: string;
  sellerCategory!: string;
  products!: [Products];
  image_path: string = Data.domain + '/product_images/';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.list = [1, 2, 3, 4];
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.product_id = params['product_id'];
      console.log(this.product_id);
    });
    this.old_product_id = this.product_id
    this.fetchProductData();
  }

  fetchProductData() {
    const url = Data.fetch_product + '?product_id=' + this.product_id;

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

          this.product = product;

          this.product.productImages.forEach((item, index) => {
            const image_url = Data.domain + "/product_images/" + item
            this.featuredImageList.push(image_url)
          });

          this.discount = Number(product.discount);
          this.price = Number(product.actualCost);

          this.fetchSellerData();
          this.fetchProducts();
        }
      },
      (error) => {
        console.error('Error in fetching product data:');
        console.error(error);
        console.log('Status Code:', error.status);
      }
    );
  }

  fetchProducts() {
    const count = 4;
    const url = Data.fetch_products + "?count=" + count + "&category=" + this.product.category;

    this.http.get(url, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {

        const jsonResponse = response.body;
        const statusCode = response.status;
        
        console.log("positive response")

        // console.log(jsonResponse)

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
          
        }

      },
      (error) => {
        console.error('Error in getting specific category products:');
        console.error(error);
        console.log('Status Code:', error.status);
      }
    );
  }

  fetchSellerData() {
    const url = Data.fetch_seller_info + '?seller_id=' + this.product.sellerId;

    this.http.get(url, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {
        const jsonResponse = response.body;
        const statusCode = response.status;

        if (statusCode == 200) {
          
          this.sellerName = (jsonResponse.name)
          this.sellerAddress = (jsonResponse.town) + ", " + (jsonResponse.city) + ", " + (jsonResponse.state) + ", " + (jsonResponse.country)
          this.sellerCategory = (jsonResponse.category)

        }
      },
      (error) => {
        console.error('Error in getting seller info:');
        console.error(error);
        console.log('Status Code:', error.status);
      }
    );
  }

  prevImage(): void {
    if (this.currentDisplayedIndex == 0) {
      this.currentDisplayedIndex = this.featuredImageList.length - 1;
    } else {
      this.currentDisplayedIndex = this.currentDisplayedIndex - 1;
    }
  }

  nextImage(): void {
    if (this.currentDisplayedIndex < this.featuredImageList.length - 1) {
      this.currentDisplayedIndex = this.currentDisplayedIndex + 1;
    } else {
      this.currentDisplayedIndex = 0;
    }
  }
}
