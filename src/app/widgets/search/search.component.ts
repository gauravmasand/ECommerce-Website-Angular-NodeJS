import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Data } from 'src/app/Data';
import { Category } from 'src/app/Models/Category';
import { Products } from 'src/app/Models/Products';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  list1!: string[];
  featuredImageList!: string[];
  currentDisplayedIndex: number = 0;
  products!: [Products];
  queryParamValue!: string;
  minPrice!: number;
  maxPrice!: number;
  minDiscountPercentage!: number;
  allCategories!: [Category];
  selectedCategory: Category | undefined;
  selectedSubcategory: string | undefined;
  searchStatus: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.list1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    this.featuredImageList = [
      'sample-image.jpeg',
      'sample-image2.jpeg',
      'sample-image3.jpeg',
      'sample-image4.jpeg',
    ];
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.queryParamValue = params['s'];
      console.log(this.queryParamValue);
    });
    this.fetchSearch();
    this.fetchCategory();
  }

  fetchSearch() {
    
    this.searchStatus = "";

    const url = Data.search_product;

    const body: { query?: string, category?: string,subCategory?: string,minPrice?: number,maxPrice?: number,minDiscountPercentage?: number} = {};


    console.log("enrty")

    if (!this.queryParamValue) {
      return
    }

    console.log("pass")

    body.query = this.queryParamValue;

    if (this.selectedCategory?.name) {
      body.category = this.selectedCategory?.name;
    }

    if (this.selectedSubcategory) {
      body.subCategory = this.selectedSubcategory;
    }

    if (this.minPrice) {
      body.minPrice = this.minPrice;
    }

    if (this.maxPrice) {
      body.maxPrice = this.maxPrice;
    }

    if (this.minDiscountPercentage) {
      body.minDiscountPercentage = this.minDiscountPercentage;
    }

    console.log(body)

    this.http.post(url, {
          query: this.queryParamValue,
          category: this.selectedCategory?.name,
          subCategory: this.selectedSubcategory,
          minPrice: this.minPrice,
          maxPrice: this.maxPrice,
          minDiscountPercentage: this.minDiscountPercentage,
        }, { observe: 'response' } )
      .subscribe(
        (response: HttpResponse<any>) => {
          const jsonResponse = response.body;
          const statusCode = response.status;

          console.log('positive response');

          console.log(jsonResponse);

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
          const statusCode = error.status;
          if (statusCode==404) {
            this.searchStatus = "nofound";
          }
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

          console.log("Category");
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
}
