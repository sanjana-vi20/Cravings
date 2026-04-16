import React, { useState } from "react";
import { 
  Navigation, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  IndianRupee, 
  Star,
  Zap,
  LayoutDashboard,
  History,
  User,
  Power
} from "lucide-react";
import RiderSidebar from "../../components/riderDashboard/RiderSidebar";
import RiderOverview from "../../components/riderDashboard/RiderOverview";
import RiderOrders from "../../components/riderDashboard/RiderOrders";
import RiderProfile from "../../components/riderDashboard/RiderProfile";

const RiderDashboard = () => {
 const [active, setActive] = useState("res-overview");
  const[isCollapse , setIsCollapse] = useState(true);
  return (
    <>
      <div className="flex min-h-screen bg-slate-50">
        <div className={` bg-white fixed duration-300 rounded-2xl m-2.5 ${isCollapse ? "w-3/60" : "w-12/60"} h-screen`}>
          <RiderSidebar active={active} setActive={setActive} isCollapse= {isCollapse} setIsCollapse = {setIsCollapse} />
        </div>
        <div className={`duration-300 w-full 
        ${isCollapse ? "pl-[80px]" : "pl-[320px]"}`}>
        {active === 'ride-overview' && <RiderOverview/>}
        {active === 'ride-profile' && <RiderProfile/>}
        {active === 'ride-order' && <RiderOrders/>}

       
        </div>
      </div>
    </>
  );
};

export default RiderDashboard;