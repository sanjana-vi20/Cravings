import React from 'react';
import { X, Leaf, Flame, ShoppingBag } from 'lucide-react';

const ItemDetailModal = ({ item, onClose, onAdd }) => {
  if (!item) return null;
  console.log(item);
  

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* 1. Backdrop Blur Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      {/* 2. Modal Card */}
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-[#842A3B] hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        {/* Dish Image */}
        <div className="h-72 w-full relative">
          <img 
            src={item?.image[0]?.url} 
            // alt={item.dishName}
            className="w-full h-full object-cover"
          />
          {/* Badge */}
          <div className="absolute bottom-4 left-6">
             <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl bg-white/90 ${item.type === 'veg' ? 'text-green-600' : 'text-red-600'}`}>
                {item.type === 'veg' ? <Leaf size={14}/> : <Flame size={14}/>}
                {item.type}
             </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">
              {item.dishName}
            </h2>
            <p className="text-sm font-bold text-[#842A3B] uppercase tracking-[0.2em]">
               {item?.restaurantID?.restaurantName || "Cravings Special"}
            </p>
          </div>

          <p className="text-slate-500 leading-relaxed italic text-sm">
            "{item.description}"
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase">Price</p>
              <p className="text-3xl font-black text-slate-800">₹{item.price}</p>
            </div>

            <button 
              onClick={() => {
                onAdd(item);
                onClose();
              }}
              className="px-10 py-4 bg-[#842A3B] text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#842A3B]/30"
            >
              Add To Cart <ShoppingBag size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;