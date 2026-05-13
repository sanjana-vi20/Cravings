import multer from "multer";
import { RiderPhotoUpdate, RiderResetPassword, RiderUpdate , GetAllOrders , UpdateOrderStatus } from "../controllers/riderController.js";
import express from 'express';
import { Protect } from "../middleware/userMiddleware.js";

const router = express.Router();

const upload = multer();

router.put("/update" ,Protect, RiderUpdate);
router.patch("/photo-update" ,Protect, upload.single("image"), RiderPhotoUpdate );
router.patch("/resetPassword" ,Protect, RiderResetPassword);
router.get('/get-orders' , Protect , GetAllOrders);
router.put('/update-order-status/:id' , Protect , UpdateOrderStatus);

export default router;