const Rental = require("../model/rentals.model");
const { addResponse } = require("../utility/helper");

const rentalService = {
  rentalActive: async (req, res) => {
    try {
      const rentalActive = await Rental.aggregate([
        {
          $match: {
            returnedAt: null,
          },
        },
        {
          $lookup: {
            from: "books",
            localField: "bookId",
            foreignField: "_id",
            as: "rentalActive",
          },
        },
        {
          $unwind: "$rentalActive",
        },
        {
          $project: {
            _id: 0,
            userId: "$userId",
            bookId: "$bookId",
            bookTitle: "$rentalActive.title",
            returnedAt: "$returnedAt",
            rentedOn: "$rentedAt",
            rentedId: "$_id",
          },
        },
        {
          $limit: 5,
        },
      ]);

      return addResponse(res, {
        success: true,
        status: 200,
        message: "rental active fetched",
        data: rentalActive,
      });
    } catch (error) {
      console.error(error);
    }
  },
  revenueMonthly: async (req, res) => {
    try {
      const revenueMonthly = await Rental.aggregate([
        {
          $lookup: {
            from: "books",
            localField: "bookId",
            foreignField: "_id",
            as: "revenueMonthly",
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$rentedAt" },
              month: { $month: "$rentedAt" },
            },
            totalAmount: { $sum: "$rentalPrice" },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            totalAmount: 1,
          },
        },
        {
          $sort: { year: 1, month: 1 },
        },
      ]);
      return addResponse(res, {
        success: true,
        status: 200,
        message: "monthly revenue fetched sucessful",
        data: revenueMonthly,
      });
    } catch (error) {
      console.log(error.message);
    }
  },
};

module.exports = rentalService;
