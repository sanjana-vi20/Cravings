import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcrypt";
import { UploadMultipleToCloudinary } from "../utils/imageUploader.js";
import Menu from "../models/menuSchema.js";
import User from "../models/userModels.js";

export const ResUserUpdate = async (req, res, next) => {
  try {
    const {
      fullName,
      cuisine,
      restaurantName,
      email,
      mobnumber,
      gender,
      dob,
      city,
      address,
      pin,
      upi,  
      ifs_Code,
      account_number,
      opening,
      closing,
      lat, 
      lon,
    } = req.body;
    const currentUser = req.user;

    // if (fullName || email || mobnumber) {
    //   const error = new Error("All Fields are Required");
    //   error.statusCode = 400;
    //   return next(error);
    // }
    console.log("Old data ", currentUser);

    currentUser.fullName = fullName || currentUser.fullName;
    currentUser.cuisine = cuisine || currentUser.cuisine;
    currentUser.restaurantName = restaurantName || currentUser.restaurantName;
    currentUser.email = email || currentUser.email;
    currentUser.mobnumber = mobnumber || currentUser.mobnumber;
    currentUser.dob = dob || currentUser.dob;
    currentUser.gender = gender || currentUser.gender;
    currentUser.city = city|| currentUser.city;
    currentUser.address = address || currentUser.address;
    currentUser.pin = pin || currentUser.pin;
    currentUser.geoLocation.lat = lat || currentUser.geoLocation.lat;
    currentUser.geoLocation.lon = lon || currentUser.geoLocation.lon;
    currentUser.paymentDetails.upi = upi || currentUser.paymentDetails.upi;
    currentUser.paymentDetails.account_number = account_number || currentUser.paymentDetails.account_numbe;
    currentUser.paymentDetails.ifs_Code = ifs_Code || currentUser.paymentDetails.ifs_Code;
    // currentUser.documents.uidai = uidai;
    // currentUser.documents.pan = pan;
    currentUser.restaurantTiming.opening = opening || currentUser.restaurantTiming.opening;
    currentUser.restaurantTiming.closing = closing || currentUser.restaurantTiming.closing;

    let restaurantImages = [];
    // console.log(req.files);
    
    if (req.files) {
      restaurantImages = await UploadMultipleToCloudinary(req.files);
      console.log(restaurantImages);
    }
    if (restaurantImages.length > 0) {
      currentUser.restaurantImages = restaurantImages;
    }

    // const existingUser = await User.findOne({ email: currentUser.email });
    
    
    
      // if (restaurantImages.length > 0) {    
      //   existingUser.restaurantImages = restaurantImages;
      // } 



    await currentUser.save();

    console.log("New data ", currentUser);

    res
      .status(200)
      .json({ message: "Updated Successfully", data: currentUser });

    console.log("Updating the user");
  } catch (error) {
    next(error);
  }
};

export const ResUserPhotoUpdate = async (req, res, next) => {
  try {
    // console.log("body: ", req.body);

    // console.log("file:", req.file);

    const currentUser = req.user;
    const dp = req.file;
    if (!dp) {
      const error = new Error("Profile Picture required");
      error.statusCode = 400;
      return next(error);
    }
    if (currentUser.photo.publicID) {
      await cloudinary.uploader.destroy(currentUser.photo.publicID);
    }

    const b64 = Buffer.from(dp.buffer).toString("base64");
    console.log(b64.slice(0, 100));
    const dataURI = `data:${dp.mimetype};base64,${b64}`;
    console.log("Data URI", dataURI.slice(0, 100));

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "Cravings/User",
      width: 500,
      height: 500,
      crop: "fill",
    });

    console.log("Image Uploaded successfully :", result);
    currentUser.photo.url = result.secure_url;
    currentUser.photo.publicId = result.public_id;

    await currentUser.save();
    res.status(200).json({ message: "Photo Updated", data: currentUser });
  } catch (error) {
    next(error);
  }
};

export const ResUserResetPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const currentUser = req.user;

    if (!oldPassword || !newPassword) {
      const error = new Error("All Fields are Required");
      error.statusCode = 400;
      return next(error);
    }

    const isVerified = await bcrypt.compare(oldPassword, currentUser.password);
    if (!isVerified) {
      const error = new Error("Old Password didn't match");
      error.statusCode = 401;
      return next(error);
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    currentUser.password = hashPassword;

    await currentUser.save();

    res.status(200).json({ message: "Password Reset Successful" });
  } catch (error) {
    next(error);
  }
};

export const AddRestaurantMenuItem = async (req, res, next) => {
  try {
    const {
      dishName,
      cuisine,
      description,
      type,
      availability,
      price,
      preparationTime,
      servingsize,
    } = req.body;

    console.log(" body",req.body);
    
    if (
      !dishName ||
      !description ||
      !price ||
      !type ||
      !preparationTime ||
      !availability ||
      !servingsize ||
      !cuisine
    ) {
      const error = new Error("All Fields are Required");
      error.statusCode = 400;
      return next(error);
    }

    const CurrentUser = req.user;
    const image = await UploadMultipleToCloudinary(req.files);
    console.log(image);

    const newMenuItem = await Menu.create({
      dishName,
      description,
      price,
      type,
      preparationTime,
      availability,
      servingsize,
      cuisine,
      image,
      restaurantID: CurrentUser._id,
    });

    console.log( "newMenu" , newMenuItem);
  
    res.status(201).json({
      message: "Menu Item Added Successfully",
      data: newMenuItem,
    });
  } catch (error) {
    next(error);
  }
};

export const GetRestaurantMenuItem = async (req, res, next) => {
  try {
    const CurrentUser = req.user;
    const menuItems = await Menu.find({ restaurantID: CurrentUser._id });
    console.log( "menu " , menuItems);

    res.status(200).json({
      message: "Menu Items Fetched Successfully",
      data: menuItems,
    });
  } catch (error) {
    next(error);
  }
};


export const RestaurantEditMenuItem = async (req, res, next) => {
  try {
    const {
      dishName,
      description,
      price,
      type,
      preparationTime,
      availability,
      servingsize,
      
    } = req.body;

    const { id } = req.params;


    if (
      !dishName ||
      !description ||
      !price ||
      !type ||
      !preparationTime ||
      !availability ||
      !servingsize 
      
    ) {
      const error = new Error("All Fields are Required");
      error.statusCode = 400;
      return next(error);
    }

    let image = [];
    if (req.files) {
      image = await UploadMultipleToCloudinary(req.files);
      console.log(image);
    }

    const existingMenuItem = await Menu.findById(id);

    existingMenuItem.dishName = dishName || existingMenuItem.dishName;
    existingMenuItem.description = description || existingMenuItem.description;
    existingMenuItem.price = price || existingMenuItem.price;
    existingMenuItem.type = type || existingMenuItem.type;
    existingMenuItem.preparationTime =
      preparationTime || existingMenuItem.preparationTime;
    existingMenuItem.availability =
      availability || existingMenuItem.availability;
    existingMenuItem.servingsize = servingsize || existingMenuItem.servingsize;
    // existingMenuItem.cuisine = cuisine || existingMenuItem.cuisine;
    existingMenuItem.image =
      image.length > 0 ? image : existingMenuItem.image;
    await existingMenuItem.save();

    res.status(201).json({
      message: "Menu Item Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};

