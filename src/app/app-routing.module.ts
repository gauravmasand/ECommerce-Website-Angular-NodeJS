import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './widgets/home/home.component';
import { SellerAuthComponent } from './widgets/seller-auth/seller-auth.component';
import { CartComponent } from './widgets/cart/cart.component';
import { UserAuthComponent } from './widgets/user-auth/user-auth.component';
import { ProductDetailComponent } from './widgets/product-detail/product-detail.component';
import { SearchComponent } from './widgets/search/search.component';
import { CategoryComponent } from './widgets/category/category.component';
import { SellerHomeComponent } from './widgets/seller-home/seller-home.component';
import { SellerAddProductsComponent } from './widgets/seller-add-products/seller-add-products.component';
import { SettingsComponent } from './widgets/settings/settings.component';
import { EditProductComponent } from './widgets/edit-product/edit-product.component';
import { CheckoutProductComponent } from './widgets/checkout-product/checkout-product.component';
import { OrdersComponent } from './widgets/orders/orders.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'seller-auth', component: SellerAuthComponent },
  { path: 'user-auth', component: UserAuthComponent },
  { path: 'cart', component: CartComponent },
  { path: 'product/:product_id', component: ProductDetailComponent },
  { path: 'search', component: SearchComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'category/:category', component: CategoryComponent },
  { path: 'category/:category/:subCategory', component: CategoryComponent },
  { path: 'seller-home', component: SellerHomeComponent },
  { path: 'seller-add-product', component: SellerAddProductsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'checkout', component: CheckoutProductComponent },
  { path: 'orders', component: OrdersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
