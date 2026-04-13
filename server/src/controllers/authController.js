import User from "../models/userModels.js";
import bcrypt from "bcrypt";
import { genOTPToken, genToken } from "../utils/authToken.js";
import OTP from "../models/otpModel.js";
import { sentOTPEmail } from "../utils/emailService.js";

export const UserRegister = async (req, res, next) => {
  try {
    const { fullName, email, mobnumber, password, role } = req.body;

    if (!fullName || !email || !mobnumber || !password || !role) {
      const error = new Error("All Fields are Required");
      error.statusCode = 400;
      return next(error);
    }
    // check for duplicate user before register
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email already Registered");
      error.statusCode = 409;
      return next(error);
    }

    // encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const photoURL = `https://placehold.co/600x400?text=${fullName.charAt(0).toUpperCase()}`;
    const photo = {
      url: photoURL,
    };
    // save data to database

    const newUser = await User.create({
      fullName,
      email,
      mobnumber,
      password: hashPassword,
      role,
      photo,
    });

    // send response to frontend

    console.log(newUser);

    res.status(201).json({ message: "Registered Successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("All Fields are Required");
      error.statusCode = 400;
      return next(error);
    }

    // check for duplicate user before register
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error("Email not Registered");
      error.statusCode = 401;
      return next(error);
    }

    const isVerified = await bcrypt.compare(password, existingUser.password);
    if (!isVerified) {
      const error = new Error("Wrong Password");
      error.statusCode = 401;
      return next(error);
    }

    await genToken(existingUser, res);

    res.status(200).json({ message: "Login Successfully", data: existingUser });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const UserLogout = async (req, res, next) => {
  try {
    res.clearCookie("oreo");
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const UserGenOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    //verify that all data exist
    if (!email) {
      const error = new Error("All feilds required");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error("Email not registered");
      error.statusCode = 401;
      return next(error);
    }

    await OTP.deleteMany({ email: email });
    const otp = Math.floor(Math.random() * 900000 + 100000).toString();
    // const existingUserOTP = await OTP.findOne({ email });
    
    // bcrypt otp

    const salt = await bcrypt.genSalt(10);
    const hashOtp = await bcrypt.hash(otp, salt);

    await OTP.create({
      email,
      otp: hashOtp,
    });

    sentOTPEmail(email, otp);

    res.status(200).json({ message: "OTP send on registered email" });
  } catch (error) {
    next(error);
  }
};

export const UserVerifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      const error = new Error("All Fields are Required");
      error.statusCode = 400;
      return next(error);
    }

    // check for duplicate user before register
    const existingUserOTP = await OTP.findOne({ email });
    if (!existingUserOTP) {
      const error = new Error("OTP Match error");
      error.statusCode = 401;
      return next(error);
    }

    const isVerified = await bcrypt.compare(otp, existingUserOTP.otp);
    if (!isVerified) {
      const error = new Error("OTP Match error");
      error.statusCode = 401;
      return next(error);
    }
    // existingUserOTP.remove();

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error("Email not registered");
      error.statusCode = 401;
      return next(error);
    }

    await genOTPToken(existingUser, res);

    res.status(200).json({ message: "OTP Verified." });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const UserForgetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const currentUser = req.user;

    if (!newPassword) {
      const error = new Error("All Fields are Required");
      error.statusCode = 400;
      return next(error);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    currentUser.password = hashPassword;
    await currentUser.save();

    res
      .status(200)
      .clearCookie("otpToken")
      .json({ message: "Password Changed" });
  } catch (error) {
    next(error);
  }
};
