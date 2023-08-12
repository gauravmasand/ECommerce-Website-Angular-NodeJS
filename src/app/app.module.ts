import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './widgets/header/header.component';
import { HomeComponent } from './widgets/home/home.component';
import { SellerAuthComponent } from './widgets/seller-auth/seller-auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserLoginComponent } from './widgets/user-login/user-login.component';
import { CartComponent } from './widgets/cart/cart.component';
import { SellerAuthSignupComponent } from './widgets/seller-auth-signup/seller-auth-signup.component';
import { SellerAuthLoginComponent } from './widgets/seller-auth-login/seller-auth-login.component';
import { UserAuthComponent } from './widgets/user-auth/user-auth.component';
import { UserSignupComponent } from './widgets/user-signup/user-signup.component';
import { ProductDetailComponent } from './widgets/product-detail/product-detail.component';
import { SearchComponent } from './widgets/search/search.component';
import { CategoryComponent } from './widgets/category/category.component';
import { SellerHomeComponent } from './widgets/seller-home/seller-home.component';
import { SellerAddProductsComponent } from './widgets/seller-add-products/seller-add-products.component';
import { SellerManageProductsComponent } from './widgets/seller-manage-products/seller-manage-products.component';
import { SellerOrdersComponent } from './widgets/seller-orders/seller-orders.component';
import { SellerSettingsComponent } from './widgets/seller-settings/seller-settings.component';
import { SellerDashboardComponent } from './widgets/seller-dashboard/seller-dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { SettingsComponent } from './widgets/settings/settings.component';
import { ProductItemComponent } from './widgets/product-item/product-item.component';
import { CategoryItemComponent } from './widgets/category-item/category-item.component';
import { SellerProfileComponent } from './widgets/seller-profile/seller-profile.component';
import { EditProductComponent } from './widgets/edit-product/edit-product.component';
import { CheckoutProductComponent } from './widgets/checkout-product/checkout-product.component';
import { OrdersComponent } from './widgets/orders/orders.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SellerAuthComponent,
    UserLoginComponent,
    CartComponent,
    SellerAuthSignupComponent,
    SellerAuthLoginComponent,
    UserAuthComponent,
    UserSignupComponent,
    ProductDetailComponent,
    SearchComponent,
    CategoryComponent,
    SellerHomeComponent,
    SellerAddProductsComponent,
    SellerManageProductsComponent,
    SellerOrdersComponent,
    SellerSettingsComponent,
    SellerDashboardComponent,
    SettingsComponent,
    ProductItemComponent,
    CategoryItemComponent,
    SellerProfileComponent,
    EditProductComponent,
    CheckoutProductComponent,
    OrdersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
