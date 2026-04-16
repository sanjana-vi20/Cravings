import { Sidebar } from 'lucide-react'
import React, { useState } from 'react'
// import UserDashboard from './UserDashboard'
import RestaurantSideBar from '../../components/restaurantDashboard/RestaurantSideBar';
import ResturantOverview from '../../components/restaurantDashboard/ResturantOverview';
import RestaurantProfile from '../../components/restaurantDashboard/RestaurantProfile';
import RestaurantOrder from '../../components/restaurantDashboard/RestaurantOrder';
import UserTransaction from '../../components/userDashboard/UserTransaction';
import RestaurantMenu from '../../components/restaurantDashboard/RestaurantMenu';
import RestaurantTransaction from '../../components/restaurantDashboard/RestaurantTransaction';
import RestaurantFeedback from '../../components/restaurantDashboard/RestaurantFeedback';

const RestaurantDashboard = () => {
 const [active, setActive] = useState("res-overview");
  const[isCollapse , setIsCollapse] = useState(true);
  return (
    <>
      <div className="flex min-h-screen bg-slate-50">
        <div className={` bg-white fixed duration-300 rounded-2xl m-2.5 ${isCollapse ? "w-3/60" : "w-12/60"} h-screen`}>
          <RestaurantSideBar active={active} setActive={setActive} isCollapse= {isCollapse} setIsCollapse = {setIsCollapse} />
        </div>
        <div className={`duration-300 w-full 
        ${isCollapse ? "pl-[80px]" : "pl-[320px]"}`}>
        {active === 'res-overview' && <ResturantOverview/>}
        {active === 'res-profile' && <RestaurantProfile/>}
        {active === 'res-menu' && <RestaurantMenu/>}

        {active === 'res-order' && <RestaurantOrder/>}
        {active === 'res-transaction' && <RestaurantTransaction/>}
        {active === 'res-feedback' && <RestaurantFeedback/>}
        </div>
      </div>
    </>
  );
};

export default RestaurantDashboard