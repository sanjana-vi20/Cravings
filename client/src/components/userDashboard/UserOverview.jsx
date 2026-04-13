import React from "react";
import { 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Star,
  Gift
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserOverview = ({ data }) => {
   const {isLogin , user } = useAuth();
  const navigate = useNavigate();
  if(!isLogin)
  {
    navigate("/login");
  }
  // Dummy User Data (Aap isse AuthContext se bhi le sakte hain)
  const userdetail = {
    name: user.fullName,
    totalOrders: 42,
    favCuisine: "North Indian",
    points: 850
  };
  // console.log(user);
  

  const recentOrders = [
    { id: "#ORD-123", restaurant: "Tanishk Da Dhaba", date: "Today, 2:30 PM", status: "Delivered", price: "₹450" },
    { id: "#ORD-121", restaurant: "Pizza Hut", date: "Yesterday", status: "Delivered", price: "₹890" },
  ];

  const favorites = [
    { name: "The Burger Club", rating: 4.5, time: "25 min", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400" },
    { name: "Royal Biryani", rating: 4.8, time: "40 min", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=400" },
  ];

  return (
    <div className="space-y-8 p-6 animate-in fade-in duration-700">
      
      {/* --- 1. Welcome Section --- */}
      <div className="bg-gradient-to-r from-[#842A3B] to-[#b03a51] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tighter mb-2">Welcome, {userdetail.name}!👋</h1>
          <p className="opacity-80 font-medium">Hungry? You have {userdetail.points} reward points to spend on your next meal!</p>
          <button className="mt-6 bg-white text-[#842A3B] px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all" onClick={() =>navigate('/order-now')}>
            Order Now
          </button>
        </div>
        {/* <Gift className="absolute -bottom-6 -right-6 w-48 h-48 text-white/10" /> */}
      </div>

      {/* --- 2. Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><ShoppingBag /></div>
          <div>
            <p className="text-2xl font-black text-slate-800">{userdetail.totalOrders}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Orders</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl"><Heart /></div>
          <div>
            <p className="text-2xl font-black text-slate-800">{userdetail.favCuisine}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fav Cuisine</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-5 shadow-sm">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><MapPin /></div>
          <div>
            <p className="text-2xl font-black text-slate-800">Bhopal</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Primary City</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* --- 3. Recent Orders (Left) --- */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Recent Orders</h2>
            <button className="text-xs font-black text-[#842A3B] flex items-center gap-1 uppercase tracking-widest">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex justify-between items-center hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#842A3B]">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{order.restaurant}</h4>
                    <p className="text-xs text-slate-400 font-medium">{order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-800">{order.price}</p>
                  <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-md uppercase">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- 4. Favorite Restaurants (Right) --- */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter px-2">Favorites</h2>
          <div className="grid grid-cols-1 gap-4">
            {favorites.map((res, i) => (
              <div key={i} className="group relative h-40 rounded-[2.5rem] overflow-hidden shadow-sm">
                <img src={res.image} className="w-full h-full object-cover group-hover:scale-110 duration-700 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <div className="flex justify-between items-center text-white">
                    <div>
                      <h4 className="font-black text-lg">{res.name}</h4>
                      <p className="text-xs opacity-80 flex items-center gap-1"><Clock size={12}/> {res.time}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold">
                      {res.rating} <Star size={12} fill="currentColor" className="text-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;