import Contact from "../models/contactModel.js";
import Menu from "../models/menuSchema.js";
// import Menu from "../models/menuSchema.js";
import User from "../models/userModels.js";

export const NewContact = async (req, res, next) => {
  try {
    const { fullName, email, mobnumber, message } = req.body;

    if (!fullName || !email || !mobnumber || !message) {
      const error = new Error("All Fields are Required");
      error.statusCode = 400;
      return next(error);
    }

    const userQuery = await Contact.create({
      fullName,
      email,
      mobnumber,
      message,
    });

    console.log(userQuery);
    res.status(201).json({
      message:
        "Thanks for Contacting us. We will Get Back to you in 24-48 Hours",
    });
  } catch (error) {
    next(error);
  }
};

export const GetAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await User.find({ role: "manager" }).select(
      "-password",
    );

    res.status(200).json({
      message: "Restaurants fetched successfully",
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};

export const GetRestaurantItems = async (req, res, next) => {
  const id = req.params.id;

  console.log("id : ", id);

  try {
    const items = await User.find({ _id: id }).populate("myMenu");
    console.log(items);
    res.status(200).json({
      message: "Restaurants items fetched successfully",
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const filteredMenu = async (req, res, next) => {
  try {
    const allId = req.body;
    console.log("allId : ", allId);
    const ids = allId.arrayId;

    const AllMenuItems = await Menu.find({ _id: { $in: ids } }).populate(
      "restaurantID",
      "restaurantName",
    );
    console.log("Menu :", AllMenuItems);

    res.status(200).json({
      message: "data fetched successfully",
      data: AllMenuItems,
    });
  } catch (error) {
    next(error);
  }
};

export const AllMenu = async (req, res, next) => {
  try {
    const menus = await Menu.find({
      availability: { $eq: true },
    }).populate({
      path: "restaurantID", // Menu schema ki woh field jo User ko point karti hai
      select: "restaurantName",
    });
    console.log("menus: ", menus);

    res.status(200).json({
      message: "Restaurants items fetched successfully",
      data: menus,
    });
  } catch (error) {
    next(error);
  }
};
