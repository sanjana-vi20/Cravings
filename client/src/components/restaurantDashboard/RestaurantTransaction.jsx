import React, { useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  Utensils, 
  TrendingUp, 
  Percent, 
  Banknote,
  FileText
} from "lucide-react";

const RestaurantTransaction = () => {
  // Dummy Data for Restaurant
  const [transactions] = useState([
    {
      id: "TXN-R-9921",
      orderId: "ORD-5521",
      customer: "Sanjana Vishwakarma",
      date: "13 May 2026, 09:45 PM",
      totalAmount: 264,
      commission: 26.4, // 10% Platform fee
      netEarnings: 237.6,
      status: "settled", // settled means paisa restaurant ke account me chala gaya
    },
    {
      id: "TXN-R-9922",
      orderId: "ORD-5522",
      customer: "Rahul Mehra",
      date: "13 May 2026, 10:10 PM",
      totalAmount: 550,
      commission: 55.0,
      netEarnings: 495.0,
      status: "pending", // Order delivered but payment processing
    },
    {
      id: "TXN-R-REF",
      orderId: "ORD-5510",
      customer: "Amit Singh",
      date: "12 May 2026, 04:00 PM",
      totalAmount: -180, // Refund logic
      commission: 0,
      netEarnings: -180,
      status: "refunded",
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black italic text-slate-800 uppercase tracking-tighter">
              Restaurant <span className="text-[#842A3B]">Ledger</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              Earnings, Commissions & Settlements
            </p>
          </div>
          <button className="flex items-center gap-2 bg-[#842A3B] text-white px-6 py-3 rounded-2xl shadow-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all">
            <Download size={14} /> Export GST Report
          </button>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-maroon-50 text-[#842A3B] rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Revenue</p>
            <h3 className="text-2xl font-black text-slate-800 italic">₹45,890</h3>
            <p className="text-[10px] text-green-500 font-bold mt-1">+12% from last week</p>
          </div>
          
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
              <Percent size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Fees</p>
            <h3 className="text-2xl font-black text-slate-800 italic">₹4,589</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Fixed 10% commission</p>
          </div>

          <div className="bg-[#842A3B] p-6 rounded-[2.5rem] shadow-xl text-white">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Banknote size={24} />
            </div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Next Payout</p>
            <h3 className="text-2xl font-black italic">₹38,201</h3>
            <p className="text-[10px] text-white/40 font-bold mt-1">Scheduled for 15th May</p>
          </div>
        </div>

        {/* Ledger Table Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-black text-slate-800 uppercase italic text-sm">Recent Settlements</h3>
            <div className="flex gap-2">
               <span className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-400 uppercase">May 2026</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Details</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Amount</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Fee</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Earning</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-5">
                      <p className="font-black text-slate-800 text-xs uppercase italic">{txn.customer}</p>
                      <p className="text-[9px] font-bold text-slate-400 tracking-tighter">ID: {txn.orderId}</p>
                    </td>
                    <td className="p-5 font-bold text-slate-700 text-sm">₹{Math.abs(txn.totalAmount)}</td>
                    <td className="p-5 text-red-500 font-bold text-xs">- ₹{txn.commission}</td>
                    <td className="p-5 font-black text-slate-900 text-sm italic">
                        {txn.netEarnings > 0 ? `₹${txn.netEarnings}` : <span className="text-red-500">- ₹{Math.abs(txn.netEarnings)}</span>}
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        txn.status === 'settled' ? 'bg-green-50 text-green-600' : 
                        txn.status === 'pending' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Support Section */}
        <div className="flex items-center justify-between p-6 bg-slate-100 rounded-[2rem] border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-[#842A3B]"><FileText size={20}/></div>
            <div>
              <p className="text-xs font-black text-slate-800 uppercase tracking-tight italic">Discrepancy in payments?</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Contact our Merchant Support Team</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-white text-[#842A3B] border border-[#842A3B]/20 rounded-xl text-[10px] font-black uppercase hover:bg-[#842A3B] hover:text-white transition-all">Raise Ticket</button>
        </div>

      </div>
    </div>
  );
};

export default RestaurantTransaction;