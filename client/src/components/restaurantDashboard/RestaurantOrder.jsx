import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Package,
  MoreVertical,
  Search,
  Filter,
} from "lucide-react";
import { socket } from "../../config/Websocket"; // Tumhari socket.js file se import
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import NewRequestPage from "./NewRequestPage";
import { useNavigate } from "react-router-dom";

const RestaurantOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([
    {
      id: "ORD-101",
      customer: "Rahul V.",
      items: ["Paneer Tikka", "Butter Naan"],
      total: "₹450",
      time: "2 min ago",
      status: "new",
    },
    {
      id: "ORD-102",
      customer: "Sana K.",
      items: ["Veg Biryani", "Raita"],
      total: "₹320",
      time: "5 min ago",
      status: "preparing",
    },
    {
      id: "ORD-103",
      customer: "Amit M.",
      items: ["Margherita Pizza"],
      total: "₹280",
      time: "12 min ago",
      status: "ready",
    },
    {
      id: "ORD-104",
      customer: "Pooja G.",
      items: ["Cold Coffee", "Pasta"],
      total: "₹560",
      time: "1 min ago",
      status: "new",
    },
  ]);

  // --- Effect 1: Tab Title Update (Optimized) ---
  // useEffect(() => {
  //   const newCount = orders.filter((o) => o.status === "new").length;
  //   if (newCount > 0) {
  //     document.title = `(${newCount}) New Orders | Cravings`;
  //   } else {
  //     document.title = "Manage Orders | Cravings";
  //   }
  // }, [orders]);

  // --- Effect 2: WebSocket Connection ---
  useEffect(() => {
    socket.connect();

    if (user?._id) {
      socket.emit("join_restaurant", user._id);
    }

    socket.on("connect", () => {
      console.log("Socket connected! ID:", socket.id);
    });

    // Ye check karne ke liye ki backend se kuch bhi aa raha hai ya nahi
    socket.onAny((eventName, ...args) => {
      console.log(`Event: ${eventName}`, args);
    });

    const handleNewOrder = (newOrderData) => {
      const formattedOrder = {
        id: newOrderData.orderNumber,
        customer: newOrderData.userId?.fullName || "Guest",
        items: newOrderData.items.map((item) => item.dishName),
        total: `₹${newOrderData.orderValue.total}`,
        time: "Just Now",
        status: "new",
      };

      console.log(formattedOrder);
      

      // Sound play
      // new Audio("/notification.mp3").play().catch(() => {});
      toast.success("New Order Alert! 🍔");
      setOrders((prev) => [formattedOrder, ...prev]);
    };

    socket.on("new_order_received", handleNewOrder);

    return () => {
      socket.off("new_order_received", handleNewOrder);
      socket.disconnect();
    };
  }, [user?._id]);

  return (
    <div className="p-8 bg-slate-50 min-h-screen space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter">
              Live Orders
            </h1>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">
            Real-time Kitchen Management
          </p>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search Order ID..."
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#842A3B]/20 font-bold text-sm w-64"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Orders Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       <div onClick={ ()=>navigate('/requests')}>
         <OrderColumn
          title="New Requests"
          count={orders.filter((o) => o.status === "new").length}
          icon={<Package className="text-blue-600" />}
          bg="bg-blue-50"
        >
          {orders
            .filter((o) => o.status === "new")
            .map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                color="border-l-blue-500"
              />
            ))}
        </OrderColumn>
       </div>

        <OrderColumn
          title="In The Kitchen"
          count={orders.filter((o) => o.status === "preparing").length}
          icon={<ChefHat className="text-orange-600" />}
          bg="bg-orange-50"
        >
          {orders
            .filter((o) => o.status === "preparing")
            .map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                color="border-l-orange-500"
              />
            ))}
        </OrderColumn>

        <OrderColumn
          title="Ready for Pickup"
          count={orders.filter((o) => o.status === "ready").length}
          icon={<CheckCircle2 className="text-green-600" />}
          bg="bg-green-50"
        >
          {orders
            .filter((o) => o.status === "ready")
            .map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                color="border-l-green-500"
              />
            ))}
        </OrderColumn>
      </div>

    </div>
  );
};

// --- Optimized OrderColumn with Badge Pulse ---
const OrderColumn = ({ title, count, icon, bg, children }) => (
  <div className="space-y-6">
    <div
      className={`flex items-center justify-between p-5 ${bg} rounded-[2rem] border border-white shadow-sm relative overflow-hidden`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="font-black text-slate-800 uppercase tracking-tighter">
          {title}
        </h2>
      </div>

      {/* Dynamic Count Badge */}
      <div className="relative">
        {/* Glow effect only for New Requests when count > 0 */}
        {title === "New Requests" && count > 0 && (
          <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-25"></span>
        )}
        <span
          className={`relative px-4 py-1.5 rounded-full text-sm font-black shadow-sm transition-all duration-500 ${
            title === "New Requests" && count > 0
              ? "bg-blue-600 text-white scale-110 shadow-blue-200"
              : "bg-white text-slate-600"
          }`}
        >
          {count}
        </span>
      </div>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const OrderCard = ({ order, color }) => (
  <div
    className={`bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all border-l-8 ${color} animate-in slide-in-from-top-2 duration-500`}
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h4 className="font-black text-slate-800 text-lg tracking-tighter">
          {order.id}
        </h4>
        <p className="text-xs font-bold text-slate-400 uppercase">
          {order.customer}
        </p>
      </div>
      <button className="text-slate-300 hover:text-slate-600">
        <MoreVertical size={20} />
      </button>
    </div>

    <div className="space-y-2 mb-6">
      {order.items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-2 text-sm font-bold text-slate-600"
        >
          <div className="w-1.5 h-1.5 bg-[#842A3B] rounded-full"></div>
          {item}
        </div>
      ))}
    </div>

    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
      <div className="flex items-center gap-1.5 text-slate-400">
        <Clock size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">
          {order.time}
        </span>
      </div>
      <div className="font-black text-[#842A3B]">{order.total}</div>
    </div>

    <div className="grid grid-cols-2 gap-2 mt-6">
      <button className="py-3 rounded-xl bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
        Details
      </button>
      <button className="py-3 rounded-xl bg-[#842A3B] text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
        Update
      </button>
    </div>

   
  </div>
);

export default RestaurantOrder;
