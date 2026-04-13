import React from "react";
import { 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownRight, 
  Timer, 
  Utensils,
  Star,
  Activity
} from "lucide-react";

const ResturantOverview = () => {
  // Dummy Data for Stats
  const metrics = [
    {
      title: "Total Revenue",
      value: "₹42,850.00",
      change: "+12.5%",
      isPositive: true,
      icon: <IndianRupee className="text-green-600" />,
      bg: "bg-green-50",
    },
    {
      title: "Active Orders",
      value: "12",
      change: "+2 today",
      isPositive: true,
      icon: <ShoppingBag className="text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      title: "Avg. Prep Time",
      value: "18 min",
      change: "-2 min",
      isPositive: true,
      icon: <Timer className="text-orange-600" />,
      bg: "bg-orange-50",
    },
    {
      title: "Customer Rating",
      value: "4.8",
      change: "+0.2",
      isPositive: true,
      icon: <Star className="text-yellow-600" />,
      bg: "bg-yellow-50",
    },
  ];

  const recentOrders = [
    { id: "#ORD-9921", dish: "Paneer Butter Masala", price: "₹320", type: "Veg", status: "Cooking" },
    { id: "#ORD-9920", dish: "Chicken Biryani", price: "₹450", type: "Non-Veg", status: "Pending" },
    { id: "#ORD-9919", dish: "Cold Coffee", price: "180", type: "Veg", status: "Ready" },
    { id: "#ORD-9918", dish: "Masala Dosa", price: "₹120", type: "Veg", status: "Delivered" },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* --- 1. Top Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Restaurant Overview</h1>
          <p className="text-slate-500 font-medium">Welcome back, manager. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all">
            Download Report
          </button>
          <button className="px-6 py-3 bg-[#842A3B] text-white rounded-2xl font-bold shadow-lg shadow-[#842A3B]/20 hover:scale-105 transition-all">
            + New Order
          </button>
        </div>
      </div>

      {/* --- 2. Stats Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${item.bg}`}>
                {item.icon}
              </div>
              <div className={`flex items-center text-xs font-black ${item.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {item.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {item.change}
              </div>
            </div>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">{item.title}</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* --- 3. Recent Orders Table (Left) --- */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Activity size={20} className="text-[#842A3B]" /> Live Orders
            </h2>
            <button className="text-sm font-bold text-[#842A3B] hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                  <th className="pb-4">Order ID</th>
                  <th className="pb-4">Items</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0 group">
                    <td className="py-5 font-bold text-slate-500">{order.id}</td>
                    <td className="py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${order.type === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="font-bold text-slate-800">{order.dish}</span>
                      </div>
                    </td>
                    <td className="py-5">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter 
                        ${order.status === 'Cooking' ? 'bg-blue-100 text-blue-600' : 
                          order.status === 'Ready' ? 'bg-green-100 text-green-600' : 
                          'bg-orange-100 text-orange-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-5 text-right font-black text-slate-800">{order.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- 4. Popular Items / Inventory (Right) --- */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h2 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tighter">Inventory Alert</h2>
            <div className="space-y-6">
              {[
                { name: "Chicken Stock", level: 85, color: "bg-green-500" },
                { name: "Cooking Oil", level: 20, color: "bg-red-500" },
                { name: "Basmati Rice", level: 45, color: "bg-orange-500" }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-600">{item.name}</span>
                    <span className="text-slate-800">{item.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#842A3B] to-[#b03a51] p-8 rounded-[3rem] text-white shadow-xl">
             <Utensils size={32} className="mb-4 opacity-50" />
             <h3 className="text-xl font-black mb-2">Weekend Special</h3>
             <p className="text-white/80 text-sm font-medium mb-6">
               "Tanishk Special Thali" is trending 40% higher this week compared to last.
             </p>
             <button className="w-full py-3 bg-white text-[#842A3B] rounded-2xl font-black text-xs uppercase tracking-widest">
               Update Pricing
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResturantOverview;