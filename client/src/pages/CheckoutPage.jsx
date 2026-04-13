import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Ticket, Home, CreditCard, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurantName, items, billDetails } = location.state || {};

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  // Simple Coupon Logic
  const applyCoupon = () => {
    if (coupon.toUpperCase() === "FIRST50") {
      setDiscount(50);
      toast.success("₹50 Discount Applied!");
    } else {
      toast.error("Invalid Coupon Code");
    }
  };

  if (!items) return navigate("/cart");

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Header */}
      {/* <div className="bg-white p-5 border-b sticky top-0 z-50 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-black text-xl uppercase italic tracking-tighter">Checkout</h1>
      </div> */}

      <div className="max-w-4xl mx-auto mt-8 px-4 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Side: Address & Payment */}
        <div className="md:col-span-7 space-y-6">
          
          {/* 1. Delivery Address */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Home className="text-[#842A3B]" size={20} />
              <h2 className="font-black text-slate-800 uppercase text-sm tracking-widest">Delivery Address</h2>
            </div>
            <div className="p-4 border-2 border-[#842A3B] bg-[#842A3B]/5 rounded-2xl">
              <p className="font-bold text-slate-800">Home</p>
              <p className="text-xs text-slate-500 mt-1">123, Foodie Street, Near Tech Park, Bhopal</p>
            </div>
          </div>

          {/* 2. Offers & Coupons */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Ticket className="text-[#842A3B]" size={20} />
              <h2 className="font-black text-slate-800 uppercase text-sm tracking-widest">Offers & Coupons</h2>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter Code (e.g. FIRST50)" 
                className="flex-1 bg-slate-100 p-4 rounded-xl text-sm font-bold uppercase tracking-widest focus:outline-none border-2 border-transparent focus:border-[#842A3B]/20"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button 
                onClick={applyCoupon}
                className="bg-[#1a1a1a] text-white px-6 rounded-xl font-black text-xs uppercase"
              >
                Apply
              </button>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="text-[#842A3B]" size={20} />
              <h2 className="font-black text-slate-800 uppercase text-sm tracking-widest">Payment Method</h2>
            </div>
            <div className="space-y-3">
              {['Cash on Delivery', 'UPI / PhonePe', 'Credit/Debit Card'].map((method) => (
                <label key={method} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="font-bold text-sm text-slate-700">{method}</span>
                  <input type="radio" name="payment" className="accent-[#842A3B] w-4 h-4" />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="md:col-span-5">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 sticky top-24">
            <h2 className="font-black text-[#842A3B] text-xs uppercase tracking-[0.2em] mb-2">Ordering from</h2>
            <h3 className="font-black text-xl text-slate-800 mb-6 truncate">{restaurantName}</h3>

            <div className="space-y-4 border-b border-dashed pb-6">
              {items.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-slate-500 font-bold">{item.dishName} x {item.quantity}</span>
                  <span className="font-black text-slate-800">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="py-6 space-y-3 border-b border-dashed">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>Restaurant Bill</span>
                <span>₹{billDetails.itemTotal}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>Taxes & Charges</span>
                <span>₹{billDetails.gst + billDetails.delivery + billDetails.platform}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs font-black text-green-500">
                  <span>Coupon Discount</span>
                  <span>- ₹{discount}</span>
                </div>
              )}
            </div>

            <div className="pt-6 mb-8 flex justify-between items-end">
              <div>
                <span className="text-[10px] font-black text-[#842A3B] uppercase tracking-widest">Total to pay</span>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                  ₹{billDetails.grandTotal - discount}
                </h2>
              </div>
            </div>

            <button className="w-full bg-[#842A3B] text-white py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-lg shadow-[#842A3B]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
              Confirm Order <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;