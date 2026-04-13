import cloudinary from "../config/cloudinary.js";
import bcrypt from 'bcrypt'

export const UserUpdate = async (req, res, next) => {
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

    if (!fullName || !email || !mobnumber) {
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

export const UserPhotoUpdate = async (req, res, next) => {
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

export const UserResetPassword = async (req, res, next) => {
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
