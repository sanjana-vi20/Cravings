

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import cloudinary from "./src/config/cloudinary.js";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";
import AuthRouter from "./src/routers/authRouter.js";
import PublicRouter from "./src/routers/publicRouter.js";
import UserRouter from "./src/routers/userRouter.js";
import PaymentRouter from "./src/routers/paymentRouter.js";
import ManagerRouter from "./src/routers/managerRouter.js";
import RiderRouter from "./src/routers/riderRouter.js";

import morgan from 'morgan';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Tumhara Frontend URL
    methods: ["GET", "POST"],
    credentials: true
  },
  allowEIO3: true, // Compatibility ke liye
  transports: ['websocket', 'polling'] // Dono allow karo
});
app.set("socketio", io);

app.use(cors({ origin: ["http://localhost:5173"] , credentials:true }));
app.use(express.json());
app.use(cookieParser())
app.use(morgan("dev"));

io.on("connection", (socket) => {
  console.log("New User Connected:", socket.id);

  // Jab manager dashboard khulega, wo apne restaurant ki ID se room join karega
  socket.on("join_restaurant", (restaurantId) => {
    socket.join(restaurantId);
    console.log(`Manager joined room: ${restaurantId}`);
  });
  
  socket.on("join_user", (userId) => {
    socket.join(userId);
    console.log(`Customer joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

app.use("/auth", AuthRouter);
app.use("/public" , PublicRouter);
app.use("/user" , UserRouter);
app.use("/rider" , RiderRouter);
app.use("/payment" , PaymentRouter);
app.use("/restaurant" , ManagerRouter);

app.get("/", (req, res) => {
  console.log("Server is Running");
});

app.use((err, req, res, next) => {
  const ErrorMessage = err.message || "Internal Server Error";
  const StatusCode = err.statusCode || 500;

  res.status(StatusCode).json({ message: ErrorMessage });
});

const port = process.env.PORT || 5000;

httpServer.listen(port, async() => {
  console.log("Server Started at Port :", port);
  connectDB();
  try {
    const res = await cloudinary.api.ping();
    console.log("Cloudinary Api is Working :" , res);
    
  } catch (error) {
    console.error("Error Connecting Cloudinary API :" ,error);
  }
});
