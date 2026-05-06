import React, { useState, useEffect, useCallback } from "react";
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Package,
  MoreVertical,
  Search,
  Filter,
  X,
} from "lucide-react";
import { socket } from "../../config/Websocket";
import api from "../../config/Api";
import { useAuth } from "../../context/AuthContext";
// import api from "../../config/axios"; // Apna axios instance use karein
import toast from "react-hot-toast";

const RestaurantOrder = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // Details Modal ke liye

  // --- 1. Fetch Initial Data ---
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/restaurant/fetch-orders"); // Wahi API jo pending/preparing deti ho
      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  console.log(orders);

  // --- 2. Socket & Lifecycle ---
  useEffect(() => {
    fetchOrders();
    socket.connect();

    if (user?._id) {
      socket.emit("join_restaurant", user._id);
    }

    socket.on("new_order_received", (newOrder) => {
      toast.success("New Order Received! 🍔", { icon: "🔔" });
      setOrders((prev) => [newOrder, ...prev]);
    });

    return () => {
      socket.off("new_order_received");
    };
  }, [user?._id, fetchOrders]);

  // --- 3. Handle Status Update (Moving between columns) ---
  const handleUpdateStatus = async (orderId, currentStatus) => {
    let nextStatus = "";
    if (currentStatus === "pending") nextStatus = "preparing";
    else if (currentStatus === "preparing") nextStatus = "ready";
    else if (currentStatus === "ready") nextStatus = "delivered";

    try {
      const res = await api.patch(
        `/restaurant/update-order-status/${orderId}`,
        {
          status: nextStatus,
        },
      );

      if (res.status === 200) {
        toast.success(`Order moved to ${nextStatus}`);

        if (nextStatus === "delivered") {
          // List se hata do agar kaam khatam ho gaya
          setOrders((prev) => prev.filter((o) => o._id !== orderId));
        } else {
          // Status update karo, React filters khud move kar denge card ko
          setOrders((prev) =>
            prev.map((o) =>
              o._id === orderId ? { ...o, status: nextStatus } : o,
            ),
          );
        }
      }
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center font-bold">Loading Live Board...</div>
    );

  return (
    <div className="p-8 bg-slate-50 min-h-screen space-y-8 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter flex items-center gap-2">
            Live Orders{" "}
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">
            Kitchen Pipeline
          </p>
        </div>
      </div>

      {/* Orders Board - 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1: New */}
        <OrderColumn
          title="New Requests"
          icon={<Package className="text-blue-600" />}
          bg="bg-blue-50"
          count={orders.filter((o) => o.status === "pending").length}
        >
          {orders
            .filter((o) => o.status === "pending")
            .map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                color="border-l-blue-500"
                onUpdate={() => handleUpdateStatus(order._id, order.status)}
                onDetails={() => setSelectedOrder(order)}
              />
            ))}
        </OrderColumn>

        {/* Column 2: In Kitchen */}
        <OrderColumn
          title="In Kitchen"
          icon={<ChefHat className="text-orange-600" />}
          bg="bg-orange-50"
          count={orders.filter((o) => o.status === "preparing").length}
        >
          {orders
            .filter((o) => o.status === "preparing")
            .map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                color="border-l-orange-500"
                onUpdate={() => handleUpdateStatus(order._id, order.status)}
                onDetails={() => setSelectedOrder(order)}
              />
            ))}
        </OrderColumn>

        {/* Column 3: Ready */}
        <OrderColumn
          title="Ready for Pickup"
          icon={<CheckCircle2 className="text-green-600" />}
          bg="bg-green-50"
          count={orders.filter((o) => o.status === "ready").length}
        >
          {orders
            .filter((o) => o.status === "ready")
            .map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                color="border-l-green-500"
                onUpdate={() => handleUpdateStatus(order._id, order.status)}
                onDetails={() => setSelectedOrder(order)}
              />
            ))}
        </OrderColumn>
      </div>

      {/* Details Overlay (Modal) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-end transition-all">
          {/* Dark Overlay - Click to Close */}
          <div
            className="absolute inset-0"
            onClick={() => setSelectedOrder(null)}
          ></div>

          {/* Drawer Content */}
          <div className="w-full max-w-lg bg-slate-50 h-full relative shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
            {/* Header Section */}
            <div className="sticky top-10 z-10000 bg-white p-6 border-b flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tighter">
                  {selectedOrder.orderNumber}
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Placed on:{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-3 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-600" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Customer & Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                    Customer
                  </p>
                  <p className="font-bold text-slate-800">
                    {selectedOrder.userId?.fullName || "Guest"}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                    Status
                  </p>
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-md text-[10px] font-black uppercase">
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  Order Items{" "}
                  <span className="text-slate-300">
                    ({selectedOrder.items.length})
                  </span>
                </h3>

                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="bg-white p-4 rounded-3xl border border-slate-100 flex gap-4 items-center"
                    >
                      {/* Dish Image */}
                      <img
                        src={
                          item.image?.[0]?.url ||
                          "https://via.placeholder.com/100"
                        }
                        alt={item.dishName}
                        className="w-20 h-20 rounded-2xl object-cover bg-slate-100"
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {/* Veg/Non-Veg Icon */}
                          <div
                            className={`w-3 h-3 border-2 flex items-center justify-center ${item.type === "veg" ? "border-green-600" : "border-red-600"}`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${item.type === "veg" ? "bg-green-600" : "bg-red-600"}`}
                            ></div>
                          </div>
                          <h4 className="font-bold text-slate-800">
                            {item.dishName}
                          </h4>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                          {item.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <p className="text-sm font-black text-[#842A3B]">
                            {item.quantity} x ₹{item.price}
                          </p>
                          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                            <Clock size={12} /> {item.preparationTime} MINS
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Summary */}
              <div className="bg-[#842A3B] text-white p-6 rounded-[2.5rem] shadow-xl shadow-red-900/20">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-70">
                  Payment Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">Subtotal</span>
                    <span className="font-bold">
                      ₹
                      {selectedOrder.orderValue?.subtotal ||
                        selectedOrder.orderValue?.total}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">GST & Taxes</span>
                    <span className="font-bold">Included</span>
                  </div>
                  <div className="h-px bg-white/20 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black uppercase">
                      Grand Total
                    </span>
                    <span className="text-3xl font-black">
                      ₹{selectedOrder.orderValue?.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-4">
                <button
                  onClick={() => {
                    // Status update function call karein
                    handleUpdateStatus(selectedOrder._id, selectedOrder.status);
                    setSelectedOrder(null);
                  }}
                  className="w-full py-5 bg-white border-2 border-slate-200 rounded-[2rem] font-black text-slate-800 uppercase tracking-widest hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all active:scale-95 shadow-sm"
                >
                  Mark as Prepared
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Helpers ---
const OrderColumn = ({ title, count, icon, bg, children }) => (
  <div className="space-y-6">
    <div
      className={`flex items-center justify-between p-4 ${bg} rounded-2xl border border-white shadow-sm`}
    >
      <div className="flex items-center gap-3">
        {icon} <h2 className="font-black text-sm uppercase">{title}</h2>
      </div>
      <span className="bg-white px-3 py-1 rounded-full text-xs font-black">
        {count}
      </span>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const OrderCard = ({ order, color, onUpdate, onDetails }) => (
  <div
    className={`bg-white p-5 rounded-[1.5rem] border-l-8 ${color} shadow-sm hover:shadow-md transition-all`}
  >
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-black text-slate-800">{order.orderNumber}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase">
          {order.userId?.fullName || "Guest"}
        </p>
      </div>
    </div>
    <div className="text-sm font-bold text-slate-600 mb-4">
      {order.items.length} Items • ₹{order.orderValue?.total}
    </div>
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={onDetails}
        className="py-2.5 rounded-xl bg-slate-100 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200"
      >
        Details
      </button>
      <button
        onClick={onUpdate}
        className="py-2.5 rounded-xl bg-[#842A3B] text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
      >
        {order.status === "pending"
          ? "Accept"
          : order.status === "preparing"
            ? "Ready"
            : "Picked"}
      </button>
    </div>
  </div>
);

export default RestaurantOrder;
