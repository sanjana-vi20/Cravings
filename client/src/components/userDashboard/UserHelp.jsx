import React, { useEffect, useState } from "react";
import { 
  HelpCircle, Search, MessageSquare, Phone, 
  Mail, ChevronDown, ExternalLink, LifeBuoy,
  ShieldQuestion, Clock
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const UserHelp = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  const faqs = [
    {
      question: "How can I track my live order?",
      answer: "Go to 'My Orders' section in your dashboard. You can see a real-time progress bar and delivery partner details for all active orders."
    },
    {
      question: "What is the average delivery time?",
      answer: "We take pride in our 'Lightning Fast' delivery. Most orders in Bhopal are delivered within 30-45 minutes."
    },
    {
      question: "How do I cancel my order?",
      answer: "You can cancel your order within 60 seconds of placing it. After that, the restaurant starts preparation and cancellation may not be possible."
    },
    {
      question: "Can I change my delivery address after ordering?",
      answer: "For security reasons, addresses cannot be changed once an order is out for delivery. Contact support immediately for assistance."
    }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 font-sans antialiased text-slate-900">
      
      {/* --- Header Section --- */}
      <div className="text-center space-y-4" data-aos="fade-down">
        <div className="inline-flex p-3 bg-[#842A3B]/5 rounded-2xl text-[#842A3B] mb-2">
          <LifeBuoy size={32} />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-800">How can we help you today?</h1>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest max-w-lg mx-auto leading-relaxed">
          Search our knowledge base or get in touch with our elite support team.
        </p>
      </div>

      {/* --- Quick Contact Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-aos="fade-up">
        <ContactCard 
          icon={<MessageSquare className="text-[#842A3B]" />}
          title="Live Chat"
          desc="Average response: 2 mins"
          action="Start Chat"
        />
        <ContactCard 
          icon={<Phone className="text-[#842A3B]" />}
          title="Phone Support"
          desc="+91 6268797783"
          action="Call Now"
        />
        <ContactCard 
          icon={<Mail className="text-[#842A3B]" />}
          title="Email Support"
          desc="support@cravings.com"
          action="Send Mail"
        />
      </div>

      {/* --- FAQ Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
        {/* FAQ Illustration/Side Text */}
        <div className="lg:col-span-4 space-y-6" data-aos="fade-right">
          <div className="bg-[#842A3B] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
             <ShieldQuestion size={60} className="text-[#F5DAA7] mb-6 opacity-40" />
             <h3 className="text-2xl font-black leading-tight mb-4">Frequently Asked Questions</h3>
             <p className="text-white/70 text-sm font-medium leading-relaxed">
               Quick answers to the most common queries regarding payments, delivery, and quality.
             </p>
             <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4">
            <Clock className="text-[#842A3B]" size={20} />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Support Hours</p>
              <p className="text-sm font-bold text-slate-700">24/7 Availability</p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="lg:col-span-8 space-y-4" data-aos="fade-left">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="group bg-white rounded-3xl border border-slate-100 hover:border-[#842A3B]/20 transition-all duration-300"
            >
              <button 
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full px-8 py-6 flex justify-between items-center text-left"
              >
                <span className="font-bold text-slate-700 group-hover:text-[#842A3B] transition-colors">
                  {faq.question}
                </span>
                <ChevronDown 
                  size={20} 
                  className={`text-slate-300 transition-transform duration-300 ${activeFaq === index ? 'rotate-180 text-[#842A3B]' : ''}`} 
                />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${activeFaq === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-8 pb-6 text-sm text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

/* --- UI Helper Component --- */
const ContactCard = ({ icon, title, desc, action }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-black text-slate-800 mb-1">{title}</h3>
    <p className="text-xs text-slate-400 font-bold mb-6 uppercase tracking-wider">{desc}</p>
    <button className="flex items-center gap-2 text-[10px] font-black text-[#842A3B] uppercase tracking-[0.2em] group-hover:gap-3 transition-all">
      {action} <ExternalLink size={14} />
    </button>
  </div>
);

export default UserHelp;