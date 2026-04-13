import React from "react";
import { Clock, MapPin, Phone, CreditCard, UtensilsCrossed, Info } from "lucide-react";

const ResOverview = ({ data }) => {
  // Since your data is items[0]
  const restaurant = data[0];

  if (!restaurant) return null;

  return (
    <div className="grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Left Column: Details & Popular Items */}
      <div className="col-span-12 md:col-span-8 space-y-10">
        
        {/* About Section */}
        <section>
          <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">
             About {restaurant.restaurantName}
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Experience the finest {restaurant.myMenu[0]?.cuisine || "Global"} cuisine in the heart of {restaurant.city}. 
            Known for our signature {restaurant.myMenu[0]?.dishName || "dishes"}, we bring authentic flavors 
            directly to your table at {restaurant.address}.
          </p>
        </section>

        {/* Popular Dishes (from your myMenu array) */}
        <section>
          <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <UtensilsCrossed className="text-[#842A3B]" /> Must Try Dishes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restaurant.myMenu?.slice(0, 4).map((dish) => (
              <div key={dish._id} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all">
                <img 
                  src={dish.image[0]?.url || "https://via.placeholder.com/100"} 
                  className="w-20 h-20 rounded-2xl object-cover" 
                  alt={dish.dishName} 
                />
                <div>
                  <h4 className="font-bold text-slate-800">{dish.dishName}</h4>
                  <p className="text-xs text-gray-500 uppercase font-black tracking-widest">{dish.type}</p>
                  <p className="text-[#842A3B] font-bold">₹{dish.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Column: Info Cards */}
      <div className="col-span-12 md:col-span-4 space-y-6">
        
        {/* Contact Info Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
          <h3 className="font-black text-lg text-slate-800 uppercase tracking-tighter">Restaurant Info</h3>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><Clock size={20}/></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Timings</p>
              <p className="font-bold text-slate-700">
                {restaurant.restaurantTiming.opening} AM - {restaurant.restaurantTiming.closing} PM
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><MapPin size={20}/></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</p>
              <p className="font-bold text-slate-700">{restaurant.address}</p>
              <p className="text-sm text-gray-500">{restaurant.city}, {restaurant.pin}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Phone size={20}/></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact</p>
              <p className="font-bold text-slate-700">+91 {restaurant.mobnumber}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><CreditCard size={20}/></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Payment</p>
              <p className="font-bold text-slate-700">UPI: {restaurant.paymentDetails.upi}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResOverview;