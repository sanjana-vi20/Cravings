import express from "express";
import {
  AddRestaurantMenuItem,
  GetRestaurantMenuItem,
  RestaurantEditMenuItem,
  ResUserPhotoUpdate,
  ResUserResetPassword,
  ResUserUpdate,
} from "../controllers/restaurantController.js";
import { ManagerProtect, Protect } from "../middleware/userMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.put(
  "/update",
  Protect,
  upload.array("restaurantImages", 5),
  ResUserUpdate,
);
router.patch(
  "/photo-update",
  Protect,
  upload.single("image"),
  ResUserPhotoUpdate,
);
router.patch("/resetPassword", Protect, ResUserResetPassword);
router.post(
  "/addMenu",
  Protect,
  ManagerProtect,
  upload.array("image", 5),
  AddRestaurantMenuItem,
);
router.get("/menuItems", Protect, ManagerProtect, GetRestaurantMenuItem);

router.put(
  "/updateMenuItem/:id",
  Protect,
  ManagerProtect,
  upload.array("image", 5),
  RestaurantEditMenuItem,
);



export default router;
