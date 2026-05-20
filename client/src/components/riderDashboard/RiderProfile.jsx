import React, { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { 
  Mail, Phone, MapPin, Calendar, Globe, BadgeCheck, ShieldCheck, 
  Bike, CreditCard, FileText, Navigation, Sparkles, 
  IndianRupee
} from 'lucide-react';
import { FaCamera } from "react-icons/fa";
import toast from 'react-hot-toast';
import api from '../../config/Api';
import EditRiderProfile from './rideModal/EditRiderProfile';
// import EditRiderProfile from './riderModals/EditRiderProfile.jsx';
// import RiderPasswordResetModal from "./riderModals/RiderPasswordResetModal.jsx";

const RiderProfile = () => {
  const [isEditModal, setIsEditModalOpen] = useState(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [preview, setPreview] = useState();
  const { user, setUser } = useAuth();

  const changePhoto = async (fileUpload) => {
    if (!fileUpload) return;
    const form_Data = new FormData();
    form_Data.append("image", fileUpload);

    try {
      const res = await api.patch(  import.meta.env.VITE_RIDER_PHOTO_UPDATE, form_Data);
      setPreview(null);
      toast.success(res.data.message);
      setUser(res.data.data);
      sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
    } catch (error) {
      toast.error(error?.response?.data?.message );
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
    <div className="min-h-screen bg-slate-50 m-4 rounded-[2.5rem] py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* --- Header: Hero Section --- */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          {/* Decorative Background Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#842A3B]/5 rounded-bl-full pointer-events-none" />
          
          <div className="relative">
            <div className="w-35 h-35 rounded-full bg-[#842A3B] p-1 shadow-2xl">
              <img
                src={preview || user?.photo?.url || "https://via.placeholder.com/150"}
                className="w-full h-full rounded-full object-cover border-8 border-white"
                alt="Rider Profile"
              />
            </div>
            <label className="absolute bottom-2 right-2 bg-[#842A3B] text-[#F5DAA7] p-3 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform active:scale-95 border-2 border-white">
              <FaCamera size={18} />
              <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
            </label>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-3">
               <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">
                {user?.fullName || "Delivery Partner"}
              </h1>
              <Sparkles className="text-[#F5DAA7]" size={24} />
            </div>
            
            <div className="flex gap-3 mt-3 justify-center md:justify-start">
              <span className="flex items-center gap-2 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full bg-[#842A3B] text-white shadow-md">
                <BadgeCheck size={14} /> Verified Rider
              </span>
              <span className="flex items-center gap-2 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full bg-[#F5DAA7] text-[#842A3B]">
                ID: {user?._id?.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-full px-8 py-4 rounded-2xl bg-[#842A3B] text-white font-black uppercase text-xs tracking-[0.2em] hover:bg-[#6d2230] shadow-lg shadow-[#842A3B]/20 transition-all active:scale-95"
            >
              Update Profile
            </button>
            <button
              onClick={() => setOpenResetPasswordModal(true)}
              className="w-full px-8 py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-50 transition-all"
            >
              Security
            </button>
          </div>
        </div>

        {/* --- Main Info Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            <Card title="Rider Logistics" icon={<Navigation size={18} />}
              items={[
                { label: 'Primary Email', value: user?.email, icon: <Mail size={16} /> },
                { label: 'Contact Number', value: user?.mobnumber, icon: <Phone size={16} /> },
                { label: 'Operational City', value: user?.city, icon: <MapPin size={16} /> },
                { label: 'Date of Birth', value: user?.dob, icon: <Calendar size={16} /> },
              ]}
            />

            <Card title="Vehicle & Earnings" icon={<Bike size={18} />}
              items={[
                { label: 'Vehicle Assigned', value: user?.riderSettings?.vehicleType || 'Bike', icon: <Bike size={16} /> },
                { label: 'Base Fare', value: `₹${user?.riderSettings?.baseDeliveryFee || 40}`, icon: <IndianRupee size={16} /> },
                { label: 'Rate Per KM', value: `₹${user?.riderSettings?.ratePerKm || 10}/KM`, icon: <Navigation size={16} /> },
                { label: 'Current Status', value: user?.isActive ? 'ACTIVE / ONLINE' : 'OFFLINE' },
              ]}
            />
          </div>

          {/* --- Sidebar: Payments & Documents --- */}
          <div className="relative overflow-hidden bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl border-t-8 border-[#842A3B]">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#842A3B]/20 rounded-full blur-3xl opacity-50" />
            
            <h3 className="font-black uppercase tracking-[0.2em] text-[10px] mb-10 flex items-center gap-2 text-[#F5DAA7]">
              <ShieldCheck size={18} /> Compliance Vault
            </h3>
            
            <div className="space-y-8 relative z-10">
              <DarkItem label="Driving License" value={user?.documents?.dl} />
              <DarkItem label="Vehicle RC" value={user?.documents?.rc} />
              
              <div className="pt-8 border-t border-white/10 mt-10">
                <p className="text-[10px] font-black uppercase text-[#F5DAA7] mb-6 tracking-[0.3em]">Payout Info</p>
                <DarkItem label="Linked UPI ID" value={user?.paymentDetails?.upi} />
                <DarkItem label="Settlement A/C" value={user?.paymentDetails?.account_number} />
              </div>
            </div>
            
            <div className="mt-12 p-4 bg-[#842A3B]/10 rounded-2xl border border-white/5">
                <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed">
                  All documents are end-to-end encrypted and verified by Craving compliance team.
                </p>
            </div>
          </div>
        </div>
      </div>

      {isEditModal && <EditRiderProfile onClose={() => setIsEditModalOpen(false)} />}
      {openResetPasswordModal && <RiderPasswordResetModal onClose={() => setOpenResetPasswordModal(false)} />}
    </div>
  );
};

// --- Reusable Sub-components ---

const Card = ({ title, icon, items }) => (
  <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <h3 className="font-black text-[11px] uppercase tracking-[0.25em] mb-10 flex items-center gap-3 text-[#842A3B]">
      <div className="p-2 bg-[#842A3B]/5 rounded-lg">{icon}</div>
      {title}
    </h3>
    <div className="grid sm:grid-cols-2 gap-10">
      {items.map((item, i) => (
        <Detail key={i} {...item} />
      ))}
    </div>
  </div>
);

const Detail = ({ label, value, icon }) => (
  <div className="group">
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">{label}</p>
    <div className="flex items-center gap-3 font-bold text-slate-700 group-hover:text-[#842A3B] transition-colors">
      <span className="text-slate-200 group-hover:text-[#F5DAA7] transition-colors">{icon}</span>
      <span className="text-sm tracking-tight">{value || 'NOT CONFIGURED'}</span>
    </div>
  </div>
);

const DarkItem = ({ label, value }) => (
  <div className="group">
    <p className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-2">{label}</p>
    <p className="font-bold text-sm text-white/90 group-hover:text-[#F5DAA7] transition-colors">{value || 'PENDING VERIFICATION'}</p>
  </div>
);

export default RiderProfile;