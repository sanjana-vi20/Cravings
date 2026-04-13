import React from 'react';
import { X, Clock, Users, Utensils, IndianRupee, Leaf, Flame } from 'lucide-react';

const ViewItemModal = ({ onClose, selectedItem }) => {

   const image = selectedItem.image || [].slice(0, 5);
  return (
    <div className="fixed inset-0 z-250 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1a1a1a]/70 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header / Image Section */}
        <div className="p-6 space-y-6">
            {/* Image Gallery */}
            {image.length > 0 && (
              <div className="space-y-3">
                <label className="block  font-semibold text-gray-600">
                  Images
                </label>
                <div className="flex gap-4 flex-wrap">
                  {image.slice(0, 5).map((image, index) => (
                    <div
                      key={index}
                      className="w-30 h-30 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center"
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
            className="absolute top-6 right-6 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-all"
          >
            <X size={20} />
          </button>

          {/* Type Badge (Veg/Non-Veg) */}
          <div className="absolute top-50 left-6 flex items-center gap-2">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg ${
              selectedItem.type === 'veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${selectedItem.type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`} />
              {selectedItem.type}
            </span>
            {selectedItem.availability ? (
              <span className="bg-[#F5DAA7] text-[#842A3B] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                In Stock
              </span>
            ) : (
              <span className="bg-gray-200 text-gray-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[#A3485A]  font-bold uppercase  mb-1">{selectedItem.cuisine}</p>
              <h2 className="text-4xl font-bold text-[#1a1a1a] leading-tight">{selectedItem.dishName}</h2>
            </div>
            <div className="text-right px-6 py-3 bg-[#F5DAA7]/30 rounded-2xl border border-[#F5DAA7]">
              <p className="text-[#842A3B] text-xs font-bold uppercase">Price</p>
              <p className="text-2xl font-black text-[#842A3B] flex items-center gap-1">
                <IndianRupee size={20} /> {selectedItem.price}
              </p>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8 text-lg italic">
            "{selectedItem.description}"
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-[#842A3B]">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">Preparation</p>
                <p className="font-bold text-gray-700">{selectedItem.preparationTime} Mins</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-[#842A3B]">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">Serves</p>
                <p className="font-bold text-gray-700">{selectedItem.servingsize}</p>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-8 flex gap-3">
            <button 
              className="flex-1 border-2 border-[#842A3B] text-[#842A3B] py-4 rounded-2xl font-bold hover:bg-[#842A3B] hover:text-white transition-all active:scale-95"
              onClick={onClose}
            >
              Back to Menu
            </button>
            <button className="bg-[#842A3B] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-[#842A3B]/30 hover:bg-[#662222] transition-all active:scale-95">
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewItemModal;