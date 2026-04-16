import multer from "multer";
import { RiderPhotoUpdate, RiderResetPassword, RiderUpdate } from "../controllers/riderController.js";
import express from 'express';
import { Protect } from "../middleware/userMiddleware.js";

const router = express.Router();

const upload = multer();

router.put("/update" ,Protect, RiderUpdate);
router.patch("/photo-update" ,Protect, upload.single("image"), RiderPhotoUpdate );
router.patch("/resetPassword" ,Protect, RiderResetPassword);

export default router;