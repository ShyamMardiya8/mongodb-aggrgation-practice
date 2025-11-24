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
  rentalsDetails: async (req, res) => {
    try {
      const rentalDetails = await Rental.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $lookup: {
            from: "books",
            localField: "bookId",
            foreignField: "_id",
            as: "bookDetails",
          },
        },
        {
          $unwind: "$bookDetails",
        },
        {
          $project: {
            rentalId: "$_id",
            users: "$userDetails",
            book: "$bookDetails",
            rentedAt: 1,
            returnedAt: 1,
            rentalPrice: 1,
            status: {
              $cond: [{ $eq: ["$returnedAt", null] }, "active", "returned"],
            },
          },
        },
      ]);
      return addResponse(res, {
        success: true,
        status: 200,
        message: "rental details fetched successfully",
        data: rentalDetails,
      });
    } catch (error) {
      console.log(error.message);
    }
  },
  userSummery: async (req, res) => {
    try {
      const fetchUserSummary = await Rental.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },

        // STEP 1: Calculate fine for each rental
        {
          $project: {
            userId: "$user._id",
            user: {
              name: "$user.name",
              email: "$user.email",
              city: "$user.city",
            },
            fine: {
              $multiply: [
                {
                  $dateDiff: {
                    startDate: "$rentedAt",
                    endDate: {
                      $ifNull: ["$returnedAt", new Date()], // if not returned, use today
                    },
                    unit: "day",
                  },
                },
                5, // fine rate
              ],
            },
          },
        },

        // STEP 2: Group by user
        {
          $group: {
            _id: "$userId",
            user: { $first: "$user" },
            totalRentals: { $sum: 1 },
            totalFine: { $sum: "$fine" },
          },
        },

        // STEP 3: Clean output
        {
          $project: {
            _id: 0,
            userId: "$_id",
            user: 1,
            totalRentals: 1,
            totalFine: 1,
          },
        },
      ]);

      return addResponse(res, {
        message: "fetch user summery",
        status: 200,
        success: true,
        data: fetchUserSummary,
      });
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = rentalService;
