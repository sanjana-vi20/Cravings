import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Leaf,
  Flame,
  Star,
  ShoppingCart,
  ArrowBigRight,
  ArrowRight,
} from "lucide-react";
import api from '../../config/Api';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ItemDetailModal from "./resturantModals/ItemDetailModal";

const ExploreMenu = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isItemDetailModalOpen , setIsItemDetailModalOpen] = useState(false);

  // Dummy Categories
  const categories = [
    { name: "All", icon: "🍽️" },
    { name: "Pizza", icon: "🍕" },
    { name: "Burgers", icon: "🍔" },
    { name: "Thali", icon: "🍱" },
    { name: "Drinks", icon: "🥤" },
    { name: "Desserts", icon: "🍰" },
  ];

  const [menu, setMenu] = useState();
  const [loading, setLoading] = useState();
  const [item , setItem] = useState();
  const [cart , setCart] = useState(JSON.parse(localStorage.getItem("cart")) || {})
  // const navigate = useNavigate()

  const fetchMenu = async () => {
    // e.preventDefault();
    setLoading(true);

    try {
      const res = await api.get("/public/fetchAllMenu");
      console.log(res.data.data);
      
      setMenu(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    console.log(menu);
    
  };


    const handleAddToCart = ( restaurantName, dish) => {
  // 1. Pehle pura cart object uthao (Local Storage se)
  // Structure: { "restId1": {details}, "restId2": {details} }

  // console.log("item : ",  user );
  let currentCart = { ...cart };
  
  console.log("cart :"  , cart);
  console.log("item :" , dish.restaurantID._id);
  
  
  const restId = dish.restaurantID._id;

  // 2. Check karo: Kya is restaurant ka cart pehle se bana hai?
  if (!currentCart[restId]) {
    // Agar nahi, toh naya entry create karo
    currentCart[restId] = {
      restaurantName: restaurantName,
      restaurantId: restId,
      items: [],
      totalPrice: 0
    };
  }

  // 3. Check karo: Kya yeh ITEM pehle se is restaurant ke cart mein hai?
  const itemIndex = currentCart[restId].items.findIndex((i) => i._id === dish._id);

  if (itemIndex > -1) {
    // Agar hai, toh sirf quantity badhao
    currentCart[restId].items[itemIndex].quantity += 1;
  } else {
    // Agar nahi hai, toh naya item object push karo
    currentCart[restId].items.push({
      _id: dish._id,
      price: Number(dish.price),
      quantity: 1
    });
  }

  // 4. Uss specific restaurant ka Total Price calculate karo
  currentCart[restId].totalPrice = currentCart[restId].items.reduce(
    (acc, curr) => acc + curr.price * curr.quantity, 
    0
  );

  setCart(currentCart);
  localStorage.setItem("cart", JSON.stringify(cart));
  
  // Yeh line Header ko batayegi ki "Update ho jao!"
  window.dispatchEvent(new Event("cartUpdated"));

  toast.success(`Added to ${restaurantName}'s cart!`);
};

  useEffect(() => {
    fetchMenu();
  },[]);
  
  console.log(menu);
  if (loading) return <p>Loading...</p>;
  if (!menu) return <p>No restaurant data found.</p>;
  // Dummy Menu Data
//   const menuItems = [
//     {
//       id: 1,
//       name: "Paneer Tikka Pizza",
//       price: 299,
//       rating: 4.5,
//       type: "veg",
//       category: "Pizza",
//       image:
//         "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
//     },
//     {
//       id: 2,
//       name: "Spicy Zinger Burger",
//       price: 180,
//       rating: 4.8,
//       type: "non-veg",
//       category: "Burgers",
//       image:
//         "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
//     },
//     {
//       id: 3,
//       name: "Maharaja Veg Thali",
//       price: 350,
//       rating: 4.9,
//       type: "veg",
//       category: "Thali",
//       image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500",
//     },
//     {
//       id: 4,
//       name: "Chocolate Lava Cake",
//       price: 120,
//       rating: 4.7,
//       type: "veg",
//       category: "Desserts",
//       image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500",
//     },
//   ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-8 animate-in fade-in duration-700">
      {/* --- 1. Top Search & Filter --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-1/2 group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#842A3B] transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search dishes, cuisines or restaurants..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm outline-none focus:ring-2 focus:ring-[#842A3B]/10 font-bold"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-50">
          <Filter size={18} /> Filters
        </button>
      </div>

      {/* --- 2. Horizontal Categories --- */}
      <div className="flex gap-4 overflow-x-auto p-3 pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] whitespace-nowrap font-black text-sm transition-all shadow-sm ${
              activeCategory === cat.name
                ? "bg-[#842A3B] text-white scale-105 shadow-[#842A3B]/20"
                : "bg-white text-slate-500 hover:bg-slate-100"
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* --- 3. Grid of Menu Items --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {menu.map((item) => (
          <div
            key={item._id}
            className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={item.image[0].url}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt={item.dishName}
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg ${item.type === "veg" ? "bg-white text-green-600" : "bg-white text-red-600"}`}
                >
                  {item.type === "veg" ? (
                    <Leaf size={12} />
                  ) : (
                    <Flame size={12} />
                  )}
                  {item.type}
                </span>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl flex items-center gap-1 text-xs font-black text-slate-800 shadow-lg">
                <Star
                  size={14}
                  fill="currentColor"
                  className="text-yellow-500"
                />
                4{item.rating}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-1">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-800 uppercase -tracking-tighter">
                  {item?.restaurantID?.restaurantName}
                </p>
                <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-[#842A3B] transition-colors">
                  {item.dishName}
                </h3>
                <button className="text-[13px] flex gap-3 items-center rounded-4xl py-1 pl-2 font-bold mt-3 pr-4 text-slate-700 border border-gray-300 tracking-tighter" onClick={()=>{setIsItemDetailModalOpen(true); setItem(item)}}>
                 More details <span><ArrowRight size={13}/></span>
                </button>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="text-2xl font-black text-slate-800">
                  <span className="text-sm font-bold text-slate-400 mr-1">
                    ₹
                  </span>
                  {item.price}
                </div>
                <button className="p-4 bg-[#842A3B] text-white rounded-2xl shadow-lg shadow-[#842A3B]/20 hover:scale-110 active:scale-95 transition-all">
                  <Plus size={20} strokeWidth={3} onClick={()=>handleAddToCart(item.restaurantID.restaurantName,item)}/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- 4. Floating Cart Button (Mobile) --- */}
      <div className="fixed bottom-8 right-8 lg:hidden">
        <button className="p-6 bg-[#842A3B] text-white rounded-full shadow-2xl flex items-center justify-center">
          <ShoppingCart size={24} />
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
            2
          </span>
        </button>
      </div>

      {isItemDetailModalOpen && <ItemDetailModal onClose={()=> setIsItemDetailModalOpen(false)} item={item} onAdd={handleAddToCart}/>}
    </div>
  );
};

export default ExploreMenu;
