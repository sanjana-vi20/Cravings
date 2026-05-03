import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Clock,
  Utensils,
  Receipt,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import api from "../../config/Api";

const NewRequestPage = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
    AOS.init({ duration: 500 });
  }, []);

  // --- 1. Fetch Only Pending/New Orders ---
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/restaurant/fetch-orders");
      const fetchedData = res.data.data;
      setOrders(fetchedData);
      // Pehla order auto-select karo agar data hai
      if (fetchedData.length > 0) {
        setSelectedOrder(fetchedData[0]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Update Status API Call ---
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await api.patch(`/restaurant/update-order-status/${id}`, { 
        status: newStatus 
      });

      if (res.status === 200) {
        toast.success(`Order ${newStatus.toUpperCase()}!`);

        // Agar order "Ready" ya "Rejected" ho gaya hai toh use list se hata do
        if (["ready", "rejected", "cancelled"].includes(newStatus)) {
          const remainingOrders = orders.filter((o) => o._id !== id);
          setOrders(remainingOrders);
          setSelectedOrder(remainingOrders.length > 0 ? remainingOrders[0] : null);
        } else {
          // Status update karo UI mein (e.g., pending -> accepted)
          const updatedOrders = orders.map((o) =>
            o._id === id ? { ...o, status: newStatus } : o
          );
          setOrders(updatedOrders);
          if (selectedOrder?._id === id) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
          }
        }
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Status update failed");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#842A3B] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black text-slate-400 uppercase text-xs tracking-widest">Loading Requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased">
      <Toaster position="top-right" />

      {/* Header Section */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-[#842A3B] p-2 rounded-xl text-white">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">Incoming Requests</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {orders.length} Orders Pending Action
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="p-2.5 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-all"><Search size={18} /></button>
          <button className="p-2.5 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-all"><Filter size={18} /></button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden h-[calc(100vh-80px)]">
        {/* LEFT SIDE: ORDERS LIST */}
        <div className="w-full md:w-[400px] bg-white border-r border-slate-200 overflow-y-auto">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className={`p-6 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 ${
                  selectedOrder?._id === order._id ? "bg-[#842A3B]/5 border-l-4 border-l-[#842A3B]" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${
                    order.status === 'pending' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <h3 className="font-black text-slate-800 uppercase tracking-tighter">{order.userId.fullName}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium italic">
                  #{order.orderNumber.split("-")[1]} • {order.items.length} Items • ₹{order.orderValue.total}
                </p>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4">
              <ShoppingBag size={40} className="text-slate-200" />
              <p className="font-black text-slate-300 uppercase text-[10px] tracking-widest">No Active Requests</p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: ORDER DETAIL VIEW */}
        <div className="hidden md:flex flex-1 bg-slate-50 overflow-y-auto p-12">
          {selectedOrder ? (
            <div className="w-full max-w-3xl mx-auto space-y-8" data-aos="fade-left" key={selectedOrder._id}>
              
              {/* Customer Card */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-[#842A3B] rounded-2xl flex items-center justify-center text-white text-2xl font-black italic">
                    {selectedOrder.userId.fullName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">{selectedOrder.userId.fullName}</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedOrder.userId.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Order ID</p>
                  <p className="font-black text-[#842A3B]">#{selectedOrder.orderNumber.split("-")[1]}</p>
                </div>
              </div>

              {/* Items Summary */}
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 px-8 border-b border-slate-50 flex items-center gap-3 bg-[#FAF7F2]">
                  <Utensils size={18} className="text-[#842A3B]" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Order Items</h3>
                </div>
                <div className="p-8 space-y-6">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <img src={item.image[0].url} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt="" />
                        <div>
                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tighter">{item.dishName}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty: {item.quantity} • Price: ₹{item.price}</p>
                        </div>
                      </div>
                      <p className="font-black text-slate-800 italic">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill & Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-4 shadow-xl">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F5DAA7]">Bill Details</h4>
                  <div className="space-y-2 opacity-70 text-[11px] font-bold uppercase tracking-widest">
                    <div className="flex justify-between"><span>Subtotal</span><span>₹{selectedOrder.orderValue.subtotal}</span></div>
                    <div className="flex justify-between"><span>Taxes & Fee</span><span>₹{selectedOrder.orderValue.tax + selectedOrder.orderValue.deliveryFee}</span></div>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                    <span className="text-3xl font-black italic text-[#F5DAA7]">₹{selectedOrder.orderValue.total}</span>
                    <span className="text-[9px] font-black bg-green-500/20 text-green-400 px-3 py-1 rounded-full uppercase tracking-tighter italic">PAID ONLINE</span>
                  </div>
                </div>

                {/* --- DYNAMIC ACTION BUTTONS --- */}
                <div className="flex flex-col gap-4 justify-center">
                  {selectedOrder.status === "pending" && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(selectedOrder._id, "accepted")}
                        className="w-full py-5 bg-[#842A3B] text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-[#842A3B]/20 hover:scale-105 transition-all flex items-center justify-center gap-3"
                      >
                        Accept Order <CheckCircle2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(selectedOrder._id, "rejected")}
                        className="w-full py-5 bg-white border-2 border-slate-200 text-slate-400 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-3"
                      >
                        Reject Request <XCircle size={18} />
                      </button>
                    </>
                  )}

                  {selectedOrder.status === "accepted" && (
                    <button 
                      onClick={() => handleStatusUpdate(selectedOrder._id, "preparing")}
                      className="w-full py-6 bg-orange-500 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-100 hover:scale-105 transition-all flex items-center justify-center gap-3"
                    >
                      Start Preparing <Utensils size={20} />
                    </button>
                  )}

                  {selectedOrder.status === "preparing" && (
                    <button 
                      onClick={() => handleStatusUpdate(selectedOrder._id, "ready")}
                      className="w-full py-6 bg-green-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-green-100 hover:scale-105 transition-all flex items-center justify-center gap-3"
                    >
                      Mark as Ready <CheckCircle2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center opacity-20">
              <Receipt size={80} className="mb-4 text-slate-400" />
              <p className="font-black uppercase tracking-[0.3em] text-slate-500">Select order for details</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NewRequestPage;