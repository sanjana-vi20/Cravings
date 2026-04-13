import express from 'express';
import { UserPhotoUpdate, UserResetPassword, UserUpdate } from '../controllers/userController.js';
import { Protect } from '../middleware/userMiddleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.put("/update" ,Protect, UserUpdate);
router.patch("/photo-update" ,Protect, upload.single("image"), UserPhotoUpdate );
router.patch("/resetPassword" ,Protect, UserResetPassword);


export default router;