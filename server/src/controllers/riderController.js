import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcrypt";
import Order from "../models/orderModel.js";
import { calculateDistance } from "../utils/riderUtility.js";

export const RiderUpdate = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      mobnumber,
      gender,
      dob,
      city,
      address,
      pin,
      geoLocation, // Extract the object
      paymentDetails, // Extract the object
      documents,
    } = req.body;
    const currentUser = req.user;

    if (!fullName || !mobnumber) {
      const error = new Error("All Fields are Required");
      error.statusCode = 400;
      return next(error);
    }
    console.log("Old data ", currentUser);

    currentUser.fullName = fullName;
    currentUser.email = email;
    currentUser.mobnumber = mobnumber;
    currentUser.dob = dob;
    currentUser.gender = gender;
    currentUser.city = city;
    currentUser.address = address;
    currentUser.pin = pin;
    currentUser.geoLocation.lat = geoLocation.lat;
    currentUser.geoLocation.lon = geoLocation.lon;
    currentUser.paymentDetails.upi = paymentDetails.upi;
    currentUser.paymentDetails.account_number = paymentDetails.account_number;
    currentUser.paymentDetails.ifs_Code = paymentDetails.ifs_Code;
    currentUser.documents.uidai = documents.uidai;
    currentUser.documents.dl = documents.dl;
    currentUser.documents.rc = documents.rc;
    currentUser.documents.pan = documents.pan;

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

export const RiderPhotoUpdate = async (req, res, next) => {
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

export const RiderResetPassword = async (req, res, next) => {
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

export const GetAllOrders = async (req, res, next) => {
  try {
    //console.log("RiderGetAvailableOrder called with body: ", req.body)
    const { lat, lng } = req.query;
    const currentRiderId = req.user?._id;
    console.log("Latitude: ", lat, "Longitude: ", lng);

   const availableOrders = await Order.find({
      status: { $in: ["ready", "pickedUp", "onTheWay"] },
      $or: [
        { riderId: null }, // Naye orders jo kisi ne accept nahi kiye
        { riderId: currentRiderId } // Woh orders jo is current rider ne accept ya pick kiye hain
      ]
    })
      .populate("userId")
      .populate("restaurantId");

    console.log(
      "Available Orders before distance calculation: ",
      availableOrders,
    );

    availableOrders.map((order) => {
      console.log(order.restaurantId.geoLocation);
    });

    const AvailableOrdersWithDistance = await calculateDistance(
      availableOrders,
      lat,
      lng,
    );

    console.log(
      "Available Orders With Distance: ",
      AvailableOrdersWithDistance,
    );

    res.status(200).json({
      message: "Available Orders Fetched Successfully",
      data: AvailableOrdersWithDistance,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateOrderStatus = async (req, res, next) => {
  try {
    const currentUser = req.user._id; // Logged-in rider ki ID
    const { id } = req.params; // Order ID
    const { status } = req.body; // Frontend se status aayega (e.g., "onTheWay")

    // ======= ✅ UPDATE STATUS AND RIDER ID =======
    const updatedOrder = await Order.findOneAndUpdate(
      { 
        _id: id // Sirf Order ID se dhoondo taaki kisi bhi open order ko rider pick kar sake
      },
      { 
        status: status,         // Status update karo (e.g., "onTheWay")
        riderId: currentUser    // Rider ki ID database me save karo
      },
      { 
        new: true // Updated data return karega
      }
    ).populate("userId"); // Customer details notification ke liye

    // Agar order nahi mila
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2. 🔥 SOCKET NOTIFICATION
    const io = req.app.get("socketio");
    if (io) {
      // (A) CUSTOMER KO BATAO
      io.to(updatedOrder.userId._id.toString()).emit("order_status_update", {
        orderId: updatedOrder._id,
        status: updatedOrder.status,
        message: status === "onTheWay" 
          ? "Rider has picked up your order! 🚀" 
          : "Order delivered successfully! ✅",
      });

      // (B) BAAKI RIDERS KO BATAO: Dashboard update karne ke liye
      io.emit("rider_dashboard_update", {
        orderId: updatedOrder._id,
        status: updatedOrder.status,
        updatedOrder: updatedOrder,
      });

      console.log(`Rider ${currentUser} updated Order ${id} to ${status}`);
    }

    res.status(200).json({
      message: `Order status updated to ${status} and assigned to rider.`,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};