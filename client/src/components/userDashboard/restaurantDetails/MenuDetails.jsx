import React, { useState } from "react";
import { Utensils, Star, Clock, Flame, Leaf, Info, Plus } from "lucide-react";
import toast from "react-hot-toast";
// import { useAuth } from "../../../context/AuthContext";

const MenuDetails = ({ data }) => {
  const restaurant = data[0];
  const menuItems = restaurant?.myMenu || [];
 

  const [cart , setCart] = useState(JSON.parse(localStorage.getItem("cart")) || [])
  console.log("menuItems :" , menuItems);
  

  if (menuItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Utensils size={48} className="mb-4 opacity-20" />
        <p className="font-black uppercase tracking-widest">No dishes added yet</p>
      </div>
    );
  }
      const handleAddToCart = ( restaurantName, dish) => {
  // 1. Pehle pura cart object uthao (Local Storage se)
  // Structure: { "restId1": {details}, "restId2": {details} }

  // console.log("item : ",  user );
  
  console.log("cart :"  , cart);

  console.log(restaurant.restaurantName);

  let currentCart = { ...cart };
  
  
  const restId = dish.restaurantID;

  // 2. Check karo: Kya is restaurant ka cart pehle se bana hai?
  if (!currentCart[restId]) {
    // Agar nahi, toh naya entry create karo
    currentCart[restId] = {
      restaurantName: restaurantName,
      restaurantId: restId,
      items: [],
      totalPrice: 0
    };
  }

  // 3. Check karo: Kya yeh ITEM pehle se is restaurant ke cart mein hai?
  const itemIndex = currentCart[restId].items.findIndex((i) => i._id === dish._id);

  if (itemIndex > -1) {
    // Agar hai, toh sirf quantity badhao
    currentCart[restId].items[itemIndex].quantity += 1;
  } else {
    // Agar nahi hai, toh naya item object push karo
    currentCart[restId].items.push({
      _id: dish._id,
      price: Number(dish.price),
      quantity: 1
    });
  }

  // 4. Uss specific restaurant ka Total Price calculate karo
  currentCart[restId].totalPrice = currentCart[restId].items.reduce(
    (acc, curr) => acc + curr.price * curr.quantity, 
    0
  );

  // 5. Final Step: LocalStorage update karo aur Event dispatch karo
  setCart(currentCart)
  localStorage.setItem("cart", JSON.stringify(cart));
  
  // Yeh line Header ko batayegi ki "Update ho jao!"
  window.dispatchEvent(new Event("cartUpdated"));

  toast.success(`Added to ${restaurant.restaurantName}'s cart!`);
};

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-slate-800 tracking-tighter">
            Signature <span className="text-[#842A3B]">Menu</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.4em]">
            Handcrafted with love in {restaurant.city}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
             <span className="text-xs font-black text-slate-600 uppercase">Pure Veg</span>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <span className="text-xs font-black text-slate-600 uppercase">Non-Veg</span>
          </div>
        </div>
      </div>

      {/* --- Visual Menu Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {menuItems.map((dish) => (
          <div 
            key={dish._id} 
            className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            {/* Image Wrapper */}
            <div className="relative h-64 overflow-hidden">
              <img 
                src={dish.image[0]?.url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={dish.dishName} 
              />
              
              {/* Floating Badges */}
              <div className="absolute top-5 left-5">
                <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl backdrop-blur-md bg-white/90 ${dish.type === 'veg' ? 'text-green-600' : 'text-red-600'}`}>
                  {dish.type === 'veg' ? <Leaf size={14}/> : <Flame size={14}/>}
                  {dish.type}
                </span>
              </div>

              <div className="absolute bottom-5 right-5 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-sm font-black flex items-center gap-2">
                ₹{dish.price}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-[#842A3B] uppercase tracking-[0.2em] mb-1">
                    {dish.cuisine} Specialized
                  </p>
                  <h3 className="text-2xl font-black text-slate-800 group-hover:text-[#842A3B] transition-colors">
                    {dish.dishName}
                  </h3>
                </div>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 italic">
                {dish.description}
              </p>

              {/* Bottom Specs */}
              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock size={16} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{dish.preparationTime} Mins</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Utensils size={16} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Serves {dish.servingsize}</span>
                  </div>
                </div>
                
               <button className="h-12 w-12 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-[#842A3B] hover:bg-[#842A3B] hover:text-white hover:border-[#842A3B] transition-all shadow-sm active:scale-90">
                  <Plus size={24} strokeWidth={3} onClick={()=>handleAddToCart(restaurant.restaurantName , dish)}/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Aesthetic Footer --- */}
      <div className="mt-20 text-center space-y-2 opacity-30">
        <div className="flex justify-center gap-4 mb-4">
          <div className="w-2 h-2 rounded-full bg-slate-400"></div>
          <div className="w-2 h-2 rounded-full bg-slate-400"></div>
          <div className="w-2 h-2 rounded-full bg-slate-400"></div>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.5em] text-slate-600">The End of Menu</p>
      </div>
    </div>
  );
};

export default MenuDetails;