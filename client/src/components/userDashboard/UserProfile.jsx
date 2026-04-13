import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  Calendar,
  Landmark,
  BadgeCheck,
} from "lucide-react";
import { FaCamera } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../config/Api";
import EditProfileModal from "./modals/EditProfileModal.jsx";

const UserProfile = () => {
  const [isEditModal, setIsEditModalOpen] = useState(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [photo, setPhoto] = useState("");
  const [preview, setPreview] = useState();
  const { user, setUser } = useAuth();

  // --- Aapka Existing Logic (Retained) ---
  const changePhoto = async (fileUpload) => {
    if (!fileUpload) return;
    const form_Data = new FormData();
    form_Data.append("image", fileUpload);
    form_Data.append("imageURL", preview);

    try {
      const res = await api.patch("/user/photo-update", form_Data);
      setPreview(null);
      toast.success(res.data.message);
      setUser(res.data.data);
      sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unknown Error");
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const newPhoto = URL.createObjectURL(file);
      setPreview(newPhoto);
      setTimeout(() => {
        setPhoto(file);
        changePhoto(file);
      }, 5000);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#f8f9fa] py-10 px-4 scroll-smooth">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* --- Section 1: Top Profile Header (Based on Screenshot) --- */}
          <div
            className="w-full rounded-[2.5rem] shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-100"
            style={{ backgroundColor: "var(--bg-light)" }}
          >
            <div className="flex items-center gap-8 flex-1">
              {/* Avatar Logic */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[var(--color-accent)] shadow-md bg-gray-100">
                  <img
                    src={preview || user?.photo?.url || "/default-avatar.png"}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label
                  htmlFor="imageUpload"
                  className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform border border-gray-100"
                >
                  <FaCamera size={16} className="text-[#842A3B]" />
                  <input
                    type="file"
                    id="imageUpload"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>

              {/* Status & Name */}
              <div className="text-left space-y-1">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                  
                  
                  {user?.fullName || ""}
                </h2>
                <div className="flex items-center gap-2 text-sm font-bold text-[#842A3B]">
                  <BadgeCheck size={16} />
                  Active{" "}
                  {user?.role === "manager"
                    ? "Manager"
                    : user?.role || "Partner"}
                </div>
                <p className="text-xs text-gray-400 font-semibold tracking-wide">
                  MEMBER SINCE{" "}
                  {user?.createdAt ? user.createdAt.slice(0, 4) : "2026"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-10 py-3 rounded-2xl font-bold text-white shadow-md transition-all hover:bg-[#662222] active:scale-95"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Edit Profile
              </button>
              <button
                onClick={() => setOpenResetPasswordModal(true)}
                className="px-10 py-3 rounded-2xl font-bold text-white shadow-md transition-all hover:bg-[#662222] active:scale-95"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Reset Password
              </button>
            </div>
          </div>

          {/* --- Section 2: Detailed Information Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Contact & Location */}
            <div className="md:col-span-2 space-y-8">
              {/* Contact Card */}
              <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-50">
                <h3 className="text-sm font-black  uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Mail size={16} className="text-[#842A3B]" /> Contact
                  Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <InfoBlock
                    label="Email Address"
                    value={user?.email}
                    icon={<Mail size={16} />}
                  />
                  <InfoBlock
                    label="Phone Number"
                    value={user?.mobnumber}
                    icon={<Phone size={16} />}
                  />
                  <InfoBlock
                    label="Gender"
                    value={user?.gender || "Not Set"}
                    icon={<Calendar size={16} />}
                  />
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50">
                <h3 className="text-sm font-black  uppercase tracking-widest mb-6 flex items-center gap-2">
                  <MapPin size={16} className="text-[#842A3B]" /> Address
                  Details
                </h3>
                <div className="space-y-6">
                  <InfoBlock
                    label="Full Address"
                    value={user?.address || "N/A"}
                  />
                  <div className="grid grid-cols-2 gap-8">
                    <InfoBlock label="City" value={user?.city || "N/A"} />
                    <InfoBlock
                      label="PIN Code"
                      value={user?.pin || "N/A"}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Verification & Payment */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 h-full">
                <h3 className="text-sm font-black  uppercase  mb-8 border-b pb-4">
                  Account Verification
                </h3>

                <div className="space-y-8">
                  <section>
                    <p className="text-[10px] font-bold text-[#842A3B] mb-4">
                      DOCUMENTS
                    </p>
                    <InfoBlock
                      label="Aadhaar (UIDAI)"
                      value={user?.documents?.uidai || "Pending"}
                      icon={<FileText size={16} />}
                    />
                    <div className="mt-6">
                      <InfoBlock
                        label="PAN Number"
                        value={user?.documents?.pan || "Pending"}
                        icon={<FileText size={16} />}
                      />
                    </div>
                  </section>

                  <section className="pt-6 border-t border-gray-50">
                    <p className="text-[10px] font-bold text-[#842A3B] mb-4">
                      PAYMENT SETTINGS
                    </p>
                    <InfoBlock
                      label="UPI ID"
                      value={user?.paymentDetails?.upi || "N/A"}
                      icon={<CreditCard size={16} />}
                    />
                    <div className="mt-6">
                      <InfoBlock
                        label="Bank Account"
                        value={user?.paymentDetails?.account_number || "N/A"}
                        icon={<Landmark size={16} />}
                      />
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModal && (
        <EditProfileModal onClose={() => setIsEditModalOpen(false)} />
      )}
    </>
  );
};

/* --- Reusable UI Component --- */
const InfoBlock = ({ label, value, icon }) => (
  <div className="group">
    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-tighter">
      {label}
    </label>
    <div className="flex items-center gap-3 mt-1.5">
      {icon && (
        <span className="text-gray-300 group-hover:text-[#842A3B] transition-colors">
          {icon}
        </span>
      )}
      <p className="text-sm font-bold text-gray-700">{value || "—"}</p>
    </div>
  </div>
);

export default UserProfile;
