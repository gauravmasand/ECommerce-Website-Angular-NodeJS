# ECommerce Website (Angular + NodeJS)

Welcome to the ECommerce Website project! This repository contains the source code for an ECommerce website developed using Angular for the frontend and Node.js for the backend.

## Project Overview

This project aims to create a modern and user-friendly ECommerce website that allows customers to browse products, make purchases, and sellers to manage their products and orders.

### Features

- Browse and search for products
- View product details including images, prices, and descriptions
- Add products to the shopping cart
- Proceed to checkout and make purchases
- Seller dashboard to manage products and orders

## Technologies Used

- Frontend: Angular
- Backend: Node.js, Express
- Database: MongoDB
- UI Framework: Bootstrap

## Getting Started

Follow these steps to set up and run the project locally on your machine.

### Prerequisites

Make sure you have the following software installed:

- Node.js: [Download Link](https://nodejs.org/)
- MongoDB: [Download Link](https://www.mongodb.com/try/download/community)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/ecommerce.git 
```

## Navigate to the project directory:
```
cd ecommerce
```
## Install frontend and backend dependencies:

```
npm install
```
## Setting Up the Database
1. Make sure MongoDB is running on your machine.
2. Import the sample database data:
```
mongorestore --db ecommerce-site database-data/
```
## Running the Server
1. Start the backend server using nodemon:
```
npm run dev
```
or
```
nodemon ./index.js
```
## Running the Frontend
1. Start the frontend development server:
```
ng serve --open
```

## Project Structure
 * src/: Source code for both frontend and backend.
 * database-data/: Sample database data to import.
 * screenshots/: Screenshots of the project.
