import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router, Routes } from '@angular/router';
import { Data } from 'src/app/Data';
import { Category } from 'src/app/Models/Category';
import { Products } from 'src/app/Models/Products';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  category!: string;
  subCategory!: string;
  products!: [Products];
  categoryData!: Category;
  image_path: string = Data.domain + '/product_images/';
  category_image_path: string = Data.domain + '/category/';
  onlyCategory: boolean = false;
  allCategories!: [Category];

  ngOnInit() {
    this.route.params.subscribe((params) => {
      // this.category = encodeURIComponent(params['category']);
      // this.subCategory = encodeURIComponent(params['subCategory']);
      this.category = params['category'];
      this.subCategory = params['subCategory'];
    });
    if (this.subCategory && this.category) {
      this.fetchSubCategoryProducts();
    } else if (this.category) {
      this.fetchProducts();
      this.fetchCategoryData();
    } else {
      this.onlyCategory = true;
      this.fetchCategory();
    }
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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

  fetchSubCategoryProducts() {
    const count = 8;
    let url;

    const temp = this.subCategory.replaceAll('&', '%26');

    console.log(this.subCategory);

    url =
      Data.fetch_products_with_sub_category +
      '?count=' +
      count +
      '&subCategory=' +
      temp;

    console.log(url);

    this.http.get(url, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {
        const jsonResponse = response.body;
        const statusCode = response.status;

        console.log('positive response');

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

          console.log('object :>> ', this.products[0].category);
          console.log('object :>> ', this.products[0].subCategory);

          console.log(this.products);
        }
      },
      (error) => {
        console.error('Error in getting specific category products:');
        console.error(error);
        console.log('Status Code:', error.status);
      }
    );
  }

  fetchCategoryData() {
    const temp = this.category.replaceAll('&', '%26');

    const url = Data.category + '?category=' + temp;

    console.log(url);

    this.http.get(url, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {
        const jsonResponse = response.body;
        const statusCode = response.status;

        if (statusCode == 200) {
          console.log('receved positive response');

          console.log(this.category + ' category data: ' + jsonResponse);

          const category: Category = new Category();
          category.name = jsonResponse.name;
          category.subcategories = jsonResponse.subcategories;
          category.image = jsonResponse.image;

          this.categoryData = category;
        }
      },
      (error) => {}
    );
  }

  fetchProducts() {
    const count = 8;
    let url;

    const temp = this.category.replaceAll('&', '%26');

    console.log(this.category);
    console.log(this.subCategory);

    url = Data.fetch_products + '?count=' + count + '&category=' + temp;

    console.log(url);

    this.http.get(url, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {
        const jsonResponse = response.body;
        const statusCode = response.status;

        console.log('positive response');

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

          console.log('object :>> ', this.products[0].category);
          console.log('object :>> ', this.products[0].subCategory);

          console.log(this.products);
        }
      },
      (error) => {
        console.error('Error in getting specific category products:');
        console.error(error);
        console.log('Status Code:', error.status);
      }
    );
  }
}
