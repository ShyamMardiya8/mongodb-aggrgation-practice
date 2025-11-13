const express = require("express");
const userService = require("../controllers/users.controller");

const route = express.Router();

route.get("/users/stats/city-distribution", userService.cityDistribution);
route.get("/users/stats/monthly-signups", userService.monthlySignUp);
route.get("/users/top-renters", userService.topRentals);
route.get("/users/:id/category-trends", userService.categoryTreads);

module.exports = route;
