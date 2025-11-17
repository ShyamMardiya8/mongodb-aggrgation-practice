const express = require("express");
const userService = require("../controllers/users.controller");
const booksServices = require("../controllers/books.controller");
const rentalService = require("../controllers/rental.controller");

const route = express.Router();
// users module
route.get("/users/stats/city-distribution", userService.cityDistribution);
route.get("/users/stats/monthly-signups", userService.monthlySignUp);
route.get("/users/top-renters", userService.topRentals);
route.get("/users/:id/category-trends", userService.categoryTreads);

// books module

route.get("/books/stock/report", booksServices.stockReport);
route.get("/books/top-categories", booksServices.booksTopCategories);
route.get("/books/price/avg-by-category", booksServices.avgByCategoryPrice);

// rentals module

route.get("/rentals/active", rentalService.rentalActive);
route.get("/rentals/revenue/monthly", rentalService.revenueMonthly);
route.get("/rentals/details", rentalService.rentalsDetails);
module.exports = route;
