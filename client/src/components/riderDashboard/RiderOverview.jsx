import React from 'react';
import { ShoppingBag, MapPin, Star, Bike, Wallet, Zap } from 'lucide-react';

const RiderOverview = () => {
  const stats = [
    { label: 'Earnings', value: '₹12,450', icon: <Wallet size={18} />, bg: 'bg-green-50', text: 'text-green-600' },
    { label: 'Orders', value: '142', icon: <ShoppingBag size={18} />, bg: 'bg-red-50', text: 'text-[#842A3B]' },
    { label: 'Distance', value: '850 km', icon: <MapPin size={18} />, bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Rating', value: '4.8', icon: <Star size={18} />, bg: 'bg-orange-50', text: 'text-orange-600' },
  ];

  return (
    <div className="bg-slate-50 m-2 rounded-[2rem] p-6 font-sans">
      {/* Mini Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">Dashboard</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Updates</p>
        </div>
        <button className="bg-[#842A3B] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">
          Go Offline
        </button>
      </div>

      {/* Compact Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
            <div className={`w-8 h-8 ${stat.bg} ${stat.text} rounded-lg flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{stat.label}</p>
            <h2 className="text-lg font-black text-slate-800">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compact Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[1.5rem] p-5 border border-slate-100">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-[#842A3B] mb-4 flex items-center gap-2">
            <Bike size={14} /> Recent Tasks
          </h3>
          <div className="space-y-2">
            {[1, 2, 3].map((order) => (
              <div key={order} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#842A3B] shadow-sm">
                    <Zap size={14} />
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-[11px]">#ORD-552{order}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">2.4 km away</p>
                  </div>
                </div>
                <p className="font-black text-green-600 text-xs">+₹85</p>
              </div>
            ))}
          </div>
        </div>

        {/* Small Tip Card */}
        <div className="bg-[#842A3B] rounded-[1.5rem] p-5 text-white flex flex-col justify-center shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
          <h3 className="text-[10px] font-black uppercase text-[#F5DAA7] mb-2">Pro Tip</h3>
          <p className="text-[11px] font-bold leading-relaxed text-white/80">
            High demand in **MP Nagar**. Move there to get orders 2x faster!
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiderOverview;