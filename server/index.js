const express = require("express");
const cors = require('cors');
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const database = require('./database');
const multer = require('multer');
const { ObjectId } = mongoose.Types;
const fs = require('fs');


const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('product_images'));
app.use(express.static('category'));
app.use(express.static('ecommerce-website-idproof-uploaded'));
app.use(express.static(path.join(__dirname, "../dist/my-angular-app")));

var authApiPath = "/api/auth/";
var sellerApiPath = "/api/seller/";

var db = database;

const usersSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    town: String,
    city: String,
    state: String,
    country: String,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection: 'usersAuthCred' });

const sellerSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    password: String,
    town: String,
    city: String,
    state: String,
    country: String,
    bankName: String,
    accountNumber: String,
    IFSC: String,
    swiftCode: String,
    category: String,
    subCategory: String,
    idProof: String,
    date: {
        type: Date,
        default: Date.now
    }
}, { collection: 'sellerAuthCred' });

const productSchema = new mongoose.Schema({
    sellerId: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    productFeatures: { type: String, required: true },
    offers: { type: String, required: true },
    productImages: { type: [String], required: true },
    discount: { type: String, required: true },
    actualCost: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    stock: { type: String, required: true },
    deleted: { type: Boolean, require: false, default: false },
    date: {
        type: Date,
        default: Date.now
    }
}, { collection: 'products' });

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    subcategories: { type: [String], required: true },
    image: { type: String, required: true },
}, { collection: 'category' });

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    isSeller: { type: Boolean, required: true },
    cartData: [{
        productId: { type: String, required: true },
        quantity: { type: Number, required: true }
    }]
}, { collection: 'cartData' });

const orderSchema = new mongoose.Schema({
    customerId: String,
    customerName: String,
    customerAddress: String,
    customerEmail: String,
    customerPaymentType: String,
    productId: String,
    sellerId: String,
    productTitle: String,
    productImageName: String,
    desc: String,
    offers: String,
    actualCost: Number,
    discount: Number,
    quantity: Number,
    markAsSent: { type: Boolean, default: false },
    sellerCanceled: { type: Boolean, default: false },
    date: {
        type: Date,
        default: Date.now
    }
});

// usersSchema.methods.speak = function speak() {
//     const greeting = "Hello, " + this.name
//     console.log(greeting)
// };

const UserData = mongoose.model('usersAuthCred', usersSchema);
const SellerData = mongoose.model('sellerAuthCred', sellerSchema);
const ProductData = mongoose.model('products', productSchema);
const CartData = mongoose.model('cartData', cartSchema);
const OrderData = mongoose.model('orders', orderSchema);

app.post(authApiPath + "signup", async (req, res) => {

    const { name, email, password, town, city, state, country } = req.body;

    async function checkEmailAlreadyUsed() {

        const UserModel = mongoose.model('usersAuthCred', usersSchema);

        const UserDataFetched = await UserModel.find({ 'email': email });

        if (UserDataFetched.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    if (await checkEmailAlreadyUsed()) {
        return res.status(200).json({ uid: null, error: "Email already used by another account" });
    } else {
        const objUserData = new UserData({
            name: name,
            email: email,
            password: password,
            town: town,
            city: city,
            state: state,
            country: country
        });
        async function doInsert() {
            await objUserData.save().then(savedData => {
                id = savedData.id;
                return res.status(200).json({ uid: id });
            }).catch(err => {
                return res.status(500);
            });
        }
        doInsert()
    }
});

app.post(authApiPath + "login", async (req, res) => {

    const { email, password } = req.body;

    async function checkEmailExist() {
        const UserModel = mongoose.model('usersAuthCred', usersSchema);
        const UserDataFetched = await UserModel.find({ 'email': email });
        if (UserDataFetched.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    if (await checkEmailExist()) {

        const UserModel = mongoose.model('usersAuthCred', usersSchema);

        const UserDataFetched = await UserModel.find({ 'email': email, 'password': password });

        if (UserDataFetched.length > 0) {
            return res.status(200).json({ uid: UserDataFetched[0].id });
        } else {
            return res.status(200).json({ uid: null, error: "Invalid password" });
        }


    } else {
        console.log("email not exist")
        return res.status(200).json({ uid: null, error: "This email is not used by any account" });
    }

});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'ecommerce-website-idproof-uploaded');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({ storage: storage });

app.post(authApiPath + "seller-signup", upload.single('idProof'), async (req, res) => {

    idProof = req.file;
    const { name, phone, email, password, town, city, state, country, bankName, accountNumber, IFSC, swiftCode, category, subCategory } = req.body;

    async function checkEmailAlreadyUsed() {

        const SellerModel = mongoose.model('sellerAuthCred', sellerSchema);
        const SellerDataFetched = await SellerModel.find({ 'email': email });

        if (SellerDataFetched.length > 0) {
            console.log(true)
            return true;
        } else {
            console.log(false)
            return false;
        }
    }

    if (await checkEmailAlreadyUsed()) {
        return res.status(200).json({ uid: null, error: "Email already used by another account" });
    } else {
        const objSellerData = new SellerData({
            name: name,
            phone: phone,
            email: email,
            password: password,
            town: town,
            city: city,
            state: state,
            country: country,
            bankName: bankName,
            accountNumber: accountNumber,
            IFSC: IFSC,
            swiftCode: swiftCode,
            category: category,
            subCategory: subCategory,
            idProof: idProof.filename,
        });
        async function doInsert() {
            await objSellerData.save().then(savedData => {
                id = savedData.id;
                return res.status(200).json({ uid: id });
            }).catch(err => {
                return res.status(500);
            });
        }
        doInsert()
    }
});

app.post(authApiPath + "seller-login", async (req, res) => {

    const { email, password } = req.body;

    async function checkEmailExist() {
        const UserModel = mongoose.model('sellerAuthCred', sellerSchema);
        const SellerDataFetched = await UserModel.find({ 'email': email });
        if (SellerDataFetched.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    if (await checkEmailExist()) {

        const UserModel = mongoose.model('sellerAuthCred', sellerSchema);

        const SellerDataFetched = await UserModel.find({ 'email': email, 'password': password });

        if (SellerDataFetched.length > 0) {
            return res.status(200).json({ uid: SellerDataFetched[0].id });
        } else {
            return res.status(200).json({ uid: null, error: "Invalid password" });
        }


    } else {
        console.log("email not exist")
        return res.status(200).json({ uid: null, error: "This email is not used by any account" });
    }

});

const productImagesStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'product_images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const uploadProductImages = multer({ storage: productImagesStorage });

app.post(sellerApiPath + "add-product", uploadProductImages.array('productImages'), async (req, res) => {
    try {
        const { sellerId, title, desc, productFeatures, offers, discount, actualCost, category, subCategory, stock } = req.body;
        const productImages = req.files.map(file => file.filename);

        const objProduct = new ProductData({
            sellerId: sellerId,
            title: title,
            desc: desc,
            productFeatures: productFeatures,
            offers: offers,
            productImages: productImages,
            discount: discount,
            actualCost: actualCost,
            category: category,
            subCategory: subCategory,
            stock: stock,
            deleted: false
        });

        const savedData = await objProduct.save();
        const id = savedData._id;
        return res.status(200).json({ product_id: id, error: "" });
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});

app.get("/api/fetch-products", async (req, res) => {
    const count = req.query.count;
    // const productCategory = decodeURIComponent(req.query.category);
    const productCategory = req.query.category;

    const ProductModel = mongoose.model('products', productSchema);

    console.log(productCategory)

    try {

        let ProductDataFetched;

        if (productCategory) {
            ProductDataFetched = await ProductModel.find({
                stock: { $gt: 0 },
                category: productCategory
                , deleted: false
            })
                .sort({ createdAt: -1 })
                .limit(count)
                .exec();
        } else {
            ProductDataFetched = await ProductModel.find({ stock: { $gt: 0 }, deleted: false })
                .sort({ createdAt: -1 })
                .limit(count)
                .exec();
        }

        if (ProductDataFetched.length > 0) {
            return res.status(200).json(ProductDataFetched);
        } else {
            return res.status(404).json([]);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error fetching product data" });
    }

});

app.get("/api/fetch-product", async (req, res) => {

    const product_id = req.query.product_id;

    const ProductModel = mongoose.model('products', productSchema);

    try {
        const ProductDataFetched = await ProductModel.findOne({ _id: product_id, deleted: false })

        if (ProductDataFetched) {
            return res.status(200).json(ProductDataFetched);
        } else {
            return res.status(404).json([]);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error fetching product data" });
    }

});

app.get("/api/fetch-products-with-sub-category", async (req, res) => {
    const count = req.query.count;
    const productSubCategory = req.query.subCategory;

    console.log("resuest got    ")

    const ProductModel = mongoose.model('products', productSchema);

    console.log(productSubCategory)

    try {

        let ProductDataFetched;

        ProductDataFetched = await ProductModel.find({
            stock: { $gt: 0 },
            subCategory: productSubCategory,
            deleted: false
        })
            .sort({ createdAt: -1 })
            .limit(count)
            .exec();


        if (ProductDataFetched.length > 0) {
            return res.status(200).json(ProductDataFetched);
        } else {
            return res.status(404).json([]);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error fetching product data" });
    }

});

app.get("/api/fetch-seller-info", async (req, res) => {

    const seller_id = req.query.seller_id;

    const SellerModel = mongoose.model('sellerAuthCred', sellerSchema);

    try {
        const SellerDataFetched = await SellerModel.findOne({ _id: seller_id })

        if (SellerDataFetched) {
            return res.status(200).json(SellerDataFetched);
        } else {
            return res.status(404).json([]);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error fetching product data" });
    }

});

app.get("/api/fetch-category-data", async (req, res) => {

    const category = req.query.category;

    const CategoryModel = mongoose.model('category', categorySchema);

    try {
        let CategoryDataFetched;

        if (category) {
            CategoryDataFetched = await CategoryModel.findOne({ name: category })
        } else {
            CategoryDataFetched = await CategoryModel.find({})
        }

        if (CategoryDataFetched) {
            return res.status(200).json(CategoryDataFetched);
        } else {
            return res.status(404).json([]);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error fetching product data" });
    }

});

app.get('/product_images/:filename', (req, res) => {
    const filename = req.params.filename;
    res.sendFile(filename, { root: 'product_images' });
});

app.get('/category/:filename', (req, res) => {
    const filename = req.params.filename;
    res.sendFile(filename, { root: 'category' });
});

app.get("/api/seller-products-count", async (req, res) => {

    const sellerId = req.query.sellerId;

    try {
        const productCount = await ProductData.countDocuments({ sellerId: sellerId, deleted: false });
        res.status(200).json({ count: productCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching product count" });
    }
});

app.get("/api/fetch-products-of-seller", async (req, res) => {
    const sellerId = req.query.sellerId;

    const ProductModel = mongoose.model('products', productSchema);

    try {

        const ProductDataFetched = await ProductModel.find({ sellerId: sellerId, deleted: false })
            .sort({ createdAt: -1 })
            .exec();

        if (ProductDataFetched.length > 0) {
            return res.status(200).json(ProductDataFetched);
        } else {
            return res.status(404).json([]);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error fetching product data" });
    }

});

app.get('/api/seller-delete-product/', (req, res) => {
    const product_id = req.query.productId;

    const productIdObj = new ObjectId(product_id);

    ProductData.findByIdAndUpdate(productIdObj, { deleted: true }, { new: true })
        .then((updatedDocument) => {
            if (!updatedDocument) {

                return res.status(404).json({ status: 'Document not found' });
            }

            res.status(200).json({ status: 'Product deleted successfully' });
        })
        .catch((error) => {
            console.error('Error updating document:', error);
            res.status(500).json({ status: 'An error occurred' });
        });
});

app.post('/api/seller-update-product/', uploadProductImages.array('productImages'), (req, res) => {
    const product_id = req.query.productId;
    const { sellerId, title, desc, productFeatures, offers, discount, actualCost, category, subCategory, stock, currentProductImagePath } = req.body;
    const productImages = req.files.map(file => file.filename);


    console.log(productImages);

    const currentImage = JSON.parse(currentProductImagePath);


    let updatedFields;
    if (productImages.length > 0) {
        updatedFields = {
            sellerId,
            title,
            desc,
            productFeatures,
            offers,
            productImages,
            discount,
            actualCost,
            category,
            subCategory,
            stock
        };
    } else {
        updatedFields = {
            sellerId,
            title,
            desc,
            productFeatures,
            offers,
            discount,
            actualCost,
            category,
            subCategory,
            stock
        };
    }


    const productIdObj = new ObjectId(product_id);
    ProductData.findByIdAndUpdate(productIdObj, { $set: updatedFields }, { new: true })
        .then((updatedDocument) => {
            if (!updatedDocument) {
                console.log('no data found')
                return res.status(404).json({ status: 'Document not found' });
            }

            if (productImages.length > 0) {
                currentImage.forEach((imagePath) => {
                    const fullPath = path.join(__dirname, 'product_images', imagePath);
                    console.log("The full path is " + fullPath)
                    fs.unlinkSync(fullPath);
                });

            }

            console.log('data found')
            console.log(updatedDocument)

            res.status(200).json({ status: 'Product updated successfully' });
        })
        .catch((error) => {
            console.error('Error updating document:', error);
            res.status(500).json({ status: 'An error occurred' });
        });
});

app.post("/api/search-product/", async (req, res) => {
    const { query, category, subCategory, minPrice, maxPrice, minDiscountPercentage } = req.body;
    const ProductModel = mongoose.model('products', productSchema);
    const queryObj = {};

    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    const regexQuery = { $regex: query, $options: 'i' };
    queryObj.$or = [
        { title: regexQuery },
        { desc: regexQuery },
        { productFeatures: regexQuery }
    ];

    if (category) {
        queryObj.category = category;
    }

    if (subCategory) {
        queryObj.subCategory = subCategory;
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
        queryObj.actualCost = { $gte: minPrice, $lte: maxPrice };
    }


    if (minDiscountPercentage !== undefined) {
        queryObj.discount = { $gte: minDiscountPercentage };
    }

    console.log(queryObj)

    queryObj.deleted = false;
    queryObj.stock = { $gt: 0 };

    try {
        const ProductDataFetched = await ProductModel.find(queryObj);

        if (ProductDataFetched.length > 0) {
            console.log("data found")
            return res.status(200).json(ProductDataFetched);
        } else {
            return res.status(404).json([]);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error searching product data" });
    }



});

app.post("/api/product-add-to-cart/", async (req, res) => {
    const { userId, productId, isSeller, remove, decrease } = req.body;
    const quantity = 1;

    const existingCartData = await CartData.findOne({ userId: userId });

    if (existingCartData) {
        if (remove) {
            // Remove the entire branch of the product from the cart
            existingCartData.cartData = existingCartData.cartData.filter(item => item.productId !== productId);
        } else {
            // Check if the product already exists in the cart
            const existingProduct = existingCartData.cartData.find(item => item.productId === productId);

            if (existingProduct) {
                if (decrease) {
                    // Decrease the quantity by one
                    existingProduct.quantity -= quantity;

                    if (existingProduct.quantity <= 0) {
                        // If quantity becomes zero or negative, remove the product
                        existingCartData.cartData = existingCartData.cartData.filter(item => item.productId !== productId);
                    }
                } else {
                    // Product already exists, increase the quantity
                    existingProduct.quantity += quantity;
                }
            } else {
                // Product does not exist, add a new item
                existingCartData.cartData.push({
                    productId: productId,
                    quantity: quantity
                });
            }
        }

        existingCartData.save().then(savedData => {
            const id = savedData.id;
            return res.status(200).json({ cartId: id });
        }).catch(err => {
            return res.status(500).json({ "error": "Failed to enter data" });
        });
    } else {
        // No existing document found, create a new one
        const objCartData = new CartData({
            userId: userId,
            isSeller: isSeller,
            cartData: [{
                productId: productId,
                quantity: quantity
            }]
        });

        objCartData.save().then(savedData => {
            const id = savedData.id;
            return res.status(200).json({ cartId: id });
        }).catch(err => {
            return res.status(500).json({ "error": "Failed to enter data" });
        });
    }
});

app.post("/api/fetch-cart/", async (req, res) => {

    const userId = req.body.userId;

    const CartModel = mongoose.model('cartData', cartSchema);

    try {
        const CartDataFetched = await CartModel.findOne({ userId: userId })

        if (CartDataFetched) {
            return res.status(200).json(CartDataFetched.cartData);
        } else {
            return res.status(404).json([]);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error fetching product data" });
    }

});

app.post("/api/fetch-user-data/", async (req, res) => {

    const { userId, isSeller } = req.body;

    let SellerModel;
    let UserModel;
    if (isSeller) {
        SellerModel = mongoose.model('sellerAuthCred', sellerSchema);
    } else {
        UserModel = mongoose.model('usersAuthCred', usersSchema);
    }

    try {
        if (isSeller) {
            const SellerData = await SellerModel.findOne({ _id: userId })
            if (SellerData) {
                return res.status(200).json(SellerData);
            } else {
                return res.status(404).json([]);
            }
        } else {
            const UserData = await UserModel.findOne({ _id: userId })
            if (UserData) {
                return res.status(200).json(UserData);
            } else {
                return res.status(404).json([]);
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error fetching user data" });
    }

});

app.get("/api/empty-cart/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const existingCartData = await CartData.findOne({ userId: userId });

        if (existingCartData) {
            existingCartData.cartData = []; // Empty the cart data array
            await existingCartData.save();

            return res.status(200).json({ message: "Cart is empty" });
        } else {
            return res.status(404).json({ error: "Cart not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to empty cart" });
    }
});

async function emptyCart(userId) {
    try {
        const existingCartData = await CartData.findOne({ userId: userId });

        if (existingCartData) {
            existingCartData.cartData = []; // Empty the cart data array
            await existingCartData.save();
        } else {
            throw new Error("Cart not found");
        }
    } catch (error) {
        throw new Error("Failed to empty cart");
    }
}

async function checkProductHasInStock(productId, quantity) {
    try {
        const product = await ProductData.findById(productId);
        if (product && parseInt(product.stock) >= quantity) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

app.post("/api/place-order/", async (req, res) => {
    try {
        var message = "Order(s) placed successfully";
        // let userId;
        const orderData = req.body;
        for (const order of orderData) {
            const newOrder = new OrderData(order);
            if (await checkProductHasInStock(newOrder.productId, newOrder.quantity)) {
                await newOrder.save();
            } else {
                message += `, expect for ${newOrder.productTitle} due to stock`
            }
        }

        const userId = req.body[0].customerId;
        await emptyCart(userId);

        return res.status(200).json({ message: message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to place order(s)' });
    }
});

app.get("/api/check-orders/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        console.log(userId)

        const existingOrders = await OrderData.find({ customerId: userId });

        if (existingOrders.length > 0) {
            return res.status(200).json({ hasOrders: true });
        } else {
            return res.status(200).json({ hasOrders: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to check for orders" });
    }
});

app.get("/api/fetch-order-details/:customerId", async (req, res) => {
    try {
        const customerId = req.params.customerId;

        const orders = await OrderData.find({ customerId: customerId });

        return res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch order details" });
    }
});

app.get('/api/check-seller-orders/:sellerId', async (req, res) => {
    try {
        const { sellerId } = req.params;
        const orders = await OrderData.find({ sellerId });
        return res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

app.post('/api/seller-product-mark-as-sent/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    console.log("sent order id: " + orderId)

    OrderData.findOneAndUpdate({ _id: new ObjectId(orderId) }, { markAsSent: true })
        .then((order) => {
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            return res.status(200).json({ message: 'Product marked as sent' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ message: 'Failed to mark product as sent' });
        });
});

app.post('/api/seller-cancel-order/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    console.log("cancel order id: " + orderId)

    OrderData.findOneAndUpdate({ _id: new ObjectId(orderId) }, { sellerCanceled: true })
        .then((order) => {
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            return res.status(200).json({ message: 'Order canceled' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ message: 'Failed to cancel order' });
        });
});

app.get('/api/count-orders-of-seller/:sellerId', async (req, res) => {
    const sellerId = req.params.sellerId;

    try {
        const count = await OrderData.countDocuments({ sellerId: sellerId });
        res.status(200).json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error counting orders' });
    }
});

app.get('/api/count-orders-completed-of-seller/:sellerId', async (req, res) => {
    const sellerId = req.params.sellerId;

    try {
        const count = await OrderData.countDocuments({ sellerId: sellerId, markAsSent: true });
        res.status(200).json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error counting orders' });
    }
});

app.get('/api/seller-sales-cost/:sellerId', async (req, res) => {
    const sellerId = req.params.sellerId;

    try {
        const orders = await OrderData.find({ sellerId });

        // Calculate sales cost for each order and get the total sales cost
        const totalSalesCost = orders.reduce((acc, order) => {
            const { actualCost, discount, quantity } = order;
            const discountedCost = actualCost * (1 - discount / 100);
            const salesCost = discountedCost * quantity;
            return acc + salesCost;
        }, 0);

        res.status(200).json({ totalSalesCost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error calculating sales cost' });
    }
});

app.get('/api/fetch-recent-seller-orders/:sellerId', async (req, res) => {
    const { sellerId } = req.params;

    try {
        const orders = await OrderData.find({ sellerId })
            .sort({ orderDate: -1 })
            .limit(3);

        return res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch orders' });
    }
});


app.get('/api/fetch-seller-highest-sales/:sellerId', async (req, res) => {
    const { sellerId } = req.params;

    try {
        const highestSales = await OrderData.aggregate([
            {
                $match: { sellerId: sellerId }, // Filter documents by sellerId
            },
            {
                $group: {
                    _id: '$productId', // Group documents by productId
                    totalSales: { $sum: '$quantity' }, // Calculate total sales for each productId
                    orders: { $push: '$$ROOT' }, // Create an array of the entire document for each product group
                },
            },
            {
                $sort: { totalSales: -1 }, // Sort by totalSales in descending order to get the highest sales first
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the result
                    productId: '$_id', // Rename _id to productId
                    totalSales: 1, // Include totalSales in the result
                    orders: { $slice: ['$orders', 3] }, // Get only the top 3 orders for each product
                },
            },
        ]);

        const productData = highestSales.map(product => {
            // Extracting data for each product
            const { productId, totalSales } = product;
            const { actualCost, discount, productImageName } = product.orders[0]; // Assuming the first order has the same product data

            return {
                productId,
                totalSales,
                sellingCost: actualCost * (1 - discount / 100), // Calculate the selling cost based on the discount
                actualCost,
                discount: discount,
                productImageName,
            };
        });

        return res.status(200).json(productData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to get highest sales' });
    }
});

// ... (previous code)



app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
