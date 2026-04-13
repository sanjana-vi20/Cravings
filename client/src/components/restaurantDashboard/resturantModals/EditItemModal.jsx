import React, { useState } from 'react';
import { X, Camera, Save, Sparkles, Trash2, Plus } from 'lucide-react';
import api from '../../../config/Api'
import toast from 'react-hot-toast';

const EditItemModal = ({ onClose  , selectedItem}) => {
  // 5 images tak hold karne ke liye array state
  const [previews, setPreviews] = useState([]);

   const [formData, setFormData] = useState({
     dishName: selectedItem?.dishName || "",
    description: selectedItem?.description || "",
    price: selectedItem?.price || "",
    cuisine: selectedItem?.cuisine || "",
    type: selectedItem?.type || "",
    preparationTime: selectedItem?.preparationTime || "",
    servingsize: selectedItem?.servingsize || "",
    availability: selectedItem?.availability || "",
   })

  const [photo, setPhoto] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setloading] = useState(false);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    // console.log(e);
    setPreview(files);
    setPhoto(files);

    if (preview.length + files.length > 3) {
      toast.error("Only 3 photos are Allowed");
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    setloading(true);

    try {
      const form_data = new FormData();
      form_data.append("dishName", formData.dishName);
      form_data.append("availability", formData.availability);
      form_data.append("cuisine", formData.cuisine);
      form_data.append("type", formData.type);
      form_data.append("description", formData.description);
      form_data.append("price", formData.price);
      form_data.append("servingsize", formData.servingsize);
      form_data.append("preparationTime", formData.preparationTime);

      photo.forEach((img) => {
        form_data.append("image", img);
      });

      console.log(photo);
      
      const res = await api.put( `/restaurant/updateMenuItem/${selectedItem._id}` , form_data);
      toast.success(res.data.message);
      console.log(res.data.data);
      setTimeout(handleClose, 1500);
    } catch (error) {
      // console.log(error);
      toast.error(error.response?.data?.message);
    } finally {
      setloading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      dishName: "",
      description: "",
      price: "",
      cuisine: "",
      type: "",
      preparationTime: "",
      availability: true,
    });

    setPreview([]);
    setPhoto([]);

    setloading(false);

    onClose();
  };

  const handleOnchange = (e) => {
    e.preventDefault();
    const { name, value, checked  ,type} = e.target;

      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    
    
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (previews.length + files.length > 5) {
      alert("You can only add up to 5 images");
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const filtered = previews.filter((_, i) => i !== index);
    setPreviews(filtered);
  };

  return (
    <div className="fixed inset-0 z-250 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1a1a1a]/70 backdrop-blur-md" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh]">
        
        {/* Left Side: Multi-Image Gallery */}
        <div className="md:w-1/2 bg-[#842A3B] p-8 text-[#F5DAA7] flex flex-col">
          <div className="mb-6 flex gap-4 items-center">
            <div className="w-12 h-12 bg-[#F5DAA7] rounded-xl flex  items-center justify-center mb-4">
              <Sparkles className="text-[#842A3B]" size={24} />
            </div>
            <h2 className="text-3xl font-serif font-bold italic">Gallery Update</h2>
            <p className="text-white/60 text-xs mt-1 uppercase tracking-widest font-bold"></p>
          </div>

          {/* Main Display Image */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="relative w-[20rem] aspect-[4/3] bg-[#662222]/50 border-2 border-dashed border-[#F5DAA7]/20 rounded-[2rem] overflow-hidden group">
              {previews[0] ? (
                <img src={previews[0]} className="w-full h-full object-contain" alt="Main Preview" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#F5DAA7]/30">
                  <Camera size={48} />
                  <p className="text-[10px] mt-2 font-bold tracking-[0.2em]">Primary Image</p>
                </div>
              )}
            </div>

            {/* Thumbnail Grid (Remaining 4 slots) */}
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => {
                const imgIndex = i + 1;
                return (
                  <div key={i} className="relative aspect-square bg-[#662222]/30 border border-[#F5DAA7]/10 rounded-2xl overflow-hidden group">
                    {previews[imgIndex] ? (
                      <>
                        <img src={previews[imgIndex]} className="w-full h-full object-cover" alt={`Preview ${imgIndex}`} />
                        <button 
                          onClick={() => removeImage(imgIndex)}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} className="text-white" />
                        </button>
                      </>
                    ) : (
                      <label className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-[#662222] transition-colors">
                        <Plus size={20} className="text-[#F5DAA7]/20" />
                        <input type="file" className="hidden" onChange={(e)=>{handlePhotoUpload(e) ; handleImageChange(e)} }multiple accept='image/*'  disabled={previews.length >= 5} />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Global Upload Button */}
            {previews.length < 5 && (
              <label className="mt-4 w-full py-4 border-2 border-[#F5DAA7]/20 rounded-2xl flex items-center justify-center gap-3 cursor-pointer hover:bg-[#662222] transition-all">
                <Camera size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Add Images ({previews.length}/5)</span>
                <input type="file" multiple className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        {/* Right Side: Form details */}
        <div className="md:w-1/2 p-10 overflow-y-auto bg-white">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-[#A3485A] uppercase ">Dish Specifications</h3>
            <X size={24} className="text-gray-300 cursor-pointer" onClick={onClose} />
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
             <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Creation Title</label>
              <input type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-lg" placeholder="e.g. Truffle Pizza" name='dishName' value={formData.dishName} onChange={handleOnchange} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Menu Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#842A3B]">₹</span>
                  <input type="number" className="w-full pl-8 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-black text-[#842A3B]" name='price' value={formData.price} onChange={handleOnchange}/>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Prep Time</label>
                <input type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" placeholder="15-20 Mins" name='preparationTime' value={formData.preparationTime} onChange={handleOnchange} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Chef's Note (Description)</label>
              <textarea rows="4" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none italic text-gray-600 text-sm"name='description' value={formData.description} onChange={handleOnchange}></textarea>
            </div>

           <div className='flex gap-6 items-center'>
             <div className='flex flex-col'>
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Serving Size</label>
             <input type="text" className="px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none" placeholder="15-20 Mins" name='servingsize' value={formData.servingsize} onChange={handleOnchange} />
            </div>
            <div>
              <input type="checkbox" name='availability' checked={formData.availability} value={formData.availability} onChange={handleOnchange}/> Availability
            </div>
           </div>

            <div className="flex gap-4 pt-6">
               <button type="button" onClick={onClose} className="flex-1 py-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Cancel</button>
               <button type="submit" className="flex-[2] bg-[#842A3B] text-[#F5DAA7] py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#662222] transition-all">Update Masterpiece</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;