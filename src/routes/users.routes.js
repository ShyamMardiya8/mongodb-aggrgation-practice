const express = require("express");
const userService = require("../controllers/users.controller");

const route = express.Router();

route.get("/users/stats/city-distribution", userService.cityDistribution);
route.get("/users/stats/monthly-signups", userService.monthlySignUp);
route.get("/users/top-renters", userService.cityDistribution);
route.get("/users/:id/category-trends", userService.cityDistribution);

module.exports = route;
