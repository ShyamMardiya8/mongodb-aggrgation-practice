const Books = require("../model/books.model");
const Rental = require("../model/rentals.model");
const { addResponse } = require("../utility/helper");
const { topRentals } = require("./users.controller");

const booksServices = {
  stockReport: async (req, res) => {
    try {
      const fetchStockReport = await Books.aggregate([
        {
          $lookup: {
            from: "rentals",
            foreignField: "bookId",
            localField: "_id",
            as: "stockReport",
          },
        },
        {
          $unwind: "$stockReport",
        },
        {
          $group: {
            _id: {
              bookId: "$stockReport.bookId",
              title: "$title",
              category: "$category",
              stock: "$stock",
            },
            totalRented: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            bookId: "$_id.bookId",
            title: "$_id.title",
            category: "$_id.category",
            stock: "$_id.stock",
            totalRented: 1,
            remainingStock: {
              $subtract: ["$_id.stock", "$totalRented"],
            },
          },
        },
        {
          $sort: { totalRented: -1 },
        },
        {
          $limit: 5,
        },
      ]);

      return addResponse(res, {
        status: 200,
        success: true,
        data: fetchStockReport,
        message: "Stock report generated successfully",
      });
    } catch (error) {
      console.log(error.message);
    }
  },
  booksTopCategories: async (req, res) => {
    try {
      const fetchTopCategories = await Books.aggregate([
        {
          $lookup: {
            from: "rentals",
            localField: "_id",
            foreignField: "bookId",
            as: "topCategory",
          },
        },
        {
          $unwind: "$topCategory",
        },
        {
          $group: {
            _id: "$category",
            topRented: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            topRented: 1,
          },
        },
        {
          $sort: { topRented: -1 },
        },
        {
          $limit: 3,
        },
      ]);

      return addResponse(res, {
        status: 200,
        success: true,
        message: "Top rented categories fetched successfully",
        data: fetchTopCategories,
      });
    } catch (error) {
      console.log(error.message);
    }
  },
  avgByCategoryPrice: async (req, res) => {
    try {
      const fetchAvgCategoryPrice = await Books.aggregate([
        {
          $group: {
            _id: "$category",
            averagePrice: { $avg: "$price" },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            averagePrice: 1,
          },
        },
        {
          $sort: { category: -1 },
        },
      ]);

      return addResponse(res, {
        success: true,
        status: 200,
        message: "Average price by category fetched successfully",
        data: fetchAvgCategoryPrice,
      });
    } catch (error) {
      console.log(error.message);
    }
  },
};

module.exports = booksServices;
