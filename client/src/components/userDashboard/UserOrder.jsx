import React, { useState, useEffect } from "react";
import { socket } from "../../config/Websocket"; // Socket import karo
import api from "../../config/Api";
import { Package, Clock, MapPin, CheckCircle2 } from "lucide-react";

const UserOrder = () => {
  const [orders, setOrders] = useState([]);

  // --- 1. Purane Orders Fetch karo ---
  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await api.get("/user/my-orders"); // User specific route
        setOrders(res.data.data);
      } catch (err) {
        console.log("Error fetching orders", err);
      }
    };
    fetchMyOrders();
  }, []);

  // --- 2. Live Status Update Listen karo ---
  useEffect(() => {
    socket.on("order_status_update", (data) => {
      // data: { orderId, status, message }
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === data.orderId ? { ...order, status: data.status } : order
        )
      );
      // Ek mast toast ya notification dikhao
      alert(data.message); 
    });

    return () => socket.off("order_status_update");
  }, []);

  // Status Color Logic
  const getStatusColor = (status) => {
    const colors = {
      pending: "text-blue-500 bg-blue-50",
      accepted: "text-green-500 bg-green-50",
      preparing: "text-orange-500 bg-orange-50",
      ready: "text-purple-500 bg-purple-50",
      delivered: "text-slate-500 bg-slate-50",
    };
    return colors[status] || "text-slate-500 bg-slate-50";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-black italic uppercase tracking-tighter">My Orders</h1>
      
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Package className="text-slate-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 tracking-tight">#{order.orderNumber.split("-")[1]}</h3>
                  <p className="text-xs text-slate-400 font-medium">{new Date(order.createdAt).toDateString()}</p>
                </div>
              </div>
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="mt-6 border-t border-slate-50 pt-4 flex justify-between items-center">
               <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Clock size={14}/>
                  <span className="font-bold">Estimated: 30-40 mins</span>
               </div>
               <div className="font-black text-[#842A3B]">₹{order.orderValue.total}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrder;