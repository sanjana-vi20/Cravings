import React from "react";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import UserDashboard from "./pages/dashboards/UserDashboard";
import RestaurantDashboard from "./pages/dashboards/RestaurantDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import RideDashboard from "./pages/dashboards/RideDashboard";
// import Footer from "./components/Footer";
import OrderNow from "./pages/OrderNow";
import RestaurantDetails from "./pages/RestaurantDetails";
import ExploreMenu from "./components/restaurantDashboard/ExploreMenu";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order-now" element={<OrderNow />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/ride-dashboard" element={<RideDashboard />} />
          <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
          <Route path="/explore-menu" element={<ExploreMenu />} />
          <Route path="/restaurant-details/:id" element={<RestaurantDetails />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-to-cart" element={<CartPage/>} />
          <Route path="/checkoutPage" element={<CheckoutPage/>} />
        </Routes>
        {/* <Footer/> */}
      </BrowserRouter>
    </>
  );
};

export default App;
