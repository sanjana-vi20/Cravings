import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  Utensils,
  ChevronRight,
  Package,
  MapPin,
  Receipt,
  X,
  CreditCard,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import api from "../../config/Api";
import { socket } from "../../config/Websocket";
import { useAuth } from "../../context/AuthContext";

const UserOrder = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // --- 1. Initial Load & Socket Listener ---
  useEffect(() => {
    socket.connect();

    if (user?._id) {
      socket.emit("join_restaurant", user._id);
    }

    socket.on("connect", () => {
      console.log("Socket connected! ID:", socket.id);
    });

    // Ye check karne ke liye ki backend se kuch bhi aa raha hai ya nahi
    socket.onAny((eventName, ...args) => {
      console.log(`Event: ${eventName}`, args);
    });
  }, [user?._id]);

  const handleStatusUpdate = async (data , nextStatus) => {
      // List update karo
      console.log("Data AAYA hai naya or vo ye hai ", data);

      const res = await api.patch(
        `/restaurant/update-order-status/${data}`,
        {
          status: nextStatus,
        },
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === data.orderId
            ? { ...order, status: data.status }
            : order,
        ),
      );

      // Selected order card update karo (using functional update to avoid dependency loop)
      setSelectedOrder((current) => {
        if (current?._id === data.orderId) {
          return { ...current, status: data.status };
        }
        return current;
      });
    };

  useEffect(() => {
    // AOS.init({ duration: 800 });
    fetchMyOrders();

    socket.on("order_status_update", handleStatusUpdate);

    return () => socket.off("order_status_update", handleStatusUpdate);
  }, []); // Empty dependency array is important!

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user/my-orders");
      const data = res.data.data;

      const ordersArray = Array.isArray(data) ? data : data ? [data] : [];
      setOrders(ordersArray);

      const initialFiltered = ordersArray.filter((order) => {
        const isCompleted = ["delivered", "rejected", "cancelled"].includes(
          order.status,
        );
        return !isCompleted; // Default hum active tab dikhate hain
      });

      if (initialFiltered.length > 0) {
        setSelectedOrder(initialFiltered[0]);
      } else if (ordersArray.length > 0) {
        setSelectedOrder(ordersArray[0]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filteredOrders.length > 0) {
      // Agar current selected order filtered list mein nahi hai, toh pehla wala select karo
      const isStillVisible = filteredOrders.find(
        (o) => o._id === selectedOrder?._id,
      );
      if (!isStillVisible) {
        setSelectedOrder(filteredOrders[0]);
      }
    } else {
      setSelectedOrder(null);
    }
  }, [activeTab, orders]); // Jab tab badle ya socket se orders update hon

  // --- 3. Progress Percentage Logic ---
  console.log(orders);

  const getProgress = (status) => {
    const map = {
      pending: 15,
      accepted: 35,
      preparing: 55,
      ready: 75,
      onTheWay: 85,
      delivered: 100,
      rejected: 0,
      cancelled: 0,
    };
    return map[status] || 10;
  };

  // --- 4. Tab Filtering ---
  const filteredOrders = orders.filter((order) => {
    const isCompleted = ["delivered", "rejected", "cancelled"].includes(
      order.status,
    );
    return activeTab === "active" ? !isCompleted : isCompleted;
  });
  console.log(filteredOrders);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#842A3B] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">
            Fetching your orders...
          </p>
        </div>
      </div>
    );
  }

  console.log(selectedOrder);

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto font-sans antialiased text-slate-900 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT SIDE: ORDERS LIST */}
        <div className="flex-1 space-y-8">
          <header>
            <h1 className="text-4xl font-black italic tracking-tighter text-slate-800 uppercase">
              My <span className="text-[#842A3B]">Orders</span>
            </h1>
            <div className="flex bg-slate-200/50 p-1.5 rounded-3xl border border-slate-200 w-fit mt-6 backdrop-blur-sm">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-8 py-2.5 rounded-2xl text-[10px] font-black transition-all duration-300 ${activeTab === "active" ? "bg-[#842A3B] text-white shadow-lg" : "text-slate-400"}`}
              >
                ACTIVE
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-8 py-2.5 rounded-2xl text-[10px] font-black transition-all duration-300 ${activeTab === "history" ? "bg-[#842A3B] text-white shadow-lg" : "text-slate-400"}`}
              >
                HISTORY
              </button>
            </div>
          </header>

          <div className="grid gap-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`group bg-white rounded-[2.5rem] border p-6 cursor-pointer transition-all duration-500 relative overflow-hidden ${
                    selectedOrder?._id === order._id
                      ? "border-[#842A3B] ring-4 ring-[#842A3B]/5 shadow-2xl shadow-[#842A3B]/10"
                      : "border-slate-100 hover:shadow-xl hover:border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-5">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${selectedOrder?._id === order._id ? "bg-[#842A3B] text-white" : "bg-slate-50 text-slate-400"}`}
                      >
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 uppercase italic tracking-tight">
                          {order.items?.[0]?.restaurantID?.restaurantName ||
                            "Restaurant"}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                          ID: #{order.orderNumber?.split("-")[1]}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-900 tracking-tighter italic">
                        ₹{order.orderValue?.total}
                      </p>
                      <span
                        className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${order.status === "delivered" ? "bg-green-50 text-green-600" : "bg-[#842A3B]/5 text-[#842A3B]"}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <Package size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  No {activeTab} orders found
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: ORDER DETAILS CARD */}
        <div className="lg:w-[450px]">
          {selectedOrder ? (
            <div className="sticky top-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden p-8 md:p-10 space-y-8">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter text-[#842A3B]">
                    Details
                  </h2>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Live Tracking Enabled
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                  <Receipt size={20} />
                </div>
              </div>

              {/* Status Stepper */}
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Order Progress</span>
                  <span className="text-[#842A3B]">
                    {getProgress(selectedOrder.status)}%
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#842A3B] to-[#b93d54] rounded-full transition-all duration-1000 shadow-lg"
                    style={{ width: `${getProgress(selectedOrder.status)}%` }}
                  />
                </div>
              </div>

              {/* Items Summary */}
              <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50 pb-2">
                  Itemized Bill
                </p>
                {selectedOrder.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#842A3B]" />
                      <span className="font-bold text-slate-700 uppercase tracking-tighter">
                        {item.dishName}
                      </span>
                      <span className="text-[10px] font-black text-slate-300 uppercase ml-1">
                        x{item.quantity}
                      </span>
                    </div>
                    <span className="font-black text-slate-800 italic">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Address & Payment Info */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1">
                    <CreditCard size={10} /> Payment
                  </p>
                  <p className="text-[11px] font-black text-slate-700 uppercase italic tracking-tighter">
                    {selectedOrder.orderValue?.paymentMethod} (
                    {selectedOrder.orderValue?.paymentStatus})
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1 justify-end">
                    <Clock size={10} /> Ordered On
                  </p>
                  <p className="text-[11px] font-black text-slate-700 uppercase italic tracking-tighter">
                    {new Date(selectedOrder.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Bill Breakdown */}
              <div className="bg-[#FAF7F2] p-8 rounded-[2.5rem] space-y-4 border border-[#842A3B]/5 shadow-inner">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.orderValue?.subtotal}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <span>Delivery Fee</span>
                  <span>₹{selectedOrder.orderValue?.deliveryFee}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-2">
                  <span className="text-xs font-black uppercase italic tracking-widest text-[#842A3B]">
                    Total Paid
                  </span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter italic">
                    ₹{selectedOrder.orderValue?.total}
                  </span>
                </div>
              </div>

              <button
                className="w-full py-5 bg-[#842A3B] text-[#F5DAA7] rounded-[2rem] font-black text-[10px] tracking-[0.4em] uppercase shadow-2xl shadow-[#842A3B]/30 hover:bg-slate-900 transition-all duration-500"
                onClick={() => {handleStatusUpdate(selectedOrder._id , "cancelled")}}
              >
                Cancel Order
              </button>
            </div>
          ) : (
            <div className="h-[550px] border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center text-slate-200 gap-4 bg-white/50 backdrop-blur-sm">
              <div className="animate-bounce">
                <Package size={80} strokeWidth={1} />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">
                Pick an order to inspect
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrder;
