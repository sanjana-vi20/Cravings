import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../config/Api";

const EditProfileModal = ({ onClose }) => {
  const { user, setUser, setIsLogin } = useAuth();
  
  const cleanValue = (val) => (val === "N/A" || !val ? "" : val);

  const [formData, setFormData] = useState({
    fullName: cleanValue(user?.fullName),
    email: user?.email || "",
    mobnumber: cleanValue(user?.mobnumber),
    gender: cleanValue(user?.gender),
    dob: cleanValue(user?.dob),
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
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const validateForm = () => {
    const newErrors = {};
    const isEmpty = (val) => !val || val.toString().trim() === "" || val === "N/A";

    if (isEmpty(formData.fullName)) newErrors.fullName = "Full name is required";
    if (isEmpty(formData.mobnumber)) newErrors.mobnumber = "Mobile is required";
    if (isEmpty(formData.gender)) newErrors.gender = "Select gender";
    if (isEmpty(formData.dob)) newErrors.dob = "DOB is required";
    if (isEmpty(formData.address)) newErrors.address = "Address is required";
    if (isEmpty(formData.city)) newErrors.city = "City is required";
    if (isEmpty(formData.pin)) newErrors.pin = "PIN is required";
    
    if (!formData.geoLocation.lat) newErrors.location = "Live location required";

    if (isEmpty(formData.documents.uidai)) newErrors.uidai = "Aadhaar is required";
    if (isEmpty(formData.documents.pan)) newErrors.pan = "PAN is required";
    
    if (isEmpty(formData.paymentDetails.upi)) newErrors.upi = "UPI is required";
    if (isEmpty(formData.paymentDetails.account_number)) newErrors.account_number = "Account No. required";
    if (isEmpty(formData.paymentDetails.ifs_Code)) newErrors.ifs_Code = "IFSC required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData({ ...formData, [parent]: { ...formData[parent], [field]: value } });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const fetchLocation = (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((res) => {
      setFormData({
        ...formData,
        geoLocation: { lat: res.coords.latitude, lon: res.coords.longitude }
      });
      setErrors({ ...errors, location: "" });
    }, () => alert("Enable location access"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage({ type: "error", text: "Please fill all mandatory fields correctly." });
      return;
    }
    setLoading(true);
    try {
      const res = await api.put("/user/update", formData);
      if (res.data?.data) {
        sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
        setUser(res.data.data);
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setTimeout(() => onClose(), 1500);
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Helper UI component for input fields
  const FormInput = ({ label, name, value, onChange, error, type = "text", disabled = false, placeholder = "" }) => (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-4 py-2 rounded-lg border transition-all outline-none ${
          disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200" :
          error ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />
      {error && <span className="text-red-500 text-[11px] mt-1 font-medium">{error}</span>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
            <p className="text-sm text-gray-500">Update your information to keep your profile current.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors">
            <span className="text-3xl leading-none">&times;</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {message.text && (
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${message.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              <span className="text-lg">{message.type === "success" ? "✓" : "⚠"}</span>
              <p className="font-medium text-sm">{message.text}</p>
            </div>
          )}

          {/* Section: Personal */}
          <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
            <h3 className="text-sm uppercase tracking-wider font-bold text-blue-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Full Name *" name="fullName" value={formData.fullName} onChange={handleInputChange} error={errors.fullName} placeholder="e.g. John Doe" />
              <FormInput label="Email Address" name="email" value={formData.email} disabled />
              <FormInput label="Mobile Number *" name="mobnumber" value={formData.mobnumber} onChange={handleInputChange} error={errors.mobnumber} placeholder="10-digit number" />
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-600 mb-1">Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className={`w-full px-4 py-2 rounded-lg border outline-none ${errors.gender ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"}`}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span className="text-red-500 text-[11px] mt-1">{errors.gender}</span>}
              </div>
              <FormInput label="Date of Birth *" name="dob" type="date" value={formData.dob} onChange={handleInputChange} error={errors.dob} />
            </div>
          </div>

          {/* Section: Address */}
          <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
            <h3 className="text-sm uppercase tracking-wider font-bold text-blue-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Address & Location
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <FormInput label="Complete Address *" name="address" value={formData.address} onChange={handleInputChange} error={errors.address} placeholder="Street, Apartment, Landmark" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput label="City *" name="city" value={formData.city} onChange={handleInputChange} error={errors.city} />
                <FormInput label="PIN Code *" name="pin" value={formData.pin} onChange={handleInputChange} error={errors.pin} />
                <div className="flex flex-col justify-end">
                  <button type="button" onClick={fetchLocation} className={`px-4 py-2.5 rounded-lg border font-semibold flex items-center justify-center gap-2 transition-all ${formData.geoLocation.lat ? "bg-green-50 border-green-200 text-green-700" : "bg-white border-blue-200 text-blue-600 hover:bg-blue-50"}`}>
                    {formData.geoLocation.lat ? "📍 Location Captured" : "📍 Get Live Location"}
                  </button>
                  {errors.location && <span className="text-red-500 text-[11px] mt-1 font-medium">{errors.location}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Documents & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Documents */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
              <h3 className="text-sm uppercase tracking-wider font-bold text-blue-600 flex items-center gap-2">Documents</h3>
              <FormInput label="Aadhaar Number (12-digit) *" value={formData.documents.uidai} onChange={(e) => handleNestedChange("documents", "uidai", e.target.value)} error={errors.uidai} />
              <FormInput label="PAN Number *" value={formData.documents.pan} onChange={(e) => handleNestedChange("documents", "pan", e.target.value)} error={errors.pan} />
            </div>

            {/* Payment */}
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
              <h3 className="text-sm uppercase tracking-wider font-bold text-blue-600 flex items-center gap-2">Payment Details</h3>
              <FormInput label="UPI ID *" value={formData.paymentDetails.upi} onChange={(e) => handleNestedChange("paymentDetails", "upi", e.target.value)} error={errors.upi} placeholder="username@upi" />
              <FormInput label="Account Number *" value={formData.paymentDetails.account_number} onChange={(e) => handleNestedChange("paymentDetails", "account_number", e.target.value)} error={errors.account_number} />
              <FormInput label="IFSC Code *" value={formData.paymentDetails.ifs_Code} onChange={(e) => handleNestedChange("paymentDetails", "ifs_Code", e.target.value)} error={errors.ifs_Code} />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-8 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-10 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;