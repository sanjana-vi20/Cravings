import React, { useState } from "react";
import { 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Package, 
  MoreVertical, 
  Search,
  Filter
} from "lucide-react";

const RestaurantOrder = () => {
  // Dummy Data for Orders
  const [orders, setOrders] = useState([
    { id: "ORD-101", customer: "Rahul V.", items: ["Paneer Tikka", "Butter Naan"], total: "₹450", time: "2 min ago", status: "new" },
    { id: "ORD-102", customer: "Sana K.", items: ["Veg Biryani", "Raita"], total: "₹320", time: "5 min ago", status: "preparing" },
    { id: "ORD-103", customer: "Amit M.", items: ["Margherita Pizza"], total: "₹280", time: "12 min ago", status: "ready" },
    { id: "ORD-104", customer: "Pooja G.", items: ["Cold Coffee", "Pasta"], total: "₹560", time: "1 min ago", status: "new" },
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen space-y-8 animate-in fade-in duration-700">
      
      {/* --- 1. Header & Controls --- */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Live Orders</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Real-time Kitchen Management</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
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

      {/* --- 2. Orders Board --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: New Orders */}
        <OrderColumn 
          title="New Requests" 
          count={orders.filter(o => o.status === 'new').length}
          icon={<Package className="text-blue-600" />}
          bg="bg-blue-50"
        >
          {orders.filter(o => o.status === 'new').map(order => (
            <OrderCard key={order.id} order={order} color="border-l-blue-500" />
          ))}
        </OrderColumn>

        {/* Column 2: Preparing */}
        <OrderColumn 
          title="In The Kitchen" 
          count={orders.filter(o => o.status === 'preparing').length}
          icon={<ChefHat className="text-orange-600" />}
          bg="bg-orange-50"
        >
          {orders.filter(o => o.status === 'preparing').map(order => (
            <OrderCard key={order.id} order={order} color="border-l-orange-500" />
          ))}
        </OrderColumn>

        {/* Column 3: Ready */}
        <OrderColumn 
          title="Ready for Pickup" 
          count={orders.filter(o => o.status === 'ready').length}
          icon={<CheckCircle2 className="text-green-600" />}
          bg="bg-green-50"
        >
          {orders.filter(o => o.status === 'ready').map(order => (
            <OrderCard key={order.id} order={order} color="border-l-green-500" />
          ))}
        </OrderColumn>

      </div>
    </div>
  );
};

// Sub-component for Columns
const OrderColumn = ({ title, count, icon, bg, children }) => (
  <div className="space-y-6">
    <div className={`flex items-center justify-between p-5 ${bg} rounded-[2rem] border border-white shadow-sm`}>
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="font-black text-slate-800 uppercase tracking-tighter">{title}</h2>
      </div>
      <span className="bg-white px-3 py-1 rounded-full text-xs font-black text-slate-600 shadow-sm">{count}</span>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

// Sub-component for individual Order Cards
const OrderCard = ({ order, color }) => (
  <div className={`bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all border-l-8 ${color}`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h4 className="font-black text-slate-800 text-lg tracking-tighter">{order.id}</h4>
        <p className="text-xs font-bold text-slate-400 uppercase">{order.customer}</p>
      </div>
      <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={20}/></button>
    </div>
    
    <div className="space-y-2 mb-6">
      {order.items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-600">
          <div className="w-1.5 h-1.5 bg-[#842A3B] rounded-full"></div>
          {item}
        </div>
      ))}
    </div>

    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
      <div className="flex items-center gap-1.5 text-slate-400">
        <Clock size={14} />
        <span className="text-[10px] font-black uppercase tracking-widest">{order.time}</span>
      </div>
      <div className="font-black text-[#842A3B]">{order.total}</div>
    </div>

    <div className="grid grid-cols-2 gap-2 mt-6">
       <button className="py-3 rounded-xl bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Details</button>
       <button className="py-3 rounded-xl bg-[#842A3B] text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Update</button>
    </div>
  </div>
);

export default RestaurantOrder;