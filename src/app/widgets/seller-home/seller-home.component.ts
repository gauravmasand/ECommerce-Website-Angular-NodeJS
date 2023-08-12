import { Component } from '@angular/core';
import { Products } from 'src/app/Models/Products';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent {
  currentTab: string = 'dashboard';
  productForEdit!: Products;

  changeTab(tab: string) {
    this.currentTab = tab;
  }

  productUpdateStatus(status: string) {
    console.log("receved and res")
    if (status == 'done') {
      this.currentTab = 'manage-products';
    }
  }

  receiveProductEditData(product: Products) {
    this.productForEdit = product;
    this.changeTab('edit-product');
    console.log;
  }
}
