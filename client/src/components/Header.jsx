import React, { useState, useEffect } from "react";
import circle from "../assets/L1.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import api from "../config/Api.jsx";
import { ShoppingCart, User, LogOut, Menu } from "lucide-react";

function Header() {
  const { user, isLogin, role, setIsLogin, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [lastSeenCount, setLastSeenCount] = useState(
    Number(localStorage.getItem("lastSeenCount")) || 0,
  );

  // const updateCartCount = () => {
  //   const cart = JSON.parse(localStorage.getItem("cart")) || [];
  //   // const total = cart.reduce((i, item) => i + item.quantity, 0);
  //   setCartCount(total);

  //   if (location.pathname === "/add-to-cart") {
  //     localStorage.setItem("lastSeenCount", total);
  //     setLastSeenCount(total);
  //   }
  // };

  // useEffect(() => {
  //   updateCartCount();
  //   window.addEventListener("cartUpdated", updateCartCount);
  //   return () => window.removeEventListener("cartUpdated", updateCartCount);
  // }, [location.pathname]);

  const showBadge =
    cartCount > lastSeenCount && location.pathname !== "/add-to-cart";

  const handleNavigate = () => {
    const routes = {
      manager: "/restaurant-dashboard",
      partner: "/ride-dashboard",
      customer: "/user-dashboard",
      admin: "/admin-dashboard",
    };
    navigate(routes[role] || "/");
  };

  const handleLogout = async () => {
    try {
      const res = await api.get("/auth/logout");
      setUser("");
      setIsLogin(false);
      sessionStorage.removeItem("CravingUser");
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout Failed");
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-100 bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
      {/* --- LOGO --- */}
      <Link to="/" className="flex items-center group">
        <div className="relative overflow-hidden rounded-full p-1 bg-gradient-to-tr from-[#842A3B] to-[#F5DAA7]">
          <img
            src={circle}
            alt="Cravings"
            className="rounded-full object-cover w-12 h-12 md:w-14 md:h-14 bg-white"
          />
        </div>
        <span className="ml-3 text-2xl font-black tracking-tighter text-[#1a1a1a] group-hover:text-[#842A3B] transition-colors">
          CRAVINGS
        </span>
      </Link>

      {/* --- CENTER NAVIGATION --- */}
      <div className="hidden lg:flex gap-10 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`text-sm font-black uppercase tracking-widest transition-all duration-300 hover:text-[#842A3B] relative group ${
              location.pathname === link.path
                ? "text-[#842A3B]"
                : "text-gray-500"
            }`}
          >
            {link.name}
            <span
              className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#842A3B] transition-all duration-300 group-hover:w-full ${location.pathname === link.path ? "w-full" : ""}`}
            ></span>
          </Link>
        ))}

        {/* --- Dynamic Cart Link --- */}
        <Link
          to="/add-to-cart"
          className="relative flex items-center gap-2 text-gray-500 font-black uppercase text-sm tracking-widest hover:text-[#842A3B] transition-colors"
        >
          <ShoppingCart size={20} />
          <span className="hidden xl:inline">
            Cart
          </span>
          {showBadge && (
            <span className="absolute -top-3 -right-3 bg-[#842A3B] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-lg border-2 border-white">
              {cartCount - lastSeenCount}
            </span>
          )}
        </Link>
      </div>

      {/* --- RIGHT ACTIONS --- */}
      <div className="flex gap-4 items-center">
        {isLogin ? (
          <div className="flex items-center gap-4 bg-[#FDF6E3] p-1 pr-4 rounded-full border border-[#F5DAA7]/30 shadow-sm">
            <div
              className="w-10 h-10 bg-[#842A3B] rounded-full flex items-center justify-center text-white cursor-pointer hover:rotate-12 transition-transform shadow-md"
              onClick={handleNavigate}
            >
              <User size={20} />
            </div>
            <div className="hidden md:block">
              <p className="text-[10px] font-black text-gray-400 uppercase leading-none">
                Welcome
              </p>
              <p
                className="text-xs font-black text-[#1a1a1a] cursor-pointer hover:text-[#842A3B]"
                onClick={handleNavigate}
              >
                {user.fullName.split(" ")[0]}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-2 text-gray-400 hover:text-[#842A3B] transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              className="hidden sm:block text-sm font-black uppercase tracking-widest text-gray-500 hover:text-[#842A3B] transition-all"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
            <button
              className="bg-[#842A3B] text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#662222] shadow-lg hover:shadow-[#842A3B]/30 hover:-translate-y-0.5 transition-all"
              onClick={() => navigate("/register")}
            >
              Join Now
            </button>
          </div>
        )}
        {/* Mobile Menu Icon (Placeholder) */}
        <button className="lg:hidden p-2 text-gray-800">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}

export default Header;
