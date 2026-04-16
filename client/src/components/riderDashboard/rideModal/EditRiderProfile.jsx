import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../config/Api";
import {
  X,
  Loader2,
  MapPin,
  CreditCard,
  Bike,
  FileText,
  Navigation,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import toast from "react-hot-toast";

const EditRiderProfile = ({ onClose }) => {
  const { user, setUser, setIsLogin } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email|| "",
    mobnumber: user?.mobnumber || "",
    dob: user?.dob || "",
    gender: user?.gender || "",
    address: user?.address || "",
    city: user?.city || "",
    pin: user?.pin || "",
    deliveryFee: user?.deliveryFee || 40, // As per your model default
    documents: {
      uidai: user?.documents?.uidai || "",
      pan: user?.documents?.pan || "",
      dl: user?.documents?.dl || "",
      rc: user?.documents?.rc || "",
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
  });

  const [loading, setLoading] = useState(false);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData({
      ...formData,
      [parent]: { ...formData[parent], [field]: value },
    }); 
  };
 console.log(formData.geoLocation.lat);
  const fetchLocation = (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(
      (result) => {
        setFormData({
          ...formData,
          geoLocation: {
            lat: result.coords.latitude,
            lon: result.coords.longitude,
          },
        });
        toast.success("GPS Coordinates Captured!");
      },
      () => toast.error("Please enable location permissions"),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct JSON submission since Rider profile usually doesn't have gallery like Restaurant
      const res = await api.put("/rider/update", formData);
      if (res.data?.data) {
        sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
        setUser(res.data.data);
        setIsLogin(true);
        toast.success("Rider Profile Updated!");
        setTimeout(() => onClose(), 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000] p-4 font-sans">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center px-10 py-6 border-b sticky top-0 bg-white z-50">
          <div className="flex items-center gap-3 text-[#842A3B]">
            <Bike size={24} />
            <h2 className="text-xl font-black uppercase italic tracking-tighter">
              Edit Rider Logistics
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-10">
          {/* SECTION 1: PERSONAL & RATES */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
                <UserIcon size={14} /> Basic Info
              </h3>
              <div className="space-y-3">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                <Input
                  label="Mobile Number"
                  name="mobnumber"
                  value={formData.mobnumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex gap-2">
                 <Input
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                />
                 <Input
                  label="Date of Birth"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  type="date"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase text-[#842A3B] tracking-[0.2em] flex items-center gap-2">
                <Navigation size={14} /> Service Rates
              </h3>
              <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#F5DAA7]/50">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Base Delivery Fee (₹)
                </label>
                <input
                  type="number"
                  name="deliveryFee"
                  value={formData.deliveryFee}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 bg-white rounded-xl border border-gray-200 outline-none font-black text-[#842A3B]"
                />
                <p className="text-[9px] text-gray-400 mt-2 italic">
                  * This is your fixed base charge per delivery
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2: DOCUMENTS (As per your model) */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck size={14} /> Compliance Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Driving License Number"
                value={formData.documents.dl}
                onChange={(e) =>
                  handleNestedChange("documents", "dl", e.target.value)
                }
              />
              <Input
                label="Vehicle RC No."
                value={formData.documents.rc}
                onChange={(e) =>
                  handleNestedChange("documents", "rc", e.target.value)
                }
              />
              <Input
                label="PAN Card"
                value={formData.documents.pan}
                onChange={(e) =>
                  handleNestedChange("documents", "pan", e.target.value)
                }
              />
              <Input
                label="Aadhaar"
                value={formData.documents.uidai}
                onChange={(e) =>
                  handleNestedChange("documents", "uidai", e.target.value)
                }
              />
            </div>
          </section>

          {/* SECTION 3: LOCATION & PAYOUT */}
          <section className="grid md:grid-cols-2 gap-10 border-t pt-10">
            <div className="space-y-5">
              <h3 className="text-[10px] font-black uppercase text-[#842A3B] tracking-[0.2em] flex items-center gap-2">
                <MapPin size={14} /> Service Area
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                <Input
                  label="Pincode"
                  name="pin"
                  value={formData.pin}
                  onChange={handleInputChange}
                />
              </div>
              <Input
                label="Full Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />

              <button
                type="button"
                onClick={fetchLocation}
                className="w-full py-3 bg-[#842A3B]/5 text-[#842A3B] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#842A3B]/10 transition-all flex items-center justify-center gap-2"
              >
                Sync Live GPS {formData.geoLocation.lat !== "N/A" ? "✅" : "📍"}
              </button>
            </div>

            <div className="space-y-5">
              <h3 className="text-[10px] font-black uppercase text-[#842A3B] tracking-[0.2em] flex items-center gap-2">
                <CreditCard size={14} /> Payout Settings
              </h3>
              <Input
                label="UPI ID"
                value={formData.paymentDetails.upi}
                onChange={(e) =>
                  handleNestedChange("paymentDetails", "upi", e.target.value)
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Account No"
                  value={formData.paymentDetails.account_number}
                  onChange={(e) =>
                    handleNestedChange(
                      "paymentDetails",
                      "account_number",
                      e.target.value,
                    )
                  }
                />
                <Input
                  label="IFSC Code"
                  value={formData.paymentDetails.ifs_Code}
                  onChange={(e) =>
                    handleNestedChange(
                      "paymentDetails",
                      "ifs_Code",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          </section>

          {/* BUTTONS */}
          <div className="flex justify-end items-center gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="text-[10px] font-black uppercase text-gray-400 tracking-widest hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#842A3B] text-[#F5DAA7] px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-[#842A3B]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Save Rider Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Internal Helper Component for Clean Code
const Input = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#842A3B] font-bold text-slate-700 text-sm transition-all"
    />
  </div>
);

export default EditRiderProfile;
