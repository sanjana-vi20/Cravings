import React, { useEffect, useState } from "react";
import api from "../config/Api";
import {useNavigate} from 'react-router-dom'
import { ArrowRight, Clock, Filter, Heart, MapPin, Search, Star } from "lucide-react";
import { toast } from "react-hot-toast"; 

const OrderNow = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fetchAllRestaurant = async () => {
    setLoading(true);
    try {
      const res = await api.get("/public/allRestaurants");
      setRestaurants(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRestaurant();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#1a1a1a]">
      
      {/* 1. TOP SEARCH & LOCATION BAR */}
      <section className="bg-white pt-9 pb-12 shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-1 pb-6 mx-auto">
              <h1 className="text-5xl font-black tracking-tight leading-none text-gray-900">
                Order <span className="text-[#842A3B]  ">Now</span>
              </h1>
              {/* <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={14} className="text-[#842A3B]" />
                <span className="text-xs font-bold uppercase tracking-tight">Delivering to Arera Colony, Bhopal</span>
              </div> */}
            </div>

           
          </div>

          {/* Filters Row */}
         <div className="flex justify-between items-center">
           <div className="flex gap-3 mt-10 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Fast Food', 'Healthy', 'Indian', 'Continental', 'Deserts'].map((f) => (
              <button 
                key={f}
                onClick={() => {setActiveFilter(f)}}
                className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase transition-all whitespace-nowrap border ${
                  activeFilter === f 
                  ? 'bg-[#842A3B] text-white border-[#842A3B] shadow-lg' 
                  : 'bg-white text-gray-400 border-gray-100 hover:border-[#842A3B]/30'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

           <div className="relative w-full float-end md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search for restaurants..." 
                className="w-full bg-[#FAF7F2] border-none p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-[#842A3B]/20 transition-all font-medium text-sm"
              />
            </div>
         </div>
        </div>
      </section>

      {/* 2. RESTAURANTS GRID */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight flex items-center gap-3">
             <div className="w-8 h-1 bg-[#842A3B] rounded-full"></div>
             Top Restaurants in Bhopal
          </h2>

          {loading ? (
             <div className="text-center py-20 font-bold text-gray-400 uppercase tracking-widest animate-pulse">
               Finding the best flavors for you...
             </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 p-5">
              {restaurants.map((res) => (
                <div key={res._id}  onClick={ ()=>navigate(`/restaurant-details/${res._id}`)} className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50">
                  
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={res.restaurantImages?.[0]?.url || res.photo?.url} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={res.restaurantName} 
                    />
                    <div className="absolute top-5 right-5 z-10">
                      <button className="p-3 bg-white/90 backdrop-blur-md rounded-2xl text-[#842A3B] shadow-lg hover:bg-[#842A3B] hover:text-white transition-all">
                        <Heart size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-black text-gray-900 leading-none">{res.restaurantName}</h3>
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                        <Star size={12} className="text-green-600 fill-green-600" />
                        <span className="text-[11px] font-black text-green-600">4.5</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tight mb-4">
                      {res.cuisine === "N/A" ? "Gourmet Selection" : res.cuisine}
                    </p>

                    <div className="flex items-center gap-2 text-gray-400 mb-6">
                      <MapPin size={12} className="text-[#842A3B]" />
                      <span className="text-[10px] font-bold uppercase">{res.city}</span>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-gray-500 font-bold text-[11px]">
                          <Clock size={14} className="text-[#842A3B]" />
                          {res.restaurantTiming?.opening || "10:00 AM"} - {res.restaurantTiming?.closing || "10:00 PM"}
                        </div>
                      </div>
                      <p className="pl-31 text-(--color-primary) font-bold ">Explore Menu</p>
                      <button className="flex items-center justify-center w-10 h-10 bg-[#FAF7F2] text-[#842A3B] rounded-xl group-hover:bg-[#842A3B] group-hover:text-white transition-all">
                         <ArrowRight size={18}/> 
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default OrderNow;