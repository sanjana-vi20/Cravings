import React, { useState } from "react";
import { Search, Leaf, Drumstick, Plus, Info } from "lucide-react";
import toast from "react-hot-toast";

const OrderOnline = ({ data }) => {
  const restaurant = data[0];
  const menuItems = restaurant?.myMenu || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, veg, non-veg

  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || {},
  );

  // Filter Logic
  const filteredMenu = menuItems.filter((item) => {
    const matchesSearch = item.dishName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAddToCart = (restaurantName, item) => {
    // 1. Pehle pura cart object uthao (Local Storage se)
    // Structure: { "restId1": {details}, "restId2": {details} }

    console.log("cart :", cart);

    console.log(restaurant.restaurantName);

    let currentCart = { ...cart };

    const restId = item.restaurantID;

    if (!currentCart[restId]) {
      currentCart[restId] = {
        restaurantName: restaurantName,
        restaurantId: restId,
        items: [],
        totalPrice: 0,
      };
    }

    const itemIndex = currentCart[restId].items.findIndex((i) => i._id === item._id);

    if (itemIndex > -1) {
      currentCart[restId].items[itemIndex].quantity += 1;
    } else {
      currentCart[restId].items.push({
        _id: item._id,
        price: Number(item.price),
        quantity: 1,
      });
    }

  currentCart[restId].totalPrice = currentCart[restId].items.reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0,
    );

    setCart(currentCart)
    localStorage.setItem("cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));

    toast.success(`Added to ${restaurant.restaurantName}'s cart!`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-500">
      {/* --- Left Sidebar: Categories --- */}
      <div className="w-full md:w-64 space-y-2 hidden md:block">
        <h3 className="font-black text-slate-800 mb-4 px-4 uppercase tracking-tighter">
          Categories
        </h3>
        {["All Dishes", "Veg Only", "Non-Veg Only"].map((cat, i) => (
          <button
            key={i}
            onClick={() =>
              setFilter(
                cat === "Veg Only"
                  ? "veg"
                  : cat === "Non-Veg Only"
                    ? "non-veg"
                    : "all",
              )
            }
            className={`w-full text-left px-4 py-3 rounded-2xl font-bold transition-all ${
              (filter === "all" && cat === "All Dishes") ||
              (filter === "veg" && cat === "Veg Only") ||
              (filter === "non-veg" && cat === "Non-Veg Only")
                ? "bg-[#842A3B] text-white shadow-lg"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- Main Content: Search & Menu List --- */}
      <div className="flex-1 space-y-6">
        {/* Search Bar */}
        <div className="relative group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#842A3B] transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search for your favorite dish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-slate-100 border-none rounded-[2rem] outline-none focus:ring-2 focus:ring-[#842A3B]/20 font-bold text-slate-700 placeholder:text-slate-400 transition-all"
          />
        </div>

        {/* Menu Items List */}
        <div className="space-y-4">
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => (
              <div
                key={item._id}
                className="group flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
              >
                {/* Dish Image */}
                <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-3xl">
                  <img
                    src={
                      item.image[0]?.url || "https://via.placeholder.com/150"
                    }
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={item.dishName}
                  />
                  <div className="absolute top-2 left-2">
                    {item.type === "veg" ? (
                      <div className="p-1 bg-white rounded-md border-2 border-green-600">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                    ) : (
                      <div className="p-1 bg-white rounded-md border-2 border-red-600">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dish Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-black text-slate-800 leading-none">
                        {item.dishName}
                      </h4>
                      <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">
                        {item.cuisine}
                      </p>
                    </div>
                    <p className="text-xl font-black text-[#842A3B]">
                      ₹{item.price}
                    </p>
                  </div>
                  <p className="text-gray-500 line-clamp-2 text-sm leading-relaxed pr-10">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase">
                      Serves: {item.servingsize}
                    </span>
                    <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase">
                      {item.preparationTime} Mins
                    </span>
                  </div>
                </div>

                {/* Add Button */}
                <button className="h-12 w-12 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-[#842A3B] hover:bg-[#842A3B] hover:text-white hover:border-[#842A3B] transition-all shadow-sm active:scale-90">
                  <Plus
                    size={24}
                    strokeWidth={3}
                    onClick={() =>
                      handleAddToCart(restaurant.restaurantName, item)
                    }
                  />
                </button>
              </div>
            ))
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <Search size={40} />
              </div>
              <p className="font-black text-slate-400 uppercase tracking-widest">
                No dishes found matching your search
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderOnline;
