import express from 'express';
import {AllMenu, GetAllRestaurants,filteredMenu, NewContact} from '../controllers/publicController.js'
import { GetRestaurantItems } from '../controllers/publicController.js';

const router = express.Router();

router.post('/new-contact' , NewContact);
router.get("/allRestaurants", GetAllRestaurants);
router.get("/single-menu/:id" ,  GetRestaurantItems );
router.get("/fetchAllMenu" , AllMenu )
router.post("/fetchMenu" , filteredMenu);

export default router;
