import React from "react";
// Icons import (same as yours)
import { CgProfile } from "react-icons/cg";
import { IoCart } from "react-icons/io5";
import { TbTransactionRupee } from "react-icons/tb";
import { MdOutlineHelpOutline, MdLogout } from "react-icons/md";
import { CiGrid41 } from "react-icons/ci";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaCartPlus } from "react-icons/fa6";

const SideBar = ({ active, setActive, isCollapse, setIsCollapse }) => {
  const menuItems = [
    { key: "overview", title: "Overview", icon: <CiGrid41 size={22} /> },
    { key: "profile", title: "Profile", icon: <CgProfile size={22} /> },
    { key: "order", title: "My Orders", icon: <IoCart size={22} /> },
    { key: "add-to-cart", title: "Carts", icon: <FaCartPlus size={22} /> },
    {
      key: "transaction",
      title: "Transactions",
      icon: <TbTransactionRupee size={22} />,
    },
    {
      key: "helpdesk",
      title: "Help Desk",
      icon: <MdOutlineHelpOutline size={22} />,
    },
  ];

  return (
    <div
      className={`h-[86vh] bg-white rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${
        isCollapse ? "w-[80px]" : "w-[260px]"
      }`}
    >
      {/* --- Header --- */}
      <div className="p-5 flex items-center h-20 border-b border-slate-50">
        <button
          onClick={() => setIsCollapse(!isCollapse)}
          className="min-w-[40px] h-10 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors shrink-0"
        >
          <GiHamburgerMenu size={20} className="text-slate-600" />
        </button>

        {/* Text transition logic */}
        <div
          className={`ml-4 transition-all duration-300 origin-left ${isCollapse ? "opacity-0 scale-0 w-0" : "opacity-100 scale-100 w-auto"}`}
        >
          <span className="font-black text-slate-800 text-lg whitespace-nowrap">
            User<span className="text-[#842A3B]">Panel</span>
          </span>
        </div>
      </div>

      {/* --- Menu --- */}
      <div className="flex-1 py-6 p flex flex-col gap-2 m-2 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`relative flex items-center h-12 rounded-2xl group transition-all duration-300 ${
                isActive
                  ? "bg-[#842A3B] text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {/* 1. Icon Container: Iska size fixed rakhein (e.g., 50px ya 60px) */}
              <div className="w-[60px] h-full flex items-center justify-center shrink-0">
                {item.icon}
              </div>

              {/* 2. Text Span: Isme padding-left (pl-0) remove karein aur margin-left (ml-1 or ml-2) use karein */}
              <span
                className={`font-bold text-sm tracking-wide transition-all duration-500 overflow-hidden whitespace-nowrap ${
                  isCollapse ? "opacity-0 w-0 ml-0" : "opacity-100 w-auto ml-1" // Yahan width ko 'auto' rakhein taaki wo icon ke paas rahe
                }`}
              >
                {item.title}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* --- Logout --- */}
      <div className="p-3 border-t border-slate-50">
  <button
    className={`flex items-center h-12 rounded-2xl w-full text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 ${
      // justify-center ko hata kar hamesha justify-start rakhein
      "justify-start" 
    }`}
  >
    {/* Icon Container: Iski width thodi kam (e.g., 48px ya 50px) rakhein */}
    <div className="min-w-[50px] flex items-center justify-center shrink-0">
      <MdLogout size={22} />
    </div>
    
    <span
      className={`font-bold text-sm transition-all duration-500 overflow-hidden whitespace-nowrap ${
        // w-full ki jagah w-auto use karein taaki text icon ke paas rahe
        isCollapse ? "opacity-0 w-0 ml-0" : "opacity-100 w-auto ml-2"
      }`}
    >
      Logout
    </span>
  </button>
</div>
    </div>
  );
};

export default SideBar;
