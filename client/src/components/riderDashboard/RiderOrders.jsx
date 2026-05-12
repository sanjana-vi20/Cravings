import React, { useEffect, useState } from "react";
import {
  Phone,
  MapPin,
  Navigation,
  PackageCheck,
  CheckCircle,
} from "lucide-react";
import io from "socket.io-client";
import toast from "react-hot-toast";
import api from "../../config/Api";

const socket = io("http://localhost:5000");

const RiderOrders = () => {
  const [loading, setLoading] = useState(false);
  const [riderLocation, setRiderLocation] = useState(null);
  const [riderOrders, setRiderOrders] = useState([
    {
      _id: "ORD-9901",
      restaurant: {
        name: "Jharokha Restaurant",
        lat: 23.2599,
        lng: 77.4126,
        address: "Hamidia Road, Bhopal",
      },
      customer: {
        name: "Arjun Sharma",
        lat: 23.2333,
        lng: 77.4333,
        address: "Arera Colony, Bhopal",
        phone: "+91 9876543210",
      },
      items: ["Paneer Butter Masala", "Butter Naan"],
      amount: "₹540",
      status: "ready", // ready -> onTheWay -> delivered
    },
  ]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/rider/get-orders");
      console.log(res.data.data);
      setRiderOrders(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Pehle Rider ki Location Fetch karna
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setRiderLocation({ lat: latitude, lng: longitude });

        // Server ko location bhejna
        socket.emit("riderLocationUpdate", {
          orderId: "ORD-9901",
          lat: latitude,
          lng: longitude,
        });
      },
      (err) => toast.error("Please enable GPS"),
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  console.log(riderLocation);

  // Google Maps par rasta dikhane ka function
  const openGoogleMaps = (destLat, destLng) => {
    if (!riderLocation) {
      toast.error("Waiting for your GPS location...");
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&origin=${riderLocation.lat},${riderLocation.lng}&destination=${destLat},${destLng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const handleStatusChange = (id, currentStatus) => {
    let nextStatus = currentStatus === "ready" ? "onTheWay" : "delivered";
    setRiderOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status: nextStatus } : o)),
    );
    socket.emit("statusUpdate", { orderId: id, status: nextStatus });
    toast.success(
      nextStatus === "onTheWay"
        ? "Order Picked Up! Go to Customer 🚀"
        : "Order Delivered ✅",
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-5 font-sans">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-black italic text-slate-800">
          CRAVINGS RIDER
        </h1>
        <div
          className={`h-3 w-3 rounded-full ${riderLocation ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
        ></div>
      </div>

      {riderOrders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-lg mx-auto"
        >
          {/* Top Info */}
          <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">
                Order ID
              </p>
              <h2 className="text-xl font-black">{order._id}</h2>
            </div>
            <span
              className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${order.status === "ready" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"}`}
            >
              {order.status}
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Conditional Logic: Pehle Pickup Options dikhao */}
            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-600 border-l-4 border-[#842A3B] pl-2">
                Navigation Options
              </p>

              <div className="grid grid-cols-1 gap-3">
                {/* Option 1: Restaurant Directions */}
                <button
                  onClick={() =>
                    openGoogleMaps(order.restaurant.lat, order.restaurant.lng)
                  }
                  className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-blue-500 transition shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                      <Navigation size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-slate-400">
                        PICKUP FROM
                      </p>
                      <p className="font-bold text-sm">
                        {order.restaurant.name}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600 italic">
                    Get Route
                  </span>
                </button>

                {/* Option 2: Customer Directions (Only if Picked Up) */}
                <button
                  disabled={order.status === "ready"}
                  onClick={() =>
                    openGoogleMaps(order.customer.lat, order.customer.lng)
                  }
                  className={`flex items-center justify-between p-4 border-2 rounded-2xl transition shadow-sm ${order.status === "ready" ? "bg-slate-50 opacity-50 border-transparent" : "bg-white border-slate-100 hover:border-green-500"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                      <MapPin size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-slate-400">
                        DELIVER TO
                      </p>
                      <p className="font-bold text-sm">{order.customer.name}</p>
                    </div>
                  </div>
                  {order.status === "ready" ? (
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Locked
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-green-600 italic">
                      Get Route
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <button
                onClick={() => window.open(`tel:${order.customer.phone}`)}
                className="bg-slate-100 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-slate-700 hover:bg-slate-200"
              >
                <Phone size={18} /> Call
              </button>

              {order.status !== "delivered" && (
                <button
                  onClick={() => handleStatusChange(order._id, order.status)}
                  className={`py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white transition-all transform active:scale-95 ${order.status === "ready" ? "bg-[#842A3B]" : "bg-green-600"}`}
                >
                  {order.status === "ready" ? (
                    <>
                      <PackageCheck size={18} /> Confirm Pickup
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} /> Mark Delivered
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RiderOrders;
