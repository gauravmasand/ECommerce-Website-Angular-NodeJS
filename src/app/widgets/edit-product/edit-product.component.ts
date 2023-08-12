import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from 'src/app/Data';
import { Category } from 'src/app/Models/Category';
import { Products } from 'src/app/Models/Products';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent {
  @Input() productData!: Products;
  @Output() dataEvent = new EventEmitter<string>();

  sellerUid!: string;
  product_image_path: string = Data.domain + '/product_images/';
  status: string = '';
  allCategories!: [Category];
  selectedCategory: Category | undefined;

  onCategoryChange(): void {
    this.selectedCategory = this.allCategories.find(
      (category) => category.name === this.productData.category
    );
  }

  // For Images
  selectedImages: string[] = [];
  productImages: File[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.fetchCategory();
  }

  updateProduct() {
    const url = Data.update_product + '?productId=' + this.productData._id;

    const sellerUidLocalVar = localStorage.getItem('sellerAuthUid');

    if (sellerUidLocalVar) {
      this.sellerUid = sellerUidLocalVar;

      const formData = new FormData();
      formData.append('sellerId', this.sellerUid);
      formData.append('title', this.productData.title);
      formData.append('desc', this.productData.desc);
      formData.append('productFeatures', this.productData.productFeatures);
      formData.append('offers', this.productData.offers);
      formData.append('discount', this.productData.discount);
      formData.append('actualCost', this.productData.actualCost);
      formData.append('category', this.productData.category);
      formData.append('subCategory', this.productData.subCategory);
      formData.append('stock', this.productData.stock);
      formData.append(
        'currentProductImagePath',
        JSON.stringify(this.productData.productImages)
      );

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
            this.dataEvent.emit('done');
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

          this.selectedCategory = this.allCategories.find(
            (category) => category.name === this.productData.category
          );
        }
      },
      (error) => {}
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
