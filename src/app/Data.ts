export class Data {
    static domain: string = "http://localhost:3000";
    static auth_api: string = "/api/auth/";
    static seller_api: string = Data.domain + "/api/seller/";
    static fetch_products: string = Data.domain + "/api/fetch-products/";
    static fetch_products_with_sub_category: string = Data.domain + "/api/fetch-products-with-sub-category/";
    static fetch_product: string = Data.domain + "/api/fetch-product/";
    static fetch_seller_info: string = Data.domain + "/api/fetch-seller-info/";
    static category: string = Data.domain + "/api/fetch-category-data/";
    static fetch_seller_products_count: string = Data.domain + "/api/seller-products-count/";
    static fetch_products_of_seller: string = Data.domain + "/api/fetch-products-of-seller/";
    static seller_delete_product: string = Data.domain + "/api/seller-delete-product/";
    static update_product: string = Data.domain + "/api/seller-update-product/";
    static search_product: string = Data.domain + "/api/search-product/";
    static product_add_to_cart: string = Data.domain + "/api/product-add-to-cart/";
    static fetch_cart: string = Data.domain + "/api/fetch-cart/";
    static fetch_user_data: string = Data.domain + "/api/fetch-user-data/";
    static place_order: string = Data.domain + "/api/place-order/";
    static check_orders: string = Data.domain + "/api/check-orders/";
    static check_seller_orders: string = Data.domain + "/api/check-seller-orders/";
    static fetch_order_details: string = Data.domain + "/api/fetch-order-details/";
    static seller_product_mark_as_sent: string = Data.domain + "/api/seller-product-mark-as-sent/";
    static seller_cancel_order: string = Data.domain + "/api/seller-cancel-order/";
    static count_orders_of_seller: string = Data.domain + "/api/count-orders-of-seller/";
    static count_orders_completed_of_seller: string = Data.domain + "/api/count-orders-completed-of-seller/";
    static seller_sales_cost: string = Data.domain + "/api/seller-sales-cost/";
    static fetch_seller_recent_orders: string = Data.domain + "/api/fetch-recent-seller-orders/";
    static fetch_seller_highest_ordrs: string = Data.domain + "/api/fetch-seller-highest-sales/";

    // image path
    static product_image_path: string = Data.domain + '/product_images/';

}
