import { Component } from '@angular/core';
import { Data } from 'src/app/Data';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Category } from 'src/app/Models/Category';

@Component({
  selector: 'app-seller-add-products',
  templateUrl: './seller-add-products.component.html',
  styleUrls: ['./seller-add-products.component.css'],
})
export class SellerAddProductsComponent {
  sellerUid!: string;

  productTitle: string = '';
  productDescription: string = '';
  productFeatures: string = '';
  productPrice: string = '';
  productDiscount: string = '';
  productOffers: string = '';
  productCategory: string = '';
  productSubCategory: string = '';
  productStock: string = '';
  status: string = '';
  allCategories!: [Category];
  selectedCategory: Category | undefined;

  onCategoryChange(): void {
    this.selectedCategory = this.allCategories.find(
      (category) => category.name === this.productCategory
    );
  }

  // For Images
  selectedImages: string[] = [];
  productImages: File[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.fetchCategory();
  }

  addProduct() {
    const url = Data.seller_api + 'add-product';

    const sellerUidLocalVar = localStorage.getItem('sellerAuthUid');

    if (sellerUidLocalVar) {
      this.sellerUid = sellerUidLocalVar;

      const formData = new FormData();
      formData.append('sellerId', this.sellerUid);
      formData.append('title', this.productTitle);
      formData.append('desc', this.productDescription);
      formData.append('productFeatures', this.productFeatures);
      formData.append('offers', this.productOffers);
      formData.append('discount', this.productDiscount);
      formData.append('actualCost', this.productPrice);
      formData.append('category', this.productCategory);
      formData.append('subCategory', this.productSubCategory);
      formData.append('stock', this.productStock);

      for (let i = 0; i < this.productImages.length; i++) {
        formData.append('productImages', this.productImages[i]);
      }

      this.http.post(url, formData, { observe: 'response' }).subscribe(
        (response: HttpResponse<any>) => {
          const jsonResponse = response.body;
          const statusCode = response.status;
          console.log('response');

          if (statusCode === 200) {
            this.status = 'success';
            console.log('proper response');
            console.log(jsonResponse);
          }
        },
        (error) => {
          this.status = 'failed';
        }
      );
    }
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

          this.fetchSellerData();
          
        }
      },
      (error) => {}
    );
  }

  fetchSellerData() {
    const sellerId = localStorage.getItem('sellerAuthUid');
    const url = Data.fetch_seller_info + '?seller_id=' + sellerId;
  
    this.http.get(url, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {
        const jsonResponse = response.body;
        const statusCode = response.status;
  
        if (statusCode == 200) {
          this.productCategory = jsonResponse.category;
          this.selectedCategory = this.allCategories.find(category => category.name === this.productCategory);
  
          if (this.selectedCategory) {
            const subCategoryIndex = this.selectedCategory.subcategories.indexOf(jsonResponse.subCategory);
            if (subCategoryIndex !== -1) {
              this.productSubCategory = this.selectedCategory.subcategories[subCategoryIndex];
            } else {
              this.productSubCategory = this.selectedCategory.subcategories[0];
            }
          }
        }
      },
      (error) => {
        console.error('Error in getting seller info:');
        console.error(error);
        console.log('Status Code:', error.status);
      }
    );
  }
  

  onFileSelected(event: any) {
    this.productImages = event.target.files;
    this.selectedImages = [];

    for (let i = 0; i < this.productImages.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImages.push(e.target.result);
      };
      reader.readAsDataURL(this.productImages[i]);
    }
  }
}
