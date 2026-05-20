import React, { useEffect, useState } from "react";
import {
  Phone,
  MapPin,
  Navigation,
  PackageCheck,
  CheckCircle,
  ShoppingBag,
  IndianRupee,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../config/Api";

import { io } from "socket.io-client"; // Socket import karein agar upar nahi hai
import { socket } from "../../config/Websocket";
// const socket = io("YOUR_BACKEND_URL"); // Apne backend URL ke saath

const RiderOrders = () => {
  const [loading, setLoading] = useState(false);
  const [riderLocation, setRiderLocation] = useState(null);
  const [riderOrders, setRiderOrders] = useState([]);

  // --- 1. Socket Listener (Manager ke updates sunne ke liye) ---
  useEffect(() => {
    socket.connect();

    socket.on("rider_dashboard_update", (data) => {
      // Jab manager status 'READY' karega, toh yahan refresh logic chalega
      // toast("New Order Status Update! 🔔", {
      //   duration: 4000,
      //   position: "top-right", 
      // });
      setRiderOrders((prev) => {
        const exists = prev.find((o) => o._id === data.orderId);
        if (exists) {
          // Purane order ka status update karo
          return prev.map((o) =>
            o._id === data.orderId ? { ...o, status: data.status } : o,
          );
        } else {
          // Agar naya order hai jo ab list mein aana chahiye (e.g. Ready ho gaya)
          // Toh pura data list mein add kar do
          return [data.updatedOrder, ...prev];
        }
      });
    });

    return () => socket.off("rider_dashboard_update");
  }, []);

  // --- 2. GPS Tracking (Same as your code) ---
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setRiderLocation({ lat: latitude, lng: longitude });
      },
      (err) => toast.error("Please enable GPS to see orders"),
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const fetchOrders = async () => {
    if (!riderLocation) return;
    setLoading(true);
    try {
      const res = await api.get( import.meta.env.VITE_RIDER_GET_ORDERS, {
        params: { lat: riderLocation.lat, lng: riderLocation.lng },
      });
      setRiderOrders(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (riderLocation) fetchOrders();
  }, [riderLocation]);

  // --- 3. Handle Status Change (Backend API call ke saath) ---
  const handleStatusChange = async (id, currentStatus) => {
  let nextStatus = "";
  let successMessage = "";

  // Logic to determine sequence
  if (currentStatus === "READY" || currentStatus === "ready") {
    nextStatus = "pickedUp";
    successMessage = "Order Picked Up! 📦";
  } else if (currentStatus === "pickedUp") {
    nextStatus = "onTheWay";
    successMessage = "You are on the way! 🚀";
  } else if (currentStatus === "onTheWay") {
    nextStatus = "delivered";
    successMessage = "Order Delivered! ✅";
  } else {
    return; // Already delivered or unknown status
  }

  try {
    const res = await api.put(`${import.meta.env.VITE_RIDER_UPDATE_ORDER_STATUS}/${id}`,
  {
      status: nextStatus,
    });

    if (res.status === 200) {
      setRiderOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: nextStatus } : o))
      );
      toast.success(successMessage);
    }
  } catch (error) {
    toast.error("Status update failed");
    console.error(error);
  }
};

console.log(riderOrders);

  const openGoogleMaps = (destLat, destLng) => {
    if (!riderLocation) return toast.error("GPS missing");
    const url = `https://www.google.com/maps/dir/?api=1&origin=${riderLocation.lat},${riderLocation.lng}&destination=${destLat},${destLng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  // ... (Baqi ka Google Maps function aur return logic same rahega)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-slate-500 animate-pulse uppercase tracking-widest text-xs">
            Finding Orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      {/* Header Section */}
      <div className="max-w-[1400px] mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black italic text-slate-800 uppercase tracking-tighter">
            Cravings Rider
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Available Delivery Jobs
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
          <div
            className={`h-2.5 w-2.5 rounded-full ${riderLocation ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
          ></div>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            {riderLocation ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* Grid Container: Is line ne hi row layout banaya hai */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {riderOrders.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-300 font-bold">
            No orders found nearby.
          </div>
        ) : (
          riderOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-[2rem] shadow-xl border border-slate-50 overflow-hidden flex flex-col hover:translate-y-[-5px] transition-transform duration-300"
            >
              {/* Card Header */}
              <div className="p-6 bg-slate-50/50 border-b flex justify-between items-center">
                <div className="overflow-hidden">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Order ID
                  </p>
                  <h2 className="text-xs font-bold text-slate-700 truncate">
                    #{order._id.slice(-8).toUpperCase()}
                  </h2>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${order.status === "ready" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Order Info Summary */}
              <div className="px-6 py-4 flex gap-4 border-b border-slate-50">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <IndianRupee size={14} className="text-slate-400" />
                  <span className="text-xs font-black">
                    {order.orderValue?.total || "0"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <ShoppingBag size={14} className="text-slate-400" />
                  <span className="text-xs font-black">
                    {order.items?.length || 1} Item
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1">
                {/* Pickup Row */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-xl text-blue-600 shadow-sm">
                      <Navigation size={18} />
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="text-[9px] font-black text-slate-400 uppercase">
                        Pickup From
                      </p>
                      <h4 className="font-bold text-xs truncate w-32">
                        {order.restaurantId?.restaurantName || "Restaurant"}
                      </h4>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      openGoogleMaps(
                        order.restaurantId?.geoLocation?.lat,
                        order.restaurantId?.geoLocation?.lon,
                      )
                    }
                    className="text-[10px] font-black text-blue-600 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 hover:bg-blue-50 transition-colors"
                  >
                    Route
                  </button>
                </div>

                {/* Delivery Row */}
                <div
                  className={`flex items-center justify-between p-4 rounded-2xl border ${order.status === "ready" ? "bg-white opacity-60 border-slate-100" : "bg-green-50 border-green-100"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl shadow-sm ${order.status === "ready" ? "bg-slate-50 text-slate-300" : "bg-white text-green-600"}`}
                    >
                      <MapPin size={18} />
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="text-[9px] font-black text-slate-400 uppercase">
                        Deliver To
                      </p>
                      <h4 className="font-bold text-xs truncate w-32">
                        {order.userId?.fullName || "Customer"}
                      </h4>
                    </div>
                  </div>
                  {order.status !== "ready" && (
                    <button
                      onClick={() =>
                        openGoogleMaps(
                          order.userId?.geoLocation?.lat,
                          order.userId?.geoLocation?.lon,
                        )
                      }
                      className="text-[10px] font-black text-green-600 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100"
                    >
                      Route
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-6 pt-0 mt-auto grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    window.open(
                      `tel:${order.userId?.mobnumber || order.customer?.phone}`,
                    )
                  }
                  className="bg-slate-100 py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] text-slate-600 uppercase tracking-widest hover:bg-slate-200 transition-colors"
                >
                  <Phone size={14} /> Call
                </button>
                <button
                  onClick={() => handleStatusChange(order._id, order.status)}
                  className={`py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] text-white uppercase tracking-widest shadow-lg transition-all active:scale-95 ${order.status === "ready" ? "bg-[#842A3B] shadow-red-100" :order.status === "pickedUp" ? "bg-[#ba3713] shadow-red-100": "bg-green-600 shadow-green-100"}`}
                >
                  {order.status === "ready" ? "PickUp" :order.status === "pickedUp" ? "onTheWay": "delieverd"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RiderOrders;
