import React, { useState } from "react";
import SideBar from "../../components/userDashboard/SideBar";
import UserOverview from "../../components/userDashboard/UserOverview";
import UserProfile from "../../components/userDashboard/UserProfile";
import UserOrder from "../../components/userDashboard/UserOrder";
import UserTransaction from "../../components/userDashboard/UserTransaction";
import UserHelp from "../../components/userDashboard/UserHelp";
import CartPage from "../CartPage";


const UserDashboard = () => {
  const [active, setActive] = useState("overview");
  const[isCollapse , setIsCollapse] = useState(true);
  return (
    <>
      <div className="flex w-full min-h-screen bg-slate-50">
        <div className={`  fixed duration-300 rounded-2xl m-2.5 ${isCollapse ? "w-3/60" : "w-12/60"} h-screen`}>
          <SideBar active={active} setActive={setActive} isCollapse= {isCollapse} setIsCollapse = {setIsCollapse} />
        </div>
        <div className={`duration-300 w-full 
        ${isCollapse ? "pl-[80px]" : "pl-[320px]"}`}>
        {active === 'overview' && <UserOverview/>}
        {active === 'profile' && <UserProfile/>}
        {active === 'order' && <UserOrder/>}
        {active === 'add-to-cart' && <CartPage/>}
        {active === 'transaction' && <UserTransaction/>}
        {active === 'helpdesk' && <UserHelp/>}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
