import React from "react";
import { Camera, Maximize2 } from "lucide-react";

const DishPhotos = ({ data }) => {
  const restaurant = data[0];
  
  // Hum saari photos ko ek hi array mein ikatha (combine) kar rahe hain
  const allPhotos = [
    ...(restaurant?.restaurantImages || []),
    ...((restaurant?.myMenu || []).map(item => item.image[0]))
  ].filter(Boolean); // Taaki empty values nikal jayein

  return (
    <div className="animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Camera className="text-[#842A3B]" /> Visual Journey
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
            Capturing flavors and atmosphere
          </p>
        </div>
        <span className="bg-slate-100 px-4 py-2 rounded-full text-xs font-black text-slate-500">
          {allPhotos.length} Total Photos
        </span>
      </div>

      {/* Masonry Grid Layout */}
      <div className=" grid grid-cols-3 gap-4 space-y-4">
        {allPhotos.map((photo, index) => (
          <div 
            key={index} 
            className="relative w-[19rem] group overflow-hidden rounded-[2rem] border-4 border-white shadow-sm hover:shadow-xl transition-all duration-500 break-inside-avoid"
          >
            <img
              src={photo.url}
              alt={`Gallery ${index}`}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <Maximize2 size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DishPhotos;