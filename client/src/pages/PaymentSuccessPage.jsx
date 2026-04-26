import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  CheckCircle, Package, MapPin, Phone, 
  ArrowRight, Home, ShoppingBag, Sparkles 
} from "lucide-react";
import toast from "react-hot-toast";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state; // Backend se aaya populatedOrder data

  useEffect(() => {
    if (!order) {
      toast.error("Order session expired!");
      navigate("/");
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* --- Celebrate Header --- */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative inline-block">
            <div className="bg-[#842A3B] p-6 rounded-[2.5rem] shadow-2xl shadow-[#842A3B]/30 mb-6">
              <CheckCircle size={60} className="text-[#F5DAA7] animate-pulse" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 text-[#842A3B]" size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
            Order Confirmed!
          </h1>
          <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-[0.3em]">
            Thank you for choosing Cravings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Left Column: Order Summary --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 bg-[#842A3B] text-[#F5DAA7] rounded-bl-3xl font-black text-[10px] uppercase tracking-widest">
                  {order.orderValue.paymentStatus}
               </div>
               
               <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
                 <Package size={14} /> Order ID: {order.orderNumber}
               </h3>

               {/* Items List */}
               <div className="space-y-4 border-b border-dashed border-slate-100 pb-6">
                 {order.items.map((item, idx) => (
                   <div key={idx} className="flex justify-between items-center">
                     <div>
                       <p className="font-black text-slate-800 text-sm uppercase italic">{item.dishName}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity: {item.quantity}</p>
                     </div>
                     <p className="font-black text-slate-800">₹{item.price * item.quantity}</p>
                   </div>
                 ))}
               </div>

               {/* Payout Details */}
               <div className="pt-6 space-y-3">
                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                    <span>Subtotal</span>
                    <span>₹{order.orderValue.subtotal}</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                    <span>Tax & Charges</span>
                    <span>₹{order.orderValue.tax + order.orderValue.deliveryFee}</span>
                 </div>
                 {order.orderValue.discountPercentage > 0 && (
                   <div className="flex justify-between text-xs font-black text-green-500 uppercase tracking-widest">
                      <span>Discount Applied</span>
                      <span>- ₹{(order.orderValue.subtotal * order.orderValue.discountPercentage) / 100}</span>
                   </div>
                 )}
                 <div className="flex justify-between pt-4 border-t border-slate-50">
                    <span className="text-sm font-black text-[#842A3B] uppercase tracking-widest">Grand Total</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter italic">₹{order.orderValue.total}</span>
                 </div>
               </div>
            </div>
          </div>

          {/* --- Right Column: Delivery & Actions --- */}
          <div className="space-y-6">
            <div className="bg-[#842A3B] text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
               <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F5DAA7] mb-6 flex items-center gap-2">
                 <MapPin size={16} /> Delivering To
               </h3>
               <div className="space-y-4">
                  <div>
                    <p className="text-xs font-black uppercase italic tracking-widest text-[#F5DAA7]">
                      {order.userId?.fullName}
                    </p>
                    <p className="text-[11px] font-bold text-white/70 leading-relaxed mt-2">
                      {order.userId?.address}, {order.userId?.city} - {order.userId?.pin}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                    <Phone size={14} className="text-[#F5DAA7]" />
                    <span className="text-[11px] font-bold">{order.userId?.mobnumber}</span>
                  </div>
               </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => navigate("/user-dashboard", { state: { tab: "orders" } })}
                className="w-full bg-white text-[#842A3B] border-2 border-[#842A3B] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#842A3B] hover:text-white transition-all shadow-sm"
              >
                Track Live Order
              </button>
              <button 
                onClick={() => navigate("/")}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all"
              >
                <Home size={14} /> Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;