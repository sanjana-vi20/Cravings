import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../config/Api";
import {
  Camera,
  X,
  Loader2,
  MapPin,
  CreditCard,
  Utensils,
  Trash2,
  Plus,
  Image as ImageIcon,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

const EditResturantProfile = ({ onClose }) => {
  const { user, setUser, setIsLogin } = useAuth();

  // Helper to treat "N/A" as empty string
  const cleanValue = (val) => (val === "N/A" ? "" : val || "");

  const [previews, setPreviews] = useState(user?.gallery || []);
  const [photo, setPhoto] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [formData, setFormData] = useState({
    fullName: cleanValue(user?.fullName),
    cuisine: cleanValue(user?.cuisine),
    restaurantName: cleanValue(user?.restaurantName),
    email: user?.email || "",
    mobnumber: cleanValue(user?.mobnumber),
    address: cleanValue(user?.address),
    city: cleanValue(user?.city),
    pin: cleanValue(user?.pin),
    documents: {
      uidai: cleanValue(user?.documents?.uidai),
      pan: cleanValue(user?.documents?.pan),
    },
    paymentDetails: {
      upi: cleanValue(user?.paymentDetails?.upi),
      account_number: cleanValue(user?.paymentDetails?.account_number),
      ifs_Code: cleanValue(user?.paymentDetails?.ifs_Code),
    },
    geoLocation: {
      lat: user?.geoLocation?.lat || "",
      lon: user?.geoLocation?.lon || "",
    },
    restaurantTiming: {
      opening: cleanValue(user?.restaurantTiming?.opening),
      closing: cleanValue(user?.restaurantTiming?.closing),
    }
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (previews.length + files.length > 5) {
      toast.error("Max 5 photos allowed");
      return;
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
    setSelectedFiles([...selectedFiles, ...files]);
    setPhoto([...photo, ...files]);
  };

  const removeImage = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setPhoto(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const fetchLocation = (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(
      (result) => {
        setFormData(prev => ({
          ...prev,
          geoLocation: { lat: result.coords.latitude, lon: result.coords.longitude },
        }));
        setErrors(prev => ({ ...prev, location: "" }));
        toast.success("Location Captured!");
      },
      () => toast.error("Enable location permissions")
    );
  };

  const validateForm = () => {
    const newErrors = {};
    const isEmpty = (val) => !val || val.toString().trim() === "" || val === "N/A";

    // Basic Info
    if (isEmpty(formData.restaurantName)) newErrors.restaurantName = "Required";
    if (isEmpty(formData.fullName)) newErrors.fullName = "Owner name required";
    if (isEmpty(formData.cuisine)) newErrors.cuisine = "Cuisine required";
    if (isEmpty(formData.mobnumber)) newErrors.mobnumber = "Mobile required";
    
    // Address & Timing
    if (isEmpty(formData.address)) newErrors.address = "Address required";
    if (isEmpty(formData.city)) newErrors.city = "City required";
    if (!/^\d{6}$/.test(formData.pin)) newErrors.pin = "Invalid 6-digit PIN";
    if (isEmpty(formData.restaurantTiming.opening)) newErrors.opening = "Required";
    if (isEmpty(formData.restaurantTiming.closing)) newErrors.closing = "Required";
    
    // Location
    if (!formData.geoLocation.lat) newErrors.location = "Fetch GPS first";

    // Payment
    if (isEmpty(formData.paymentDetails.upi)) newErrors.upi = "UPI required";
    if (isEmpty(formData.paymentDetails.account_number)) newErrors.account_number = "Acc no. required";
    if (isEmpty(formData.paymentDetails.ifs_Code)) newErrors.ifs_Code = "IFSC required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all mandatory fields");
      return;
    }
    
    setLoading(true);
    const form_data = new FormData();
    // Append all fields
    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === 'object' && key !== 'restaurantImages') {
        Object.keys(formData[key]).forEach(subKey => form_data.append(subKey, formData[key][subKey]));
      } else {
        form_data.append(key, formData[key]);
      }
    });
    
    photo.forEach((file) => form_data.append("restaurantImages", file));

    try {
      const res = await api.put(  import.meta.env.VITE_RESTAURANT_UPDATE,
form_data);
      if (res.data?.data) {
        sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
        setUser(res.data.data);
        toast.success("Profile Updated!");
        setTimeout(() => onClose(), 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 font-sans">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
        <div className="flex justify-between items-center px-8 py-5 border-b sticky top-0 bg-white z-50">
          <h2 className="text-xl font-black text-[#842A3B]">EDIT BUSINESS PROFILE</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* Visuals Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-gray-400">
              <ImageIcon size={18} />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Restaurant Gallery (Max 5)</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {previews.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100">
                  <img src={src} className="w-full h-full object-cover" alt="Gallery" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              ))}
              {previews.length < 5 && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all">
                  <Plus size={24} className="text-gray-300" />
                  <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </section>

          {/* Business Details */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-gray-400">
              <Utensils size={18} />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Business Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Restaurant Name", name: "restaurantName", val: formData.restaurantName },
                { label: "Owner Name", name: "fullName", val: formData.fullName },
                { label: "Cuisine (e.g. Italian, North Indian)", name: "cuisine", val: formData.cuisine },
                { label: "Mobile Number", name: "mobnumber", val: formData.mobnumber },
              ].map((field) => (
                <div key={field.name} className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">{field.label} *</label>
                  <input
                    type="text"
                    name={field.name}
                    value={field.val}
                    onChange={handleInputChange}
                    className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#842A3B]/5 ${errors[field.name] ? 'border-red-500' : 'border-gray-100'}`}
                  />
                  {errors[field.name] && <p className="text-red-500 text-[10px] mt-1">{errors[field.name]}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Location & Timing */}
          <div className="grid md:grid-cols-2 gap-10">
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={18} />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Location & Hours</h3>
              </div>
              <div className="space-y-4">
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Full Street Address *" className={`w-full p-3 bg-gray-50 border rounded-xl outline-none ${errors.address ? 'border-red-500' : 'border-gray-100'}`} />
                <div className="flex gap-3">
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City *" className={`w-1/2 p-3 bg-gray-50 border rounded-xl outline-none ${errors.city ? 'border-red-500' : 'border-gray-100'}`} />
                  <input type="text" name="pin" value={formData.pin} onChange={handleInputChange} placeholder="PIN *" className={`w-1/2 p-3 bg-gray-50 border rounded-xl outline-none ${errors.pin ? 'border-red-500' : 'border-gray-100'}`} />
                </div>
                <div className="flex gap-3">
                   <div className="w-1/2">
                    <label className="text-[9px] text-gray-400 font-bold uppercase ml-1">Opens at</label>
                    <input type="time" value={formData.restaurantTiming.opening} onChange={(e) => handleNestedChange('restaurantTiming', 'opening', e.target.value)} className={`w-full p-3 bg-gray-50 border rounded-xl outline-none ${errors.opening ? 'border-red-500' : 'border-gray-100'}`} />
                   </div>
                   <div className="w-1/2">
                    <label className="text-[9px] text-gray-400 font-bold uppercase ml-1">Closes at</label>
                    <input type="time" value={formData.restaurantTiming.closing} onChange={(e) => handleNestedChange('restaurantTiming', 'closing', e.target.value)} className={`w-full p-3 bg-gray-50 border rounded-xl outline-none ${errors.closing ? 'border-red-500' : 'border-gray-100'}`} />
                   </div>
                </div>
                <button onClick={fetchLocation} className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${errors.location ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-600'}`}>
                  {formData.geoLocation.lat ? "GPS LOCATED ✅" : "UPDATE GPS COORDINATES 📍"}
                </button>
              </div>
            </section>

            {/* Payout Details */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-gray-400">
                <CreditCard size={18} />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Payout Settings</h3>
              </div>
              <div className="space-y-4">
                {['upi', 'account_number', 'ifs_Code'].map((field) => (
                  <div key={field}>
                    <label className="text-[9px] text-gray-400 font-bold uppercase ml-1">{field.replace('_', ' ')} *</label>
                    <input
                      type="text"
                      value={formData.paymentDetails[field]}
                      onChange={(e) => handleNestedChange("paymentDetails", field, e.target.value)}
                      className={`w-full p-3 bg-gray-50 border rounded-xl outline-none ${errors[field] ? 'border-red-500' : 'border-gray-100'}`}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-50">
            <button type="button" onClick={onClose} className="px-6 py-3 text-xs font-bold text-gray-400 uppercase hover:text-gray-600">Discard</button>
            <button type="submit" disabled={loading} className="bg-[#842A3B] text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Update Business Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditResturantProfile;