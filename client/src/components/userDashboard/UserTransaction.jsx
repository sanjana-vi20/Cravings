import React, { useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Download, 
  ExternalLink,
  CreditCard,
  Wallet
} from "lucide-react";

const UserTransaction = () => {
  // Dummy Data
  const [transactions] = useState([
    {
      id: "TXN-88291",
      orderId: "ORD-177869",
      restaurant: "Tanishk da dhaba",
      date: "13 May 2026, 10:30 PM",
      amount: 264,
      method: "Razorpay (UPI)",
      status: "success",
      type: "payment"
    },
    {
      id: "TXN-88295",
      orderId: "ORD-177872",
      restaurant: "Burger King",
      date: "12 May 2026, 08:15 PM",
      amount: 450,
      method: "Wallet",
      status: "success",
      type: "payment"
    },
    {
      id: "TXN-REF-112",
      orderId: "ORD-177850",
      restaurant: "Cravings Refund",
      date: "11 May 2026, 02:00 PM",
      amount: 120,
      method: "Refund to Source",
      status: "refunded",
      type: "refund"
    },
    {
      id: "TXN-88299",
      orderId: "ORD-177880",
      restaurant: "Pizza Hut",
      date: "10 May 2026, 09:00 PM",
      amount: 890,
      method: "Credit Card",
      status: "failed",
      type: "payment"
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black italic text-slate-800 uppercase tracking-tighter">
              Payment <span className="text-[#842A3B]">History</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              Track your spends and refunds
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
              <Download size={14} /> Download Statement
            </button>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Spent</p>
              <h3 className="text-2xl font-black text-slate-800 italic">₹12,450</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <ArrowDownLeft size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Refunds Recieved</p>
              <h3 className="text-2xl font-black text-slate-800 italic">₹1,200</h3>
            </div>
          </div>

          <div className="bg-[#842A3B] p-6 rounded-[2.5rem] shadow-xl flex items-center gap-5 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Active Orders</p>
              <h3 className="text-2xl font-black italic">3 Orders</h3>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-100">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Restaurant..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none text-xs font-bold focus:ring-2 focus:ring-[#842A3B]/20 outline-none"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 rounded-2xl text-[10px] font-black uppercase text-slate-600">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {transactions.map((txn) => (
            <div 
              key={txn.id}
              className="group bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  txn.type === 'refund' ? 'bg-blue-50 text-blue-600' : 
                  txn.status === 'failed' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}>
                  {txn.type === 'refund' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-slate-800 uppercase italic text-sm">{txn.restaurant}</h4>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${
                      txn.status === 'success' ? 'bg-green-100 text-green-700' : 
                      txn.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {txn.status}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{txn.date}</p>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-none pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">ID: {txn.orderId}</p>
                  <p className="text-[9px] font-bold text-slate-300 uppercase">{txn.method}</p>
                </div>
                <div className="flex items-center gap-4">
                   <h2 className={`text-xl font-black italic ${txn.type === 'refund' ? 'text-blue-600' : 'text-slate-800'}`}>
                    {txn.type === 'refund' ? '+' : '-'} ₹{txn.amount}
                  </h2>
                  <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-[#842A3B] transition-colors">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] py-10">
          End of transactions • Powered by Cravings Secure Pay
        </p>
      </div>
    </div>
  );
};

export default UserTransaction;