import React, { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { 
  Mail, Phone, MapPin, Calendar, Globe, Landmark, BadgeCheck, ShieldCheck 
} from 'lucide-react';
import { FaCamera } from "react-icons/fa";
import toast from 'react-hot-toast';
import api from '../../config/Api';
import EditResturantProfile from './resturantModals/EditResturantProfile.jsx';
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
      const res = await api.patch("/restaurant/photo-update", form_Data);
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
    <div className="min-h-screen bg-gradient-to-br m-4 rounded-2xl from-[var(--bg-accent)] via-white to-[var(--bg-accent)] py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="bg-white/90 backdrop-blur rounded-[2.5rem] border border-slate-100 shadow-lg p-8 flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-[var(--color-accent)] p-1">
              <img
                src={preview || user?.photo?.url || "https://via.placeholder.com/150"}
                className="w-full h-full rounded-full object-cover border-4 border-white"
              />
            </div>
            <label className="absolute bottom-1 right-1 bg-[var(--color-primary)] text-white p-2 rounded-full cursor-pointer">
              <FaCamera size={14} />
              <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
            </label>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              {user?.fullName || "Restaurant Owner"}
            </h1>
            <div className="flex gap-3 mt-3 justify-center md:justify-start">
              <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <BadgeCheck size={14} /> Active
              </span>
              <span className="text-xs text-gray-400">Joined {user?.createdAt?.slice(0,4)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)]"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setOpenResetPasswordModal(true)}
              className="px-6 py-3 rounded-xl border text-[var(--color-primary)]"
            >
              Reset Password
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card title="General Information" icon={<Globe size={18} />}
              items={[
                { label: 'Email', value: user?.email, icon: <Mail size={16} /> },
                { label: 'Mobile', value: user?.mobnumber, icon: <Phone size={16} /> },
                { label: 'Restaurant', value: user?.restaurantName, icon: <Landmark size={16} /> },
                { label: 'DOB', value: user?.dob, icon: <Calendar size={16} /> },
              ]}
            />

            <Card title="Location Details" icon={<MapPin size={18} />}
              items={[
                { label: 'Address', value: user?.address },
                { label: 'City', value: user?.city },
                { label: 'PIN', value: user?.pin || user?.pincode },
              ]}
            />
          </div>

          <div className="relative overflow-hidden bg-[var(--color-primary)] text-white rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <ShieldCheck size={18} /> Security & Payments
            </h3>
            <DarkItem label="UIDAI" value={user?.documents?.uidai} />
            <DarkItem label="PAN" value={user?.documents?.pan} />
            <DarkItem label="UPI" value={user?.paymentDetails?.upi} />
            <DarkItem label="Account No" value={user?.paymentDetails?.account_number} />
          </div>
        </div>
      </div>

      {isEditModal && <EditResturantProfile onClose={() => setIsEditModalOpen(false)} />}
      {openResetPasswordModal && <ResPasswordResetModal onClose={() => setOpenResetPasswordModal(false)} />}
    </div>
  );
};

const Card = ({ title, icon, items, cols = 'sm:grid-cols-2' }) => (
  <div className="bg-white rounded-3xl p-8 border shadow-sm">
    <h3 className="font-bold mb-6 flex items-center gap-2 text-[var(--color-primary)]">{icon}{title}</h3>
    <div className={`grid ${cols} gap-6`}>
      {items.map((item, i) => (
        <Detail key={i} {...item} />
      ))}
    </div>
  </div>
);

const Detail = ({ label, value, icon }) => (
  <div className="group">  <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">{label}</p>
    <div className="flex items-center gap-2 font-semibold text-gray-700 group-hover:text-[var(--color-primary)] transition">
      {icon}{value || '—'}
    </div>
  </div>
);

const DarkItem = ({ label, value }) => (
  <div className="mb-4">
    <p className="text-xs uppercase text-white/60">{label}</p>
    <p className="font-semibold">{value || 'Pending'}</p>
  </div>
);

export default RestaurantProfile;
