import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Landmark,
  BadgeCheck,
  ShieldCheck,
  Clock,
  Utensils,
  CreditCard,
  FileText,
  Camera,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../config/Api";
import EditResturantProfile from "./resturantModals/EditResturantProfile.jsx";
import ResPasswordResetModal from "./resturantModals/ResPasswordResetModal.jsx";

const RestaurantProfile = () => {
  const [isEditModal, setIsEditModalOpen] = useState(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [preview, setPreview] = useState();
  const { user, setUser } = useAuth();

  const changePhoto = async (fileUpload) => {
    if (!fileUpload) return;
    const form_Data = new FormData();
    form_Data.append("image", fileUpload);

    try {
      const res = await api.patch( import.meta.env.VITE_RESTAURANT_PHOTO_UPDATE, form_Data);
      setPreview(null);
      toast.success(res.data.message);
      setUser(res.data.data);
      sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unknown Error");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const tempUrl = URL.createObjectURL(file);
    setPreview(tempUrl);
    setTimeout(() => changePhoto(file), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-10 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Profile Image Section */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[var(--color-accent)] shadow-md bg-gray-100">
                <img
                  src={
                    preview ||
                    user?.photo?.url ||
                    "https://via.placeholder.com/150"
                  }
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt="Profile"
                />
              </div>
              <label className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-2xl shadow-lg cursor-pointer hover:bg-slate-50 transition-all border border-slate-100 text-[#842A3B]">
                <Camera size={20} />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>

            {/* Text Info Section */}
            <div className="flex-1 text-center md:text-left mt-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {user?.restaurantName || "Tanishk da dhaba"}
                </h1>
                <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider rounded-full border border-green-100">
                  <BadgeCheck size={14} /> Verified
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 text-slate-500 font-medium">
                <p className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl text-sm">
                  <Utensils size={16} className="text-[#842A3B]" />
                  {user?.cuisine || "Indian Cuisine"}
                </p>
                <p className="text-sm border-l border-slate-200 pl-4 hidden sm:block">
                  Owned by{" "}
                  <span className="text-slate-900 font-bold">
                    {user?.fullName || "Tanishk"}
                  </span>
                </p>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-3 self-center md:self-start mt-4 md:mt-0">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-8 py-3 bg-[#842A3B] text-white rounded-2xl font-bold text-sm hover:bg-[#6b2230] transition-all shadow-lg shadow-[#842A3B]/20 active:scale-95"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setOpenResetPasswordModal(true)}
                className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-[#842A3B] hover:bg-[#FAF7F2] border border-slate-100 transition-all"
                title="Security Settings"
              >
                <ShieldCheck size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact & Hours */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Globe size={16} className="text-[#842A3B]" /> General
                Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <InfoRow
                  label="Email Address"
                  value={user?.email}
                  icon={<Mail size={16} />}
                />
                <InfoRow
                  label="Phone Number"
                  value={user?.mobnumber}
                  icon={<Phone size={16} />}
                />
                <InfoRow
                  label="Opening Hours"
                  value={`${user?.restaurantTiming?.opening || "12:00"} - ${user?.restaurantTiming?.closing || "21:00"}`}
                  icon={<Clock size={16} />}
                />
                <InfoRow
                  label="Member Since"
                  value={user?.createdAt?.slice(0, 10) || "2026-02-02"}
                  icon={<Calendar size={16} />}
                />
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <MapPin size={16} className="text-[#842A3B]" /> Location Details
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Primary Address
                  </span>
                  <p className="text-slate-700 font-semibold mt-1">
                    {user?.address || "Bhopal MP"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      City
                    </span>
                    <p className="text-slate-700 font-semibold mt-1">
                      {user?.city || "Bhopal"}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Pin Code
                    </span>
                    <p className="text-slate-700 font-semibold mt-1">
                      {user?.pin || user?.pincode || "123456"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Payouts */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm border-t-4 border-t-[#842A3B]">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <CreditCard size={16} className="text-[#842A3B]" /> Payout
                Settings
              </h3>
              <div className="space-y-4">
                <PaymentCard
                  label="UPI ID"
                  value={user?.paymentDetails?.upi || "username@bank"}
                />
                <PaymentCard
                  label="Account No"
                  value={
                    user?.paymentDetails?.account_number || "9182736455463728"
                  }
                  isSecret
                />
                <PaymentCard
                  label="IFSC Code"
                  value={user?.paymentDetails?.ifs_Code || "123456"}
                />
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <FileText size={16} className="text-[#842A3B]" /> Verification
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <span className="text-xs font-semibold text-slate-500">
                    PAN Card
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {user?.documents?.pan || "123456"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <span className="text-xs font-semibold text-slate-500">
                    Aadhaar
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    ********9451
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModal && (
        <EditResturantProfile onClose={() => setIsEditModalOpen(false)} />
      )}
      {openResetPasswordModal && (
        <ResPasswordResetModal
          onClose={() => setOpenResetPasswordModal(false)}
        />
      )}
    </div>
  );
};

const InfoRow = ({ label, value, icon }) => (
  <div className="flex items-start gap-4 group">
    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:text-[#842A3B] group-hover:bg-[#FAF7F2] transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-700">
        {value || "Not provided"}
      </p>
    </div>
  </div>
);

const PaymentCard = ({ label, value, isSecret }) => (
  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">
      {label}
    </p>
    <p className="text-sm font-mono font-bold text-slate-700 truncate">
      {isSecret ? value.replace(/.(?=.{4})/g, "*") : value}
    </p>
  </div>
);

export default RestaurantProfile;
