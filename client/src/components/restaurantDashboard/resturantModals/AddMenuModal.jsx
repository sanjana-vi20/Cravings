import React, { useState } from "react";
import {
  X, Plus, Trash2, Utensils, IndianRupee, Camera, Users,
  Leaf, Drumstick, Globe, Sparkles, Clock, FileText, CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../config/Api";

const AddMenuModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    dishName: "",
    cuisine: "",
    description: "",
    price: "",
    servingsize: "",
    availability: true,
    preparationTime: "",
    type: "veg",
  });

  const [photo, setPhoto] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (photo.length + files.length > 3) {
      toast.error("Maximum 3 photos allowed");
      return;
    }
    setPhoto([...photo, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreview([...preview, ...newPreviews]);
  };

  const removePhoto = (index) => {
    const updatedPhotos = photo.filter((_, i) => i !== index);
    const updatedPreviews = preview.filter((_, i) => i !== index);
    setPhoto(updatedPhotos);
    setPreview(updatedPreviews);
  };

  const handleOnchange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form_data = new FormData();
      Object.keys(formData).forEach(key => form_data.append(key, formData[key]));
      photo.forEach((img) => form_data.append("image", img));

      const res = await api.post("/restaurant/addMenu", form_data);
      toast.success(res.data.message || "Dish Added Successfully!");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* --- Header --- */}
        <div className="bg-[#842A3B] px-8 py-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Sparkles className="text-[#F5DAA7]" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Add New Dish</h2>
              <p className="text-[#F5DAA7] text-[10px] uppercase tracking-widest font-medium">Kitchen Management</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* --- Photo Section --- */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 font-bold text-slate-700">
                <Camera size={18} /> Gallery Selection (Max 3)
              </label>
              <div className="grid grid-cols-4 gap-4">
                {preview.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-slate-100">
                    <img src={url} alt="preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removePhoto(index)}
                      className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={20} className="text-white" />
                    </button>
                  </div>
                ))}
                {preview.length < 3 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#842A3B] hover:bg-red-50/50 transition-all">
                    <Plus size={24} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Add Media</span>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
            </div>

            {/* --- Main Info --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Utensils size={16}/> Dish Name</label>
                <input 
                  name="dishName"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#842A3B] focus:ring-1 focus:ring-[#842A3B] outline-none transition-all"
                  placeholder="e.g. Butter Chicken"
                  value={formData.dishName}
                  onChange={handleOnchange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><IndianRupee size={16}/> Price (INR)</label>
                <input 
                  name="price"
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#842A3B] focus:ring-1 focus:ring-[#842A3B] outline-none transition-all"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleOnchange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Food Type</label>
                <div className="flex p-1.5 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'veg'})}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all ${formData.type === 'veg' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    <Leaf size={14} /> VEG
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'non-veg'})}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all ${formData.type === 'non-veg' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    <Drumstick size={14} /> NON-VEG
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Globe size={16}/> Cuisine</label>
                <input 
                  name="cuisine"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#842A3B] focus:ring-1 focus:ring-[#842A3B] outline-none transition-all"
                  placeholder="e.g. Italian, North Indian"
                  value={formData.cuisine}
                  onChange={handleOnchange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Users size={16}/> Serves</label>
                <input 
                  name="servingsize"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#842A3B] focus:ring-1 focus:ring-[#842A3B] outline-none transition-all"
                  placeholder="e.g. 2 Persons"
                  value={formData.servingsize}
                  onChange={handleOnchange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Clock size={16}/> Prep Time (Mins)</label>
                <input 
                  name="preparationTime"
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#842A3B] focus:ring-1 focus:ring-[#842A3B] outline-none transition-all"
                  placeholder="e.g. 20"
                  value={formData.preparationTime}
                  onChange={handleOnchange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><FileText size={16}/> Description</label>
              <textarea 
                name="description"
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#842A3B] focus:ring-1 focus:ring-[#842A3B] outline-none transition-all resize-none"
                placeholder="Describe your delicious dish..."
                value={formData.description}
                onChange={handleOnchange}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <CheckCircle2 className={formData.availability ? "text-green-500" : "text-slate-300"} />
                <div>
                  <p className="text-sm font-bold text-slate-700">Currently Available</p>
                  <p className="text-xs text-slate-500">Enable to show this on the live menu</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                name="availability"
                checked={formData.availability}
                onChange={handleOnchange}
                className="w-6 h-6 accent-[#842A3B] cursor-pointer"
              />
            </div>

            {/* --- Footer Buttons --- */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-[#842A3B] text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-900/20 hover:bg-[#6d2230] transition-all disabled:opacity-50"
              >
                {loading ? "Adding to Kitchen..." : "Finalize Entry"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMenuModal;