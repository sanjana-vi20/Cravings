import React from "react";
import {
  X,
  Clock,
  Users,
  IndianRupee,
  Percent,
  ShieldCheck,
} from "lucide-react"; // Percent icon add kiya
import { useNavigate } from "react-router-dom";

const ViewItemModal = ({ onClose, selectedItem }) => {

  const navigate = useNavigate();
  const image = selectedItem.image || [].slice(0, 5);

  return (
    <div className="fixed inset-0 z-250 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1a1a1a]/70 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        {/* Header / Image Section */}
        <div className="p-6 space-y-6">
          {/* Image Gallery */}
          {image.length > 0 && (
            <div className="space-y-3">
              <label className="block font-semibold text-gray-600 px-2">
                Dish Gallery
              </label>
              <div className="flex gap-4 flex-wrap">
                {image.slice(0, 5).map((image, index) => (
                  <div
                    key={index}
                    className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 flex items-center justify-center shadow-sm"
                  >
                    <img
                      src={image.url}
                      alt={`${selectedItem.dishName} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full text-gray-800 transition-all z-10"
          >
            <X size={20} />
          </button>

          {/* Type Badge (Veg/Non-Veg) */}
          <div className="flex items-center gap-2 px-2">
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm ${
                selectedItem.type === "veg"
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-red-50 text-red-700 border border-red-100"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${selectedItem.type === "veg" ? "bg-green-600" : "bg-red-600"}`}
              />
              {selectedItem.type}
            </span>
            {selectedItem.availability ? (
              <span className="bg-orange-50 text-orange-700 border border-orange-100 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                In Stock
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-gray-200">
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 pt-0">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <p className="text-[#A3485A] font-bold uppercase text-xs tracking-widest mb-1">
                {selectedItem.cuisine}
              </p>
              <h2 className="text-4xl font-black text-[#1a1a1a] leading-tight tracking-tighter uppercase italic">
                {selectedItem.dishName}
              </h2>
            </div>

            {/* Price & Tax Section */}
            <div className="text-right px-6 py-4 bg-[#F5DAA7]/20 rounded-[2rem] border border-[#F5DAA7]/50 min-w-[140px]">
              <p className="text-[#842A3B] text-[10px] font-black uppercase tracking-widest mb-1">
                Total Price
              </p>
              <p className="text-3xl font-black text-[#842A3B] flex items-center justify-end gap-1">
                <IndianRupee size={22} strokeWidth={3} /> {selectedItem.price}
              </p>
              {/* GST Info under price */}
              <p className="text-[9px] font-bold text-[#842A3B]/60 uppercase mt-1">
                Incl. {selectedItem.gst || 0} GST Tax
              </p>
            </div>
          </div>

          <p className="text-gray-500 leading-relaxed mb-8 text-lg font-medium">
            "{selectedItem.description}"
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-3 gap-4">
            {" "}
            {/* Grid 3 column kiya tax box fit karne ke liye */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-[1.5rem] border border-gray-100">
              <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-[#842A3B]">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">
                  Prep Time
                </p>
                <p className="text-sm font-black text-gray-700">
                  {selectedItem.preparationTime}m
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-[1.5rem] border border-gray-100">
              <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-[#842A3B]">
                <Users size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">
                  Serves
                </p>
                <p className="text-sm font-black text-gray-700">
                  {selectedItem.servingsize}
                </p>
              </div>
            </div>
            {/* NEW: GST Info Box */}
            <div className="flex items-center gap-3 p-4 bg-green-50/50 rounded-[1.5rem] border border-green-100">
              <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-green-600">
                <Percent size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-green-700/50 tracking-tighter">
                  Tax (GST)
                </p>
                <p className="text-sm font-black text-green-700">
                  {selectedItem.gst || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-8 flex gap-4">
            <button
              className="flex-1 border-2 border-slate-200 text-slate-500 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all active:scale-95"
              onClick={onClose}
            >
              Close View
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewItemModal;
