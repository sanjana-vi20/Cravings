import express from "express";
import {
  UserGenOTP,
  UserLogin,
  UserLogout,
  UserRegister,
  UserVerifyOtp,
  UserForgetPassword,
} from "../controllers/authController.js";
import { OtpProtect } from "../middleware/userMiddleware.js";

const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.get("/logout", UserLogout);
router.post("/getOtp", UserGenOTP);
router.post("/verifyOtp", UserVerifyOtp);
router.post("/forgetPassword", OtpProtect, UserForgetPassword);


export default router;
