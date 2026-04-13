import React, { useState } from "react";
import { 
  Navigation, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  IndianRupee, 
  Star,
  Zap,
  LayoutDashboard,
  History,
  User,
  Power
} from "lucide-react";

const RiderDashboard = () => {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* --- Sidebar (Desktop) / Bottom Nav (Mobile) --- */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 p-4 flex justify-around md:relative md:w-24 md:flex-col md:border-r md:border-t-0 md:justify-start md:gap-10 z-50">
        <div className="hidden md:flex items-center justify-center py-4">
          <div className="w-12 h-12 bg-[#842A3B] rounded-2xl flex items-center justify-center text-white font-bold text-xl">R</div>
        </div>
        <NavItem icon={<LayoutDashboard size={24} />} active />
        <NavItem icon={<History size={24} />} />
        <NavItem icon={<User size={24} />} />
        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`p-3 rounded-2xl transition-all ${isOnline ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
        >
          <Power size={24} strokeWidth={3} />
        </button>
      </nav>

      {/* --- Main Content --- */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        
        {/* --- Header Section --- */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Vroom, Rahul! 🏍️</h1>
            <p className="text-slate-500 font-medium">You are {isOnline ? "Online & Ready" : "Offline"}</p>
          </div>
          <div className="flex gap-4">
            <StatCard icon={<IndianRupee size={18}/>} label="Today" value="₹1,240" color="bg-blue-50 text-blue-600" />
            <StatCard icon={<Star size={18}/>} label="Rating" value="4.8" color="bg-amber-50 text-amber-600" />
          </div>
        </header>

        {/* --- Live Delivery Card (Sticky Focus) --- */}
        {isOnline && (
          <section className="mb-8">
            <div className="bg-[#842A3B] text-white rounded-[2.5rem] p-6 shadow-2xl shadow-red-900/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Navigation size={120} />
                </div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Active Delivery</span>
                        <div className="flex items-center gap-2 text-[#F5DAA7]">
                            <Clock size={16} />
                            <span className="font-bold">12 mins left</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-3 h-3 bg-[#F5DAA7] rounded-full" />
                                <div className="w-0.5 h-10 border-r-2 border-dashed border-white/30 my-1" />
                                <MapPin size={18} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="mb-4">
                                    <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Pickup</p>
                                    <h3 className="font-bold text-lg">The Spicy Bistro, Sector 44</h3>
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Drop</p>
                                    <h3 className="font-bold text-lg">H.No 402, Royal Residency</h3>
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-[#F5DAA7] text-[#842A3B] py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white transition-all">
                            Open Map <Navigation size={18} />
                        </button>
                    </div>
                </div>
            </div>
          </section>
        )}

        {/* --- Secondary Sections --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Order Queue */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Package size={22} className="text-[#842A3B]" /> Order Queue
            </h2>
            
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between group hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#842A3B]/5 group-hover:text-[#842A3B] transition-colors">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase text-sm tracking-tight">Order #842{i}</h4>
                    <p className="text-slate-400 text-xs font-bold">2.4 km away • ₹65.00</p>
                  </div>
                </div>
                <button className="p-3 bg-slate-50 rounded-xl group-hover:bg-[#842A3B] group-hover:text-white transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            ))}
          </section>

          {/* Earnings Chart / Summary Placeholder */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <CheckCircle2 size={22} className="text-green-500" /> Recent Completed
            </h2>
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6">
                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                        <span className="text-slate-500 font-bold">Total Deliveries</span>
                        <span className="text-slate-800 font-black">24</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                        <span className="text-slate-500 font-bold">Online Hours</span>
                        <span className="text-slate-800 font-black">6h 12m</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-bold">Incentives Earned</span>
                        <span className="text-green-600 font-black">+₹150</span>
                    </div>
                </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

// --- Sub-components ---
const NavItem = ({ icon, active = false }) => (
  <button className={`p-4 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-[#842A3B] text-white shadow-lg shadow-red-900/20' : 'text-slate-400 hover:bg-slate-100'}`}>
    {icon}
  </button>
);

const StatCard = ({ icon, label, value, color }) => (
  <div className={`${color} px-4 py-2 rounded-2xl flex flex-col items-center justify-center min-w-[80px]`}>
    <div className="mb-1">{icon}</div>
    <span className="text-[10px] font-black uppercase opacity-60 tracking-tighter">{label}</span>
    <span className="text-sm font-black tracking-tight">{value}</span>
  </div>
);

export default RiderDashboard;