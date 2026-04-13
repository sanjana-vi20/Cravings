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
} from "lucide-react";
import toast from "react-hot-toast";

const EditResturantProfile = ({ onClose }) => {
  const { user, setUser, setIsLogin } = useAuth();

  // Multi-Image States (Max 5)
  const [previews, setPreviews] = useState(user?.gallery || []);
  const [photo, setPhoto] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    cuisine:user?.cuisine || "",
    restaurantName: user?.restaurantName || "",
    email: user?.email || "",
    mobnumber: user?.mobnumber || "",
    gender: user?.gender || "",
    dob: user?.dob || "",
    address: user?.address || "",
    city: user?.city || "",
    pin: user?.pin || "",
    documents: {
      uidai: user?.documents?.uidai || "",
      pan: user?.documents?.pan || "",
    },
    paymentDetails: {
      upi: user?.paymentDetails?.upi || "",
      account_number: user?.paymentDetails?.account_number || "",
      ifs_Code: user?.paymentDetails?.ifs_Code || "",
    },
    geoLocation: {
      lat: user?.geoLocation?.lat || "",
      lon: user?.geoLocation?.lon || "",
    },
    restaurantTiming:{
      opening:user?.restaurantTiming?.opening || "",
      closing:user?.restaurantTiming?.closing || "",
    }
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // --- Image Handlers ---
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (previews.length + files.length > 5) {
      toast.error("You can only upload up to 5 photos");
      return;
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeImage = (index) => {
    const filtered = previews.filter((_, i) => i !== index);
    setPreviews(filtered);
  };

  // --- Form Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData({
      ...formData,
      [parent]: { ...formData[parent], [field]: value },
    });
  };


  const handlePhotoUpload = async(e) => {

    const files = Array.from(e.target.files);
    setPhoto(files);

  }

  const fetchLocation = (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((result) => {
      setFormData({
        ...formData,
        geoLocation: {
          lat: result.coords.latitude,
          lon: result.coords.longitude,
        },
      });
      toast.success("Location updated!");
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
    if (!formData.restaurantName.trim()) newErrors.restaurantName = "Required";
    if (!/^\d{6}$/.test(formData.pin)) newErrors.pin = "Invalid PIN";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    console.log(formData.restaurantName);
    
    const form_data = new FormData();
    form_data.append("fullName", formData.fullName);
    form_data.append("cuisine", formData.cuisine);
    form_data.append("restaurantName", formData.restaurantName);
    form_data.append("mobnumber", formData.mobnumber);
    form_data.append("address", formData.address);
    form_data.append("city", formData.city);
    form_data.append("pin", formData.pin);
    form_data.append("opening", formData.restaurantTiming.opening);
    form_data.append("closing", formData.restaurantTiming.closing);
    form_data.append("lat", formData.geoLocation.lat);
    form_data.append("lon", formData.geoLocation.lon);
    form_data.append("upi", formData.paymentDetails.upi);
    form_data.append("account_number", formData.paymentDetails.account_number);
    form_data.append("ifs_Code", formData.paymentDetails.ifs_Code);
      photo.forEach((file) => {
        form_data.append("restaurantImages", file);
      });

      console.log(photo);
      
    try {
      const res = await api.put("/restaurant/update", form_data);
      if (res.data?.data) {
        sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
        setUser(res.data.data);
        setIsLogin(true);
        toast.success("Restaurant Profile Updated!");
        setTimeout(() => onClose(), 1000);
      }
    } catch (error) {
      console.log(error);
      
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000] p-4 font-sans">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-[2.5rem] shadow-2xl border border-gray-100">
        {/* Sticky Header */}
        <div className="flex justify-between items-center px-10 py-6 border-b sticky top-0 bg-white z-50">
          <h2 className="text-2xl font-black text-[#842A3B] tracking-tight">
            Edit Restaurant Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
          {/* TOP SECTION: IMAGE GALLERY */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FAF7F2] rounded-xl flex items-center justify-center text-[#842A3B]">
                <ImageIcon size={20} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
                Restaurant Visuals (Max 5)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Primary Slot (Larger) */}
              <div className="md:col-span h-full w-2/2 relative aspect-video bg-gray-50 border-2 border-dashed border-[#F5DAA7] rounded-3xl overflow-hidden group">
                {previews[0] ? (
                  <>
                    <img
                      src={previews[0]}
                      className="w-full h-full object-cover"
                      alt="Primary"
                    />
                    <button
                      onClick={() => removeImage(0)}
                      className="absolute top-3 right-3 p-2 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FAF7F2] transition-all">
                    <Camera size={32} className="text-[#F5DAA7]" />
                    <span className="text-[10px] mt-2 font-bold text-gray-400 uppercase tracking-widest">
                      Add Main Photo
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      name="restaurantImages"
                      onChange={(e) => {
                        handleImageChange(e);
                        handlePhotoUpload(e);
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Sub Slots */}
              <div className="md:col-span-3 grid grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => {
                  const idx = i + 1;
                  return (
                    <div
                      key={i}
                      className="relative aspect-square bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden group"
                    >
                      {previews[idx] ? (
                        <>
                          <img
                            src={previews[idx]}
                            className="w-full h-full object-cover"
                            alt={`Gallery ${idx}`}
                          />
                          <button
                            onClick={() => removeImage(idx)}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} className="text-white" />
                          </button>
                        </>
                      ) : (
                        <label className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                          <Plus size={20} className="text-gray-300" />
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                            disabled={previews.length >= 5}
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* MIDDLE SECTION: BUSINESS DETAILS */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FAF7F2] rounded-xl flex items-center justify-center text-[#842A3B]">
                <Utensils size={20} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                Business Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#842A3B]/10 outline-none font-bold text-[#842A3B]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Owner Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Contact Mobile
                </label>
                <input
                  type="tel"
                  name="mobnumber"
                  value={formData.mobnumber}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Email (Verified)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full p-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 cursor-not-allowed font-medium"
                />
              </div>
               <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Cuisine
                </label>
                <input
                  type="cuisine"
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                />
              </div>
            </div>
          </section>

          {/* BOTTOM SECTION: LOCATION & PAYOUT */}
          <section className="grid md:grid-cols-2 gap-12 pt-4">
            {/* Address */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-black text-[#842A3B] uppercase tracking-[0.2em] flex items-center gap-2">
                <MapPin size={16} /> Location
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Full Address"
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-[#842A3B]"
                  />
                </div>
                <div className="flex gap-4 ">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-2/2 p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-[#842A3B]"
                    />
                  </div>
                  <div className="flex flex-col ">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      PinCode
                    </label>

                    <input
                      type="text"
                      name="pin"
                      value={formData.pin}
                      onChange={handleInputChange}
                      placeholder="PIN"
                      className="w-2/2 p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-[#842A3B]"
                    />
                  </div>
                </div>

                <div className="flex gap-6 mt-7">
                   <div className="flex flex-col ">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Opening Time:
                    </label>

                    <input
                      type="time"
                      name="opening"
                      value={formData.restaurantTiming.opening}
                      onChange={(e) => handleNestedChange('restaurantTiming', 'opening', e.target.value)}
                      placeholder="PIN"
                      className="w-2/2 p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-[#842A3B]"
                    />
                  </div>
                   <div className="flex flex-col ">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Closing Time:
                    </label>

                    <input
                      type="time"
                      name="closing"
                      value={formData.restaurantTiming.closing}
                      onChange={(e) => handleNestedChange('restaurantTiming', 'closing', e.target.value)}
                      placeholder="PIN"
                      className="w-2/2 p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-[#842A3B]"
                    />
                  </div>
                </div>
                <button
                  onClick={fetchLocation}
                  className="w-full py-4 bg-[#FAF7F2] text-[#842A3B] rounded-2xl font-black  uppercase tracking-widest hover:bg-[#F5DAA7]/30 transition-all"
                >
                  Update GPS Coordinates{" "}
                  {formData.geoLocation.lat ? "✅" : "📍"}
                </button>
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-6">
              <h4 className="  text-[#842A3B] uppercase font-bold text-[19px] flex items-center gap-2">
                <CreditCard size={16} /> Payout Details
              </h4>
              <div className="space-y-4">
                <div className="space-x-3">
                  <label htmlFor="" className="text-gray-500 font-bold p-4">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={formData.paymentDetails.upi}
                    onChange={(e) =>
                      handleNestedChange(
                        "paymentDetails",
                        "upi",
                        e.target.value,
                      )
                    }
                    placeholder="UPI ID (username@bank)"
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-[#842A3B]"
                  />
                </div>
                <div>
                  <label htmlFor="" className="text-gray-500 font-bold p-4">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.paymentDetails.account_number}
                    onChange={(e) =>
                      handleNestedChange(
                        "paymentDetails",
                        "account_number",
                        e.target.value,
                      )
                    }
                    placeholder="Account Number"
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-[#842A3B]"
                  />
                </div>
                <div>
                  <label htmlFor="" className="text-gray-500 font-bold p-4">
                    IFS Code
                  </label>
                  <input
                    type="text"
                    value={formData.paymentDetails.ifs_Code}
                    onChange={(e) =>
                      handleNestedChange(
                        "paymentDetails",
                        "ifs_Code",
                        e.target.value,
                      )
                    }
                    placeholder="IFSC Code"
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-[#842A3B]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* FINAL ACTIONS */}
          <div className="flex justify-end items-center gap-6 pt-10 border-t border-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="text- text-gray-400 uppercase  hover:text-gray-800 transition-colors"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#842A3B] text-[#F5DAA7] px-12 py-5 rounded-[2rem]  uppercase tracking-[0.2em] shadow-xl shadow-[#842A3B]/20 hover:bg-[#662222] transition-all flex items-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Update Business Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditResturantProfile;
