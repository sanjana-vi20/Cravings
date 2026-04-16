import React, { useState } from "react";
// import { CgProfile } from "react-icons/cg";
import { MdMenuBook } from "react-icons/md";
import { IoCart } from "react-icons/io5";
import { TbTransactionRupee } from "react-icons/tb";
import { MdOutlineHelpOutline } from "react-icons/md";
import { CiGrid41 } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/Api";
import { useNavigate } from "react-router-dom";

const RiderSidebar = ({
  active,
  setActive,
  isCollapse,
  setIsCollapse,
}) => {
  const { setUser, setIsLogin } = useAuth();
  const menuItems = [
    { key: "ride-overview", title: "Overview", icon: <CiGrid41 size={20} /> },
    { key: "ride-profile", title: "Profile", icon: <CgProfile size={20} /> },
    { key: "ride-order", title: "Manage Order", icon: <IoCart size={20} /> },
    {
      key: " res-transaction",
      title: "Manage Transaction",
      icon: <TbTransactionRupee size={20} />,
    },
    {
      key: "res-feedback",
      title: "Complaint & Feedback",
      icon: <MdOutlineHelpOutline size={20} />,
    },
  ];

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await api.get("/auth/logout"); // cookie clear
      toast.success(res.data.message);
      setUser(""); // user clear
      setIsLogin(false); // login clear
      navigate("/");
      sessionStorage.removeItem("CravingUser");
    } catch (error) {
      // console.log(error)
      toast.error(error?.response?.data?.message || "Unknown Error");
    }
  };
  return (
    <>
      <div className="flex flex-col justify-between ">
        <div className=" p-3">
          <div className="text-xl font-bold flex h-12 items-center gap-2 ">
            <button
              className="hover:scale-105"
              onClick={() => setIsCollapse(!isCollapse)}
            >
              <GiHamburgerMenu className="ms-3" />
            </button>
            {!isCollapse && (
              <span className="overflow-hidden text-nowrap pl-2">
                Rider Dashboard
              </span>
            )}
          </div>
          <hr />

          <div className="flex flex-col justify- gap-3 mt-2 w-full">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                className={`flex items-center gap-2 p-2 ${isCollapse ? "mx-auto" : ""} rounded h-12 text-nowrap ${
                  active === item.key
                    ? "bg-(--bg-light)"
                    : " hover:bg-amber-50/70 hover:scale-105"
                }`}
                onClick={() => setActive(item.key)}
              >
                {item.icon}
                {isCollapse ? "" : item.title}
              </button>
            ))}
             <button
              className={`flex items-center gap-2 p-2 ${isCollapse ? "mx-auto" : ""} rounded h-12 text-nowrap   hover:bg-amber-50/70 hover:scale-105`}
              onClick={handleLogout}
            >
              {""}
              <MdLogout size={20}/>
              {!isCollapse && "Logout"}
            </button>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default RiderSidebar;
