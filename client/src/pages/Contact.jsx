import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../config/Api";
import { Mail, Phone, MapPin, Send, MessageSquare, User } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobnumber: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleClear = () => {
    setFormData({
      fullName: "",
      email: "",
      mobnumber: "",
      message: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/public/new-contact", formData);
      toast.success(res.data.message || "Message sent successfully!");
      handleClear();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3]/30 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16" data-aos="fade-down">
          <h1 className="text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tight">
            Get in <span className="text-[#842A3B]">Touch</span>
          </h1>
          <p className="mt-4 text-slate-500 font-medium uppercase tracking-[0.2em] text-xs">
            We'd love to hear from you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left Side: Contact Information */}
          <div className="space-y-6" data-aos="fade-right">
            <ContactInfoCard 
              icon={<Phone className="text-[#842A3B]" />}
              title="Call Us"
              detail="+91 98765 43210"
              subDetail="Mon-Sat, 9am-6pm"
            />
            <ContactInfoCard 
              icon={<Mail className="text-[#842A3B]" />}
              title="Email Us"
              detail="hello@cravings.com"
              subDetail="Online support 24/7"
            />
            <ContactInfoCard 
              icon={<MapPin className="text-[#842A3B]" />}
              title="Visit Us"
              detail="MP Nagar, Zone 1"
              subDetail="Bhopal, MP, India"
            />
          </div>

          {/* Right Side: Contact Form */}
          <div 
            className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-12"
            data-aos="fade-left"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  label="Full Name" icon={<User size={18}/>} name="fullName"
                  placeholder="John Doe" value={formData.fullName} 
                  onChange={handleChange} disabled={isLoading}
                />
                <InputGroup 
                  label="Email Address" icon={<Mail size={18}/>} name="email"
                  placeholder="john@example.com" value={formData.email} 
                  onChange={handleChange} disabled={isLoading}
                />
              </div>

              <InputGroup 
                label="Mobile Number" icon={<Phone size={18}/>} name="mobnumber"
                placeholder="9876543210" value={formData.mobnumber} 
                onChange={handleChange} disabled={isLoading} type="number"
              />

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Message</label>
                <div className="flex border-2 border-slate-50 bg-slate-50 rounded-2xl p-4 focus-within:border-[#842A3B]/20 focus-within:bg-white transition-all">
                  <MessageSquare size={18} className="text-slate-400 mt-1" />
                  <textarea
                    name="message"
                    rows="4"
                    className="w-full bg-transparent border-none focus:ring-0 outline-none px-3 text-sm font-bold text-slate-700 placeholder:text-slate-300 resize-none"
                    placeholder="Tell us what's on your mind..."
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                disabled={isLoading}
                className="w-full py-4 bg-[#842A3B] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-[#842A3B]/20 hover:bg-[#662222] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
              >
                {isLoading ? "Sending..." : <>Send Message <Send size={16} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
const ContactInfoCard = ({ icon, title, detail, subDetail }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-14 h-14 bg-[#842A3B]/5 rounded-2xl flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</h3>
      <p className="text-sm font-black text-slate-800">{detail}</p>
      <p className="text-[10px] font-medium text-slate-400 mt-0.5">{subDetail}</p>
    </div>
  </div>
);

const InputGroup = ({ label, icon, name, placeholder, value, onChange, disabled, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{label}</label>
    <div className="group flex items-center border-2 border-slate-50 bg-slate-50 px-5 py-3.5 rounded-2xl transition-all focus-within:border-[#842A3B]/20 focus-within:bg-white focus-within:shadow-sm">
      <span className="text-slate-400 group-focus-within:text-[#842A3B] transition-colors">{icon}</span>
      <input
        type={type} name={name} value={value} onChange={onChange} disabled={disabled}
        placeholder={placeholder}
        className="bg-transparent border-none focus:ring-0 outline-none w-full px-3 text-sm font-bold text-slate-700 placeholder:text-slate-300"
      />
    </div>
  </div>
);

export default Contact;   