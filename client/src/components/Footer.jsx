import React from 'react';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, Send, ChevronRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#121212] text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Accent Blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#842A3B]/10 rounded-full blur-[100px] -z-10"></div>
      
      <div className="container mx-auto px-6">
        {/* Top Section: Newsletter Card */}
        <div className="bg-[#1a1a1a] border border-gray-800 p-8 md:p-12 rounded-[3rem] mb-20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-md">
            <h3 className="text-3xl font-black text-[#F5DAA7] mb-3">Join the Feast</h3>
            <p className="text-gray-400 font-medium">Get secret recipes and exclusive 50% OFF deals directly in your inbox.</p>
          </div>
          <div className="w-full md:w-[400px] relative">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full bg-[#222] border-none rounded-2xl py-5 pl-6 pr-16 text-sm outline-none focus:ring-2 focus:ring-[#842A3B] transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#842A3B] p-3.5 rounded-xl hover:bg-[#662222] transition-transform active:scale-90">
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Info */}
          <div className="space-y-8">
            <h2 className="text-4xl font-black tracking-tighter">
              <span className="text-[#842A3B]">FOOD</span>DECK
            </h2>
            <p className="text-gray-500 leading-relaxed text-sm font-medium">
              Elevating the art of dining. From local favorites to global cuisines, we deliver perfection.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-[#F5DAA7] hover:border-[#842A3B] hover:bg-[#842A3B]/10 transition-all duration-300">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#842A3B] mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Browse Menu', 'Special Offers', 'Our Story', 'Help Center'].map((link) => (
                <li key={link} className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer text-sm font-bold">
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all text-[#842A3B]" />
                  {link}
                </li>
              ))}
            </ul>
          </div>

          {/* Location Details */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#842A3B] mb-8">Contact Us</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-[#F5DAA7] shrink-0">
                  <MapPin size={18} />
                </div>
                <p className="text-gray-400 text-sm leading-snug font-medium">
                  Sector 2, Arera Colony,<br />Bhopal, MP 462016
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-[#F5DAA7] shrink-0">
                  <Phone size={18} />
                </div>
                <p className="text-gray-400 text-sm font-bold">+91 98765 43210</p>
              </div>
            </div>
          </div>

          {/* App Download UI */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#842A3B] mb-8">Get the App</h4>
            <div className="space-y-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                className="h-12 w-auto cursor-pointer grayscale hover:grayscale-0 transition-all hover:scale-105" 
                alt="App Store" 
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                className="h-12 w-auto cursor-pointer grayscale hover:grayscale-0 transition-all hover:scale-105" 
                alt="Play Store" 
              />
            </div>
          </div>

        </div>

        {/* Copyright Section */}
        <div className="pt-10 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            &copy; 2026 Crafted by Gemini. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            <span className="hover:text-[#842A3B] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#842A3B] cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;