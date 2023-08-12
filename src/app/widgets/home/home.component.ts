import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from 'src/app/Data';
import { Category } from 'src/app/Models/Category';
import { Products } from 'src/app/Models/Products';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  list!: string[];
  list1!: string[];
  featuredImageList!: string[];
  currentDisplayedIndex: number = 0;
  products!: [Products];
  image_path: string = Data.domain + '/product_images/';
  allCategories!: [Category];
  
  constructor(private http: HttpClient, private router: Router) {
    this.list = ["1", "2", "3", "4", "5", "6", "7", "8"];
    this.list1 = ["1", "2", "3", "4", "5", "6", ];
    this.featuredImageList = [
      "sample-image.jpeg",
      "sample-image2.jpeg",
      "sample-image3.jpeg",
      "sample-image4.jpeg",
    ];
    this.fetchProducts();
    this.fetchCategory();
  }

  fetchProducts() {
    const count = 8;
    const url = Data.fetch_products + "?count=" + count;

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
        console.error('Error:');
        console.error(error);
        console.log('Status Code:', error.status);
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
        }
      },
      (error) => {}
    );
  }

  prevImage(): void {
    if (this.currentDisplayedIndex==0) {
      this.currentDisplayedIndex = (this.featuredImageList.length-1);
    } else {
      this.currentDisplayedIndex = this.currentDisplayedIndex - 1;
    }
    console.log("prev: "+this.currentDisplayedIndex)
  }

  nextImage(): void {

    if (this.currentDisplayedIndex<(this.featuredImageList.length-1)) {
      this.currentDisplayedIndex = this.currentDisplayedIndex + 1;
    } else {
      this.currentDisplayedIndex = 0
    }
    console.log("next: "+this.currentDisplayedIndex)
  }

}
