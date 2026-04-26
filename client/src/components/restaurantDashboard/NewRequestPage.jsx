import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Clock, User, Utensils, Receipt, 
  CheckCircle2, XCircle, ChevronRight, Filter, 
  Search, MapPin, CreditCard
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

const NewRequestPage = () => {
  // --- DUMMY DATA FOR LISTING ---
  const [orders, setOrders] = useState([
    {
      _id: "69eca83697d666774b251932",
      orderNumber: "ORD-1777117238465",
      createdAt: "2026-04-25T11:40:38.506Z",
      status: "pending",
      userId: { fullName: "Tanishk Sarathe", email: "tanishk@cravings.com" },
      items: [
        { dishName: "Burger", price: "98", quantity: 1, cuisine: "Italian", image: [{ url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400' }] },
        { dishName: "Orange Juice", price: "40", quantity: 2, cuisine: "Indian", image: [{ url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=400' }] }
      ],
      orderValue: { subtotal: 178, tax: 15, deliveryFee: 40, total: 233, paymentMethod: "razorPay" }
    },
    {
      _id: "69eca83697d666774b251933",
      orderNumber: "ORD-1777117238499",
      createdAt: "2026-04-25T11:55:20.506Z",
      status: "pending",
      userId: { fullName: "Anjali Gupta", email: "anjali@gmail.com" },
      items: [
        { dishName: "Fresh Garden Pizza", price: "349", quantity: 1, cuisine: "Italian", image: [{ url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400' }] }
      ],
      orderValue: { subtotal: 349, tax: 28, deliveryFee: 0, total: 377, paymentMethod: "razorPay" }
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(orders[0]);

  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  const handleStatusUpdate = (id, newStatus) => {
    const message = newStatus === 'confirmed' ? "Order Accepted!" : "Order Rejected.";
    newStatus === 'confirmed' ? toast.success(message) : toast.error(message);
    
    // UI update (Remove from list for demo)
    setOrders(orders.filter(o => o._id !== id));
    if (selectedOrder?._id === id) setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased">
      <Toaster position="top-right" />
      
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-[#842A3B] p-2 rounded-xl text-white">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Incoming Requests</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{orders.length} Active Orders</p>
          </div>
        </div>
        <div className="flex gap-3">
           <button className="p-2.5 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-all"><Search size={18}/></button>
           <button className="p-2.5 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-all"><Filter size={18}/></button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden h-[calc(100vh-80px)]">
        
        {/* LEFT SIDE: ORDERS LIST */}
        <div className="w-full md:w-[400px] bg-white border-r border-slate-200 overflow-y-auto scrollbar-hide">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div 
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className={`p-6 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 ${selectedOrder?._id === order._id ? "bg-[#842A3B]/5 border-l-4 border-l-[#842A3B]" : ""}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-black text-[#842A3B] bg-[#842A3B]/5 px-2 py-1 rounded-md uppercase">{order.orderNumber.split('-')[1]}</span>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock size={12}/> {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <h3 className="font-black text-slate-800">{order.userId.fullName}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">{order.items.length} Items • ₹{order.orderValue.total}</p>
                <div className="mt-4 flex items-center gap-2">
                   <div className="flex -space-x-2">
                      {order.items.map((item, i) => (
                        <img key={i} src={item.image[0].url} className="w-6 h-6 rounded-full border-2 border-white object-cover" alt="" />
                      ))}
                   </div>
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">View Details</span>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4">
               <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300"><ShoppingBag size={40}/></div>
               <p className="font-black text-slate-400 uppercase text-xs tracking-widest">No New Requests</p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: ORDER DETAIL VIEW */}
        <div className="hidden md:flex flex-1 bg-slate-50 overflow-y-auto p-12 scrollbar-hide">
          {selectedOrder ? (
            <div className="w-full max-w-3xl mx-auto space-y-8" data-aos="fade-left" key={selectedOrder._id}>
              
              {/* Customer Card */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-[#842A3B] rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                    {selectedOrder.userId.fullName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedOrder.userId.fullName}</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedOrder.userId.email}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase">Order ID</p>
                   <p className="font-black text-[#842A3B]">{selectedOrder.orderNumber}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 px-8 border-b border-slate-50 flex items-center gap-3">
                  <Utensils size={18} className="text-[#842A3B]" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Order Items</h3>
                </div>
                <div className="p-8 space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <img src={item.image[0].url} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                        <div>
                          <h4 className="text-sm font-black text-slate-800">{item.dishName}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{item.cuisine} • Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-black text-slate-800">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill & Payment */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-4">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F5DAA7]">Payment Summary</h4>
                   <div className="space-y-2 opacity-70 text-sm font-medium">
                      <div className="flex justify-between"><span>Subtotal</span><span>₹{selectedOrder.orderValue.subtotal}</span></div>
                      <div className="flex justify-between"><span>Taxes</span><span>₹{selectedOrder.orderValue.tax}</span></div>
                      <div className="flex justify-between"><span>Delivery</span><span>₹{selectedOrder.orderValue.deliveryFee}</span></div>
                   </div>
                   <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                      <span className="text-2xl font-black">₹{selectedOrder.orderValue.total}</span>
                      <span className="text-[9px] font-black bg-green-500/20 text-green-400 px-3 py-1 rounded-full uppercase">PAID: {selectedOrder.orderValue.paymentMethod}</span>
                   </div>
                </div>

                <div className="flex flex-col gap-4 justify-center">
                  <button 
                    onClick={() => handleStatusUpdate(selectedOrder._id, 'confirmed')}
                    className="w-full py-5 bg-[#842A3B] text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-[#842A3B]/20 hover:bg-[#662222] transition-all flex items-center justify-center gap-3 group"
                  >
                    Accept Order <CheckCircle2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedOrder._id, 'rejected')}
                    className="w-full py-5 bg-white border-2 border-slate-200 text-slate-400 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center gap-3"
                  >
                    Reject Order <XCircle size={18} />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center opacity-30">
               <Receipt size={80} className="mb-4" />
               <p className="font-black uppercase tracking-[0.3em]">Select an order to view details</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NewRequestPage;