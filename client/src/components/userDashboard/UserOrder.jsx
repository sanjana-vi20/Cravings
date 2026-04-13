import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Clock, MapPin, CheckCircle2, 
  Truck, Utensils, ChevronRight, Star 
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const UserOrder = () => {
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const orders = [
    {
      id: "#CRV-9821",
      date: "Feb 18, 2026",
      status: "On the way",
      total: "₹849",
      items: ["Fresh Garden Pizza x1", "Garlic Bread x2"],
      restaurant: "Bhopal Gourmet Kitchen",
      progress: 75,
    },
    {
      id: "#CRV-7712",
      date: "Feb 15, 2026",
      status: "Delivered",
      total: "₹499",
      items: ["Gourmet Beef Burger x1"],
      restaurant: "The Burger Club",
      progress: 100,
    }
  ];

  const filteredOrders = activeTab === 'active' 
    ? orders.filter(o => o.status !== 'Delivered') 
    : orders.filter(o => o.status === 'Delivered');

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 font-sans antialiased text-slate-900">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6" data-aos="fade-down">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">My Culinary Journey</h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Order Management</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
          <button 
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'active' ? 'bg-white text-[#842A3B] shadow-md' : 'text-slate-400'}`}
          >
            ACTIVE ORDERS
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'history' ? 'bg-white text-[#842A3B] shadow-md' : 'text-slate-400'}`}
          >
            PAST ORDERS
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <div 
              key={order.id} 
              data-aos="fade-up" 
              data-aos-delay={index * 100}
              className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-8 hover:shadow-xl transition-all duration-500"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                {/* Order Meta */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#842A3B]/5 rounded-2xl text-[#842A3B]">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 tracking-tight text-lg">{order.restaurant}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID: {order.id}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F5DAA7]" /> {item}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Tracking & Status */}
                <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Status</p>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                      order.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-[#842A3B] border-red-100'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#842A3B] transition-all duration-1000 ease-out"
                        style={{ width: `${order.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 tracking-wider">
                      <span className="flex items-center gap-1"><Utensils size={12}/> PLACED</span>
                      <span className="flex items-center gap-1"><Truck size={12}/> {order.progress >= 75 ? 'OUT' : 'PENDING'}</span>
                      <span className="flex items-center gap-1"><CheckCircle2 size={12}/> DELIVERED</span>
                    </div>
                  </div>
                </div>

                {/* Actions & Price */}
                <div className="lg:w-48 flex flex-col justify-between items-end gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-2xl font-black text-slate-800">{order.total}</p>
                  </div>
                  
                  <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black tracking-[0.2em] text-slate-500 hover:bg-slate-50 hover:text-[#842A3B] transition-all flex items-center justify-center gap-2 group">
                    VIEW DETAILS <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center space-y-4 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                <ShoppingBag size={40} />
             </div>
             <p className="font-bold text-slate-400 italic">No {activeTab} orders found. Time to eat something?</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrder;