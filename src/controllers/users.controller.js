const User = require("../model/users.model");
const { addResponse } = require("../utility/helper");

const userService = {
  cityDistribution: async (req, res) => {
    try {
      const fetchUserCity = await User.aggregate([
        {
          $group: {
            _id: {
              name: "$name",
              city: "$city",
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id.name",
            city: "$_id.city",
          },
        },
      ]);

      return addResponse(res, {
        status: 200,
        success: true,
        data: fetchUserCity,
        message: "User distribution by city fetched successfully",
      });
    } catch (err) {
      console.log(err.message);
    }
  },
  monthlySignUp: async (req, res) => {
    try {
      const userMontlySingUp = await User.aggregate([
        {
          $group: {
            _id: {
              month: "$createdAt",
            },
            totalCount: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            month: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$_id.month",
                timezone: "America/New_York",
              },
            },
            totalCount: 1,
          },
        },
      ]);
      return addResponse(res, {
        success: true,
        data: userMontlySingUp,
        message: "Monthly signup stats fetched successfully",
      });
    } catch (error) {
      console.log(error.message);
    }
  },
};

module.exports = userService;
