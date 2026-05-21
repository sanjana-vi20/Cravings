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

// Allowed origins array dono socket aur express ke liye
const allowedOrigins = [
  "http://localhost:5173",
  "https://cravingsoffood.netlify.app",
  "https://6a0dabafdb2baf461aeeafd3--cravingsoffood.netlify.app"
];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  allowEIO3: true,
  transports: ['websocket', 'polling']
});
app.set("socketio", io);

// Express CORS fix (Ab Netlify aur Localhost dono chalenge)
app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

io.on("connection", (socket) => {
  console.log("New User Connected:", socket.id);

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

// Root Route Fix (Render ka health-check response dena zaroori hai!)
app.get("/", (req, res) => {
  console.log("Server is Running");
  res.status(200).json({ status: "OK", message: "Server is Running Smoothly!" });
});

app.use("/auth", AuthRouter);
app.use("/public" , PublicRouter);
app.use("/user" , UserRouter);
app.use("/rider" , RiderRouter);
app.use("/payment" , PaymentRouter);
app.use("/restaurant" , ManagerRouter);

app.use((err, req, res, next) => {
  const ErrorMessage = err.message || "Internal Server Error";
  const StatusCode = err.statusCode || 500;
  res.status(StatusCode).json({ message: ErrorMessage });
});

// Render ke liye default port 10000 hota hai agar env me na ho
const port = process.env.PORT || 10000;

// Host '0.0.0.0' specify karna Render ke liye bohot zaroori hai
httpServer.listen(port, '0.0.0.0', async () => {
  console.log("Server Started at Port :", port);
  await connectDB();
  try {
    const res = await cloudinary.api.ping();
    console.log("Cloudinary Api is Working :", res);
  } catch (error) {
    console.error("Error Connecting Cloudinary API :", error);
  }
});