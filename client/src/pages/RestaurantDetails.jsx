import React, { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  Star,
  Heart,
  Share2,
  Camera,
  Navigation,
  Phone,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../config/Api";
import toast from "react-hot-toast";
import ResOverview from "../components/userDashboard/restaurantDetails/ResOverview";
import OrderOnline from "../components/userDashboard/restaurantDetails/OrderOnline";
import RestaurantReview from "../components/userDashboard/restaurantDetails/RestaurantReview";
import DishPhotos from "../components/userDashboard/restaurantDetails/DishPhotos";
import MenuDetails from "../components/userDashboard/restaurantDetails/MenuDetails";

const RestaurantDetails = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchMenu = async () => {
    setLoading(true);
    try {
      console.log(id);

      const res = await api.get(`/public/single-menu/${id}`);
      setItems(res.data.data);
      console.log(res.data.data);

      // toast.success(res.data.message);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to load restaurants",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (items.length === 0) return <p>No restaurant data found.</p>;

  console.log("items", items);

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a] px-40">
      {/* HEADER & INFO (Inspired by image_000801.jpg) */}
      <section className="pt-10 pb-8 container mx-auto px-6">
        <nav className="flex gap-2 text-[13px] font-bold text-gray-400 uppercase tracking-tight mb-6 cursor-pointer">
          <span onClick={() => navigate("/")}>Home</span>{" "}
          <span>{items[0].city}</span> /{" "}
          <span className="text-[#842A3B]">{items[0].restaurantName}</span>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter leading-none text-gray-900">
              {items[0].restaurantName}
            </h1>
            <div className="text-sm flex gap-2 px-3 font-medium text-gray-500">
                <p>{items[0].cuisine}</p>
              
            </div>
            <div className="flex items-center gap-4 pt-2">
              <span className="bg-[#842A3B]/10 text-[#842A3B] px-3 py-1 rounded-lg text-[15px] font-black uppercase">
                Open Now
              </span>
              <span className="text-[15px] font-bold text-gray-400">
                {items[0].restaurantTiming.opening} AM –{" "}
                {items[0].restaurantTiming.closing} PM
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-3 bg-green-600 text-white p-3 rounded-xl shadow-lg shadow-green-600/20">
              <span className="text-2xl font-black">4.9</span>
              <div className="leading-none uppercase font-black text-[8px]">
                Dining <br /> Ratings
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-8">
          <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-100 rounded-2xl font-black text-[10px] uppercase hover:border-[#842A3B] transition-all">
            <Navigation size={14} /> Direction
          </button>
          <button className="flex items-center gap-2 px-6 py-3 border-2 border-[#842A3B] text-[#842A3B] rounded-2xl font-black text-[10px] uppercase hover:bg-[#842A3B] hover:text-white transition-all shadow-lg">
            Book a Table
          </button>
        </div>
      </section>

      {/* GALLERY (Ditto image_000801.jpg) */}
      <section className="container mx-auto px-6 mb-12 relative">
        <div className="grid grid-cols-12 gap-2 h-[450px]">
          {/* 1. Main Large Image */}
          <div className="col-span-6 overflow-hidden rounded-l-[3rem] h-[70vh] group relative">
            <img
              src={items[0].restaurantImages[0].url}
              className="w-full object-cover transition-transform h-full absolute duration-700 ease-in-out group-hover:scale-110"
              alt="Main"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>
          </div>

          {/* 2. Middle Column (Two Images) */}
          <div className="col-span-3 grid grid-rows-2 gap-2">
            <div className="overflow-hidden group relative">
              <img
                src={items[0].restaurantImages[1].url}
                className="w-full h-full object-cover transition-transform absolute duration-700 group-hover:scale-110"
                alt="Chef"
              />
            </div>
            <div className="overflow-hidden group relative">
              <img
                src={items[0].restaurantImages[2].url}
                className="w-full h-full object-cover absolute transition-transform duration-700 group-hover:scale-110"
                alt="Interior"
              />
            </div>
          </div>

          {/* 3. Right Image with View Gallery Overlay */}
          <div className="col-span-3 relative overflow-hidden rounded-r-[3rem] group">
            <img
              src={items[0].restaurantImages[0].url}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Food"
            />
            {/* Animated Overlay */}
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center font-black text-white text-[10px] uppercase tracking-widest cursor-pointer opacity-90 group-hover:bg-black/40 transition-all duration-500">
              <div className="transform group-hover:scale-125 transition-transform duration-500 mb-2">
                <Camera size={24} className="text-[#F5DAA7]" onClick={()=>setActiveTab("Photos")} />
              </div>
              <span className="group-hover:tracking-[0.2em] transition-all duration-500">
                View Gallery
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* TABS & CONTENT */}
      <section className="border-b border-gray-100 sticky top-0 bg-white z-50">
        <div className="container mx-auto px-6 flex gap-10">
          {["Overview", "Order Online", "Reviews", "Photos", "Menu"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 font-black uppercase tracking-tight transition-all relative ${
                  activeTab === tab
                    ? "text-[#842A3B]"
                    : "text-gray-400 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>

        <div className="p-4">
          {activeTab === "Overview" ? (
                  <ResOverview data={items} />
                ) : activeTab === "Order Online" ? (
                  <OrderOnline data={items} />
                ) : activeTab === "Reviews" ? (
                  <RestaurantReview data={items}/>
                ) : (
                  activeTab === "Photos" ? <DishPhotos data={items}/> : activeTab === "Menu" ? <MenuDetails data={items}/> : <ResOverview/>
                )}
        </div>
      </section>

      {/* ABOUT (Inspired by image_412819.jpg styling) */}
     
    </div>
  );
};

export default RestaurantDetails;
