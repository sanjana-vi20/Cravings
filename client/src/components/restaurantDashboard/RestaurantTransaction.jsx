import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Utensils,
  TrendingUp,
  Percent,
  Banknote,
  FileText,
} from "lucide-react";
import api from "../../config/Api";

const RestaurantTransaction = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(import.meta.env.VITE_RESTAURANT_GET_ALL_ORDERS);
      if (res.data && res.data.data) {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 1. DYNAMIC TOP CARD CALCULATIONS (Safely parsed via Explicit Base-10 Floats)
  const grossRevenue = orders.reduce((acc, order) => {
    const sub = parseFloat(order.subtotal) || parseFloat(order.orderValue?.subtotal) || 0;
    const tx = parseFloat(order.tax) || parseFloat(order.orderValue?.tax) || 0;
    return acc + (sub + tx);
  }, 0);

  const platformFees = orders.reduce((acc, order) => {
    const sub = parseFloat(order.subtotal) || parseFloat(order.orderValue?.subtotal) || 0;
    return acc + (sub * 0.10);
  }, 0);

  const nextPayout = grossRevenue - platformFees;

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
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Gross Revenue
            </p>
            <h3 className="text-2xl font-black text-slate-800 italic">
              ₹{grossRevenue.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </h3>
            <p className="text-[10px] text-green-500 font-bold mt-1">
              Live from Database
            </p>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
              <Percent size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Platform Fees
            </p>
            <h3 className="text-2xl font-black text-slate-800 italic">
              ₹{platformFees.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1">
              Fixed 10% commission
            </p>
          </div>

          <div className="bg-[#842A3B] p-6 rounded-[2.5rem] shadow-xl text-white">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Banknote size={24} />
            </div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">
              Next Payout
            </p>
            <h3 className="text-2xl font-black italic">
              ₹{nextPayout.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </h3>
            <p className="text-[10px] text-white/40 font-bold mt-1">
              Automated Calculation
            </p>
          </div>
        </div>

        {/* Ledger Table Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-black text-slate-800 uppercase italic text-sm">
              Recent Settlements
            </h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-400 uppercase">
                Live Status
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-10 text-center font-bold text-slate-400 uppercase tracking-wider text-xs">
                Loading live ledger data...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-10 text-center font-bold text-slate-400 uppercase tracking-wider text-xs">
                No orders found for this restaurant.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Order Details
                    </th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Order Amount
                    </th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Platform Fee
                    </th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Your Earning
                    </th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map((order) => {
                    // Fallback targets strictly looking for root items or sub-object models
                    const orderAmt = parseFloat(order.total) || parseFloat(order.orderValue?.total) || 0;
                    const subtotal = parseFloat(order.subtotal) || parseFloat(order.orderValue?.subtotal) || 0;
                    const tax = parseFloat(order.tax) || parseFloat(order.orderValue?.tax) || 0;
                    
                    const fee = subtotal * 0.10;
                    const earning = (subtotal + tax) - fee;
                    
                    // STATUS ROUTING RESOLUTION
                    let statusLabel = "PENDING";
                    let badgeClass = "bg-blue-50 text-blue-600";
                    
                    if (order.status === "completed" || order.paymentStatus === "paid" || order.status === "ready") {
                      statusLabel = "SETTLED";
                      badgeClass = "bg-green-50 text-green-600";
                    } else if (order.status === "cancelled" || order.status === "refunded") {
                      statusLabel = "REFUNDED";
                      badgeClass = "bg-red-50 text-red-600";
                    }

                    return (
                      <tr key={order._id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="p-5">
                          <p className="font-black text-slate-800 text-xs uppercase italic">
                            {order.userId?.fullName || "Regular Customer"}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 tracking-tighter">
                            ID: {order.orderNumber}
                          </p>
                        </td>
                        <td className="p-5 font-bold text-slate-700 text-sm">
                          ₹{orderAmt.toFixed(1)}
                        </td>
                        <td className="p-5 text-red-500 font-bold text-xs">
                          - ₹{fee.toFixed(1)}
                        </td>
                        <td className="p-5 font-black text-slate-900 text-sm italic">
                          {earning >= 0 ? (
                            `₹${earning.toFixed(1)}`
                          ) : (
                            <span className="text-red-500">- ₹{Math.abs(earning).toFixed(1)}</span>
                          )}
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${badgeClass}`}>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Support Section */}
        <div className="flex items-center justify-between p-6 bg-slate-100 rounded-[2rem] border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-[#842A3B]">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 uppercase tracking-tight italic">
                Discrepancy in payments?
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">
                Contact our Merchant Support Team
              </p>
            </div>
          </div>
          <button className="px-6 py-2 bg-white text-[#842A3B] border border-[#842A3B]/20 rounded-xl text-[10px] font-black uppercase hover:bg-[#842A3B] hover:text-white transition-all">
            Raise Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantTransaction;