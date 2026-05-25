# 🍕 **CRAVINGS – Full Stack Food Delivery Platform**

> A Complete MERN Stack Solution for Restaurant Management, Order Tracking & Real-time Delivery

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Available Features](#available-features)
3. [Tech Stack](#tech-stack)
4. [User Roles & Workflows](#user-roles--workflows)
5. [Installation & Setup](#installation--setup)
6. [API Endpoints](#api-endpoints)
7. [Database Models](#database-models)
8. [Project Structure](#project-structure)
9. [Key Features Breakdown](#key-features-breakdown)

---

## 🎯 Project Overview

**Cravings** is a comprehensive full-stack food delivery platform that connects **Customers**, **Restaurants**, **Delivery Riders**, and **Admins** in a seamless ecosystem.

### 🔁 Complete Order Lifecycle

> **Customer Browse → Order → Payment → Restaurant Accept → Prepare → Rider Pick-up → Delivery → Review & Rating**

### 🎯 Problem Statement

Traditional food delivery apps need:
- ✅ Multi-role support (Customer, Restaurant Partner, Rider, Admin)
- ✅ Real-time order tracking with Socket.io
- ✅ Seamless payment integration
- ✅ Restaurant menu management
- ✅ Location-based delivery routing
- ✅ Order status notifications
- ✅ Review & rating system

**Cravings solves all of this** with a production-ready MERN architecture!

**Base URL**: `http://localhost:5000` (Backend) | `http://localhost:5173` (Frontend)

---

## ✨ Available Features

### 🔐 Authentication & Security

| Feature | Details | Status |
|---------|---------|--------|
| **User Registration** | Register as Customer, Restaurant Partner, or Rider | ✅ Working |
| **User Login** | Secure JWT-based authentication | ✅ Working |
| **OTP Verification** | Email-based OTP verification | ✅ Working |
| **Password Hashing** | BCrypt with salt rounds | ✅ Working |
| **JWT Token Management** | Secure token generation and validation | ✅ Working |
| **Role-Based Access Control** | Different access for each user role | ✅ Working |
| **Profile Photo Upload** | Cloudinary-based image storage | ✅ Working |
| **Email Notifications** | Nodemailer integration for updates | ✅ Working |

**Endpoints**:
- `POST /auth/register` – Register new user
- `POST /auth/login` – Login user
- `POST /auth/verify-otp` – OTP verification

---

### 🏪 Restaurant Management Features

| Feature | Details | Status |
|---------|---------|--------|
| **Restaurant Profile** | Restaurant name, cuisine, timing, delivery fee | ✅ Working |
| **Restaurant Images** | Multiple image uploads via Cloudinary | ✅ Working |
| **Menu Management** | Add, edit, delete food items | ✅ Working |
| **Dish Details** | Name, type (veg/non-veg), price, prep time | ✅ Working |
| **Dish Availability** | Toggle item availability | ✅ Working |
| **Food Images** | Multiple images per dish | ✅ Working |
| **GST & Compliance** | GST info, FSSAI, RC, DL, PAN upload | ✅ Working |
| **Operating Hours** | Set opening and closing times | ✅ Working |
| **Order History** | View all orders received | ✅ Working |
| **Order Acceptance** | Accept/reject incoming orders | ✅ Working |

**Endpoints**:
- `GET /restaurant/menu` – Get restaurant menu
- `POST /restaurant/add-menu` – Add new dish
- `PUT /restaurant/edit-menu/:id` – Edit dish
- `DELETE /restaurant/delete-menu/:id` – Delete dish
- `PUT /restaurant/update-profile` – Update restaurant info
- `GET /restaurant/orders` – Get pending orders

---

### 🛍️ Customer Ordering System

| Feature | Details | Status |
|---------|---------|--------|
| **Browse Restaurants** | Search and filter restaurants | ✅ Working |
| **View Menu** | See all available dishes with details | ✅ Working |
| **Add to Cart** | Add/remove items with quantities | ✅ Working |
| **Cart Management** | View, update, clear cart | ✅ Working |
| **Checkout Process** | Review items and total price | ✅ Working |
| **Apply Promo Codes** | Discount code support | ✅ Working |
| **Multiple Addresses** | Save multiple delivery addresses | ✅ Working |
| **Order Tracking** | Real-time status updates | ✅ Working |
| **Order History** | View past orders | ✅ Working |
| **Cancel Order** | Cancel before restaurant accepts | ✅ Working |

**Endpoints**:
- `GET /public/restaurants` – List all restaurants
- `GET /public/restaurant/:id` – Get restaurant details
- `POST /user/place-order` – Place new order
- `GET /user/orders` – Get user's orders
- `GET /user/order/:id` – Get order details

---

### 💳 Payment Integration

| Feature | Details | Status |
|---------|---------|--------|
| **Razorpay Integration** | Complete payment gateway setup | ✅ Working |
| **Order Value Calculation** | Subtotal + Tax + Delivery Fee | ✅ Working |
| **Discount Calculation** | Promo code discount percentage | ✅ Working |
| **Payment Methods** | Credit/Debit Card, UPI, Net Banking | ✅ Working |
| **Payment Status Tracking** | Pending → Paid / Failed | ✅ Working |
| **Payment ID Storage** | Razorpay Payment & Order IDs | ✅ Working |
| **Order Confirmation** | Payment success notification | ✅ Working |

**Endpoints**:
- `POST /payment/create-razorpay-order` – Initialize payment
- `POST /payment/verify-payment` – Verify payment completion

---

### 🚚 Delivery Management

| Feature | Details | Status |
|---------|---------|--------|
| **Available Orders** | Riders see pending orders for pickup | ✅ Working |
| **Accept Delivery** | Rider accepts order for delivery | ✅ Working |
| **Real-time Tracking** | GPS coordinates (lat/lon) tracking | ✅ Working |
| **Order Status Update** | Picked up → On the way → Delivered | ✅ Working |
| **Delivery History** | View completed deliveries | ✅ Working |
| **Earnings Tracking** | Track delivery earnings | ✅ Working |

**Endpoints**:
- `GET /rider/available-orders` – Get pending orders
- `POST /rider/accept-order/:id` – Accept delivery
- `PUT /rider/update-status/:id` – Update order status
- `GET /rider/deliveries` – Get delivery history

---

### ⭐ Review & Rating System

| Feature | Details | Status |
|---------|---------|--------|
| **Post-Delivery Review** | Customer rates after delivery | ✅ Working |
| **Star Rating** | 1-5 star rating system | ✅ Working |
| **Written Comments** | Customer feedback text | ✅ Working |
| **Restaurant Ratings** | Aggregate ratings display | ✅ Working |
| **Review History** | View all reviews | ✅ Working |

**Endpoints**:
- `POST /user/add-review/:id` – Submit review
- `GET /restaurant/reviews` – Get restaurant reviews

---

### 📍 Location & Mapping

| Feature | Details | Status |
|---------|---------|--------|
| **Leaflet Maps** | Interactive map integration | ✅ Working |
| **User Geo-location** | Latitude & Longitude tracking | ✅ Working |
| **Routing** | Leaflet Routing Machine for directions | ✅ Working |
| **Delivery Address** | City, State, Pin, Full address | ✅ Working |
| **Location Search** | Find restaurants by area | ✅ Working |

---

### 💬 Real-time Communication

| Feature | Details | Status |
|---------|---------|--------|
| **Socket.io Integration** | Real-time order updates | ✅ Working |
| **Live Status Notifications** | Instant order status changes | ✅ Working |
| **Order Acceptance Alert** | Restaurant confirms order | ✅ Working |
| **Delivery Updates** | Rider location & ETA | ✅ Working |
| **Email Notifications** | Order updates via email | ✅ Working |

---

### 👥 Admin Dashboard

| Feature | Details | Status |
|---------|---------|--------|
| **User Management** | View all customers, riders, partners | ✅ Working |
| **Order Management** | Monitor all orders on platform | ✅ Working |
| **Restaurant Management** | Manage restaurant partners | ✅ Working |
| **Rider Management** | View rider details and earnings | ✅ Working |
| **Block/Unblock Users** | User status management | ✅ Working |
| **Platform Analytics** | Revenue, orders, users metrics | ✅ Working |
| **Active Status** | Toggle user active/inactive/blocked | ✅ Working |

---

## 📦 Tech Stack

### Frontend
- **React 19.2.0** – UI Framework
- **Vite 7.2.4** – Build Tool
- **React Router DOM 7.12.0** – Routing
- **Tailwind CSS 4.1.18** – Styling
- **Axios 1.13.2** – HTTP Client
- **Socket.io Client 4.8.3** – Real-time communication
- **Leaflet 1.9.4** – Map library
- **React Leaflet 5.0.0** – React wrapper for Leaflet
- **Leaflet Routing Machine 3.2.12** – Routing
- **React Hot Toast 2.6.0** – Notifications
- **React Icons 5.5.0** – Icon Library
- **Lucide React 0.562.0** – Modern Icons
- **AOS 2.3.4** – Scroll Animations

### Backend
- **Express 5.2.1** – Web Framework
- **MongoDB with Mongoose 9.1.2** – Database
- **JWT (jsonwebtoken 9.0.3)** – Authentication
- **BCrypt 6.0.0** – Password Hashing
- **Cloudinary 2.9.0** – Image Storage
- **Multer 2.0.2** – File Upload Handling
- **Socket.io 4.8.3** – Real-time Communication
- **Razorpay 2.9.6** – Payment Gateway
- **Nodemailer 7.0.13** – Email Service
- **Cookie Parser 1.4.7** – Cookie Handling
- **CORS 2.8.6** – Cross-Origin Handling
- **Dotenv 17.2.3** – Environment Variables
- **Morgan 1.10.1** – HTTP Logging
- **Nodemon 3.1.11** (Dev) – Auto-Reload

---

## 👥 User Roles & Workflows

### 1️⃣ **CUSTOMER Workflow**
```
Register → Login → Browse Restaurants → View Menu → 
Add to Cart → Checkout → Payment → Order Tracking → 
Delivery → Review & Rate
```

### 2️⃣ **RESTAURANT PARTNER Workflow**
```
Register → Approve & Setup → Add Menu Items → 
Accept Incoming Orders → Mark Preparing → 
Mark Ready → View Reviews & Ratings
```

### 3️⃣ **DELIVERY RIDER Workflow**
```
Register → Verification → Check Available Orders → 
Accept Order → Pick-up → On The Way → 
Deliver & Mark Complete → View Earnings
```

### 4️⃣ **ADMIN Workflow**
```
Manage Users → Monitor Orders → View Analytics → 
Block/Unblock Users → Manage Partners → 
View Platform Metrics
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v16+
- MongoDB instance (local or cloud)
- Cloudinary account (for image uploads)
- Razorpay account (for payments)
- Nodemailer credentials (for email)

### Backend Setup

```bash
cd server
npm install

# Create .env file with:
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

npm run dev
```

Backend will be available at `http://localhost:5000`

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

### Database Setup (Optional - Auto creates collections)

MongoDB collections will be created automatically on first request.

---

## 📡 API Endpoints

### Authentication Routes (`/auth`)
```
POST   /auth/register                   – Register new user
POST   /auth/login                      – Login user
POST   /auth/verify-otp                 – Verify OTP
GET    /auth/logout                     – Logout user
```

### Public Routes (`/public`)
```
GET    /public/restaurants               – List all restaurants
GET    /public/restaurant/:id            – Get restaurant details
GET    /public/menu/:restaurantId        – Get restaurant menu
POST   /public/contact                   – Contact form submission
```

### User Routes (`/user`)
```
GET    /user/profile                     – Get user profile
PUT    /user/profile/:id                 – Update user profile
POST   /user/place-order                 – Create new order
GET    /user/orders                      – Get user's orders
GET    /user/order/:id                   – Get order details
PUT    /user/cancel-order/:id            – Cancel order
POST   /user/add-review/:id              – Submit review
```

### Restaurant Routes (`/restaurant`)
```
GET    /restaurant/menu                  – Get menu items
POST   /restaurant/add-menu              – Add new dish
PUT    /restaurant/edit-menu/:id         – Edit dish
DELETE /restaurant/delete-menu/:id       – Delete dish
GET    /restaurant/orders                – Get pending orders
PUT    /restaurant/accept-order/:id      – Accept order
PUT    /restaurant/update-status/:id     – Update order status
GET    /restaurant/reviews               – Get reviews
PUT    /restaurant/update-profile        – Update info
```

### Rider Routes (`/rider`)
```
GET    /rider/available-orders          – Get pending orders
POST   /rider/accept-order/:id          – Accept delivery
PUT    /rider/update-status/:id         – Update order status
GET    /rider/deliveries                – Delivery history
GET    /rider/earnings                  – View earnings
```

### Payment Routes (`/payment`)
```
POST   /payment/create-razorpay-order   – Initialize payment
POST   /payment/verify-payment          – Verify payment
```

### Admin Routes (`/admin`)
```
GET    /admin/users                     – List all users
GET    /admin/orders                    – List all orders
GET    /admin/restaurants               – List all restaurants
PUT    /admin/block-user/:id            – Block user
PUT    /admin/unblock-user/:id          – Unblock user
GET    /admin/analytics                 – Platform analytics
```

---

## 📋 Database Models

### User Model
```javascript
{
  fullName, email, mobnumber, password, role (admin/manager/partner/customer),
  dob, gender, city, address, state, pin,
  photo: { url, publicId },
  geoLocation: { lat, lon },
  paymentDetails: { upi, account_number, ifs_Code },
  restaurantName, restaurantImages[], restaurantTiming { opening, closing },
  cuisine, deliveryFee,
  documents: { gst, fssai, rc, dl, uidai, pan },
  isActive (active/inactive/blocked),
  timestamps
}
```

### Menu Model
```javascript
{
  restaurantID (ref: User),
  dishName, gst, cuisine, type (veg/non-veg/vegan/egg/jain/spicy),
  description, price, servingsize, preparationTime,
  availability (available/unavailable),
  image: [{ url, publicID }],
  timestamps
}
```

### Order Model
```javascript
{
  orderNumber (unique),
  restaurantId (ref: User), userId (ref: User), riderId (ref: User, optional),
  items: [],
  orderValue: {
    subtotal, tax, deliveryFee, promoCode, discountPercentage, total,
    paymentMethod, paymentStatus (pending/paid/failed),
    razorpayPaymentID, razorpayOrderID
  },
  status: (pending/accepted/preparing/ready/pickedUp/onTheWay/delivered/refused/damaged/cancelled/rejected),
  review: { rating (1-5), comment },
  timestamps
}
```

### Contact Model
```javascript
{
  name, email, message,
  timestamps
}
```

### OTP Model
```javascript
{
  email, otp, expiryTime,
  timestamps
}
```

---

## 🎨 Project Structure

```
Cravings/
│
├── client/                            # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── publicModals/          # Login, Register modals
│   │   │   ├── restaurantDashboard/   # Restaurant components
│   │   │   ├── userDashboard/         # User components
│   │   │   └── riderDashboard/        # Rider components
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── OrderNow.jsx
│   │   │   ├── RestaurantDetails.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── PaymentSuccessPage.jsx
│   │   │   └── dashboards/
│   │   │       ├── UserDashboard.jsx
│   │   │       ├── RestaurantDashboard.jsx
│   │   │       ├── RideDashboard.jsx
│   │   │       └── AdminDashboard.jsx
│   │   ├── config/
│   │   │   ├── API.jsx                # API configuration
│   │   │   └── context/               # Context files
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                            # Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── restaurantController.js
│   │   │   ├── riderController.js
│   │   │   ├── paymentController.js
│   │   │   ├── publicController.js
│   │   │   └── adminController.js
│   │   ├── middleware/
│   │   │   └── auth.js                # JWT & role verification
│   │   ├── models/
│   │   │   ├── userModels.js
│   │   │   ├── menuSchema.js
│   │   │   ├── orderModel.js
│   │   │   ├── contactModel.js
│   │   │   └── otpModel.js
│   │   ├── routers/
│   │   │   ├── authRouter.js
│   │   │   ├── userRouter.js
│   │   │   ├── restaurantRouter.js
│   │   │   ├── riderRouter.js
│   │   │   ├── paymentRouter.js
│   │   │   ├── publicRouter.js
│   │   │   └── managerRouter.js
│   │   └── utils/
│   │       └── (utility functions)
│   ├── index.js                       # Server entry point
│   └── package.json
│
└── README.md
```

---

## 🔑 Key Features Breakdown

### 🎯 **Real-time Order Tracking**
- Socket.io for live status updates
- Instant notification when status changes
- GPS tracking for rider location

### 💳 **Secure Payment System**
- Razorpay integration for multiple payment methods
- Order value calculation with tax and delivery fee
- Promo code discount support

### 🗺️ **Advanced Mapping**
- Leaflet maps for restaurant location display
- Real-time delivery route optimization
- GPS-based rider tracking

### 📧 **Email Notifications**
- Order confirmation emails
- OTP verification emails
- Order status update emails
- Password recovery emails

### 👥 **Multi-role Support**
- Customer: Order management
- Restaurant: Menu & order management
- Rider: Delivery management
- Admin: Platform administration

### ⭐ **Review System**
- Post-delivery rating and reviews
- Aggregate restaurant ratings
- Review display on restaurant details

---

## 🚀 Future Enhancements

- [ ] Push notifications for mobile
- [ ] Advanced analytics dashboard
- [ ] Subscription & loyalty program
- [ ] AI-based food recommendations
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Vendor analytics dashboard
- [ ] Automated order assignment algorithm

---

## 🏆 Innovation Highlights

- ✨ Multi-role platform (Customer, Restaurant, Rider, Admin)
- ✨ Real-time Socket.io integration
- ✨ Secure Razorpay payment system
- ✨ Leaflet maps with routing
- ✨ Comprehensive email notifications
- ✨ Role-based access control
- ✨ Professional error handling
- ✨ Scalable MERN architecture

---

## 📝 License

ISC License – Free to use

---

## 👨‍💻 Author

**Sanjana Vishwakarma** – Full Stack Developer

---

## 📞 Support

For issues, questions, or feature requests, please open an issue or reach out through the repository.

---

**Last Updated**: May 25, 2026
**Version**: 1.0.0 (Core Features Implemented)
**Status**: ✅ Production Ready

---

### Implementation Status

| Category | Total Features | Implemented | Status |
|----------|---|---|---|
| Authentication | 8 | 8 | ✅ Complete |
| Restaurant Management | 10 | 10 | ✅ Complete |
| Customer Ordering | 10 | 10 | ✅ Complete |
| Payment Integration | 7 | 7 | ✅ Complete |
| Delivery Management | 6 | 6 | ✅ Complete |
| Review & Rating | 5 | 5 | ✅ Complete |
| Admin Dashboard | 7 | 7 | ✅ Complete |
| Real-time Features | 5 | 5 | ✅ Complete |
| **Total** | **58** | **58** | **✅ 100% Complete** |

---

**🍕 Built with ❤️ using MERN Stack 🍕**
