import React, { useEffect, useState } from "react";
import api from "../config/Api";
import {
  ArrowLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activeBill, setActiveBill] = useState(null);
  const { user, isLogin } = useAuth();

  const getCartDetails = async () => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];

    try {
      if (Object.keys(localCart).length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      console.log("localCart: ", localCart);
      const itemsArray = Object.values(localCart).flatMap(
        (restaurant) => restaurant.items,
      );
      console.log("itemsArray: ", itemsArray);

      const arrayId = itemsArray.map((item) => item._id);
      // console.log("ArrayID: ", arrayId);

      const qtyMap = {};
      itemsArray.forEach((item) => {
        qtyMap[item._id] = item.quantity;
      });

      // console.log("qty : ", qtyMap);

      const res = await api.post(`/public/fetchMenu/`, { arrayId });
      const allData = res.data.data;

      const finalCart = allData.map((item) => ({
        ...item,
        quantity: qtyMap[item._id] || 0,
      }));

      // console.log("finalCart : ", finalCart);

      setCartItems(finalCart);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCartDetails();
  }, []);

  console.log("CurrentUser: ", user);

  const handleQuantity = (id, resId, change) => {
    const updatedCart = JSON.parse(localStorage.getItem("cart")) || {};

    if (updatedCart[resId]) {
      updatedCart[resId].items = updatedCart[resId].items.map((i) =>
        i._id === id ? { ...i, quantity: Math.max(1, i.quantity + change) } : i,
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      ),
    );

    window.dispatchEvent(new Event("cartUpdated")); // Header update ke liye
  };

  // 3. Remove Item Logic
  const removeItem = (id, resId) => {
    const updatedCart = JSON.parse(localStorage.getItem("cart")) || {};
    const filtered = updatedCart[resId].items.filter((item) => item._id !== id);
    console.log("filtered : ", filtered);

    const filteredCart = {
      ...updatedCart,
      [resId]: {
        ...updatedCart[resId],
        items: filtered,
      },
    };
    console.log("fitersCart : ", filteredCart);

    const updatedStateArray = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedStateArray);
    console.log("Carts : ", cartItems);

    localStorage.setItem("cart", JSON.stringify(filteredCart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Item removed");
  };

  const groupedItems = cartItems.reduce((acc, item) => {
    const restName = item.restaurantID.restaurantName;
    if (!acc[restName]) {
      acc[restName] = [];
    }
    acc[restName].push(item);
    return acc;
  }, {});

  // console.log("grouped : ", groupedItems);

  // 4. Calculations
  const calculateRestBill = (items) => {
    const itemTotal = items.reduce(
      (sum, i) => sum + Number(i.price) * i.quantity,
      0,
    );
    const delivery = itemTotal > 500 ? 0 : 40;
    const gst = Math.round(itemTotal * 0.05);
    const platform = 5;
    return {
      itemTotal,
      delivery,
      gst,
      platform,
      grandTotal: itemTotal + delivery + gst + platform,
    };
  };

  const handleCheckout = (resName, items, bill) => {
    if (isLogin) {
      navigate("/checkoutPage", {
        state: {
          restaurantName: resName,
          items: items,
          billDetails: bill,
        },
      });
    } else {
      toast.error("please Login First");
      navigate("/login");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-black text-[#842A3B] animate-pulse">
        CRAVING...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Bar */}
      <div className="bg-white px-6 py-4 border-b flex items-center justify-between sticky top-0 z-50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-bold text-slate-600 hover:text-[#842A3B]"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="font-black text-xl tracking-tighter uppercase italic text-slate-800">
          Your Cravings
        </h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="max-w-7xl mx-auto mt-10 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cart Items (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
              <ShoppingBag size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold">Your cart is empty!</p>
              <button
                className="mt-4 text-[#842A3B] font-black underline"
                onClick={() => navigate("/")}
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div className="lg:col-span-8 space-y-8">
              {Object.entries(groupedItems).map(([restaurantName, items]) => (
                <div
                  key={restaurantName}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100"
                >
                  {/* Restaurant Header */}
                  <div className="bg-[#842A3B]/5 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <h2 className="font-black text-xl text-slate-800 tracking-tighter uppercase italic">
                        {restaurantName}
                      </h2>
                      <p className="text-[10px] font-bold text-[#842A3B] uppercase tracking-widest">
                        {items.length} Items from this kitchen
                      </p>
                    </div>
                  </div>

                  {/* Items List for this specific restaurant */}
                  <div className="p-4 space-y-4">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 p-4 rounded-[1.5rem] hover:bg-slate-50 transition-all group"
                      >
                        <img
                          src={item.image[0]?.url}
                          className="w-24 h-24 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                          alt={item.dishName}
                        />

                        <div className="flex-1">
                          <h3 className="font-black text-lg text-slate-800">
                            {item.dishName}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {item.cuisine}
                          </p>
                          <p className="font-black text-[#842A3B] mt-1">
                            ₹{item.price}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 rounded-xl shadow-sm">
                          <button
                            onClick={() =>
                              handleQuantity(
                                item._id,
                                item.restaurantID._id,
                                -1,
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-[#842A3B]"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-black text-sm w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantity(item._id, item.restaurantID._id, 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-[#842A3B]"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            removeItem(item._id, item.restaurantID._id)
                          }
                          className="p-3 text-slate-200 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Restaurant Specific Total (Optional) */}
                  <div className="px-8 py-4 bg-slate-50/50 text-right border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase mr-2">
                      Restaurant Subtotal:
                    </span>
                    <span className="font-black text-lg text-slate-800">
                      ₹{items.reduce((sum, i) => sum + i.price * i.quantity, 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Bill Details (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="font-black text-slate-800 text-xl uppercase tracking-tighter italic px-2">
            Billing Breakdown
          </h2>

          {Object.entries(groupedItems).map(
            ([restaurantName, items], index) => {
              const bill = calculateRestBill(items);
              const isOpen = activeBill === restaurantName; // Kya ye wala bill khula hai?

              return (
                <div
                  key={restaurantName}
                  className={`transition-all duration-500 rounded-[2rem] border overflow-hidden ${
                    isOpen
                      ? "bg-white shadow-xl border-[#842A3B]/20"
                      : "bg-white shadow-sm border-slate-100"
                  }`}
                >
                  {/* Clickable Header */}
                  <div
                    onClick={() =>
                      setActiveBill(isOpen ? null : restaurantName)
                    }
                    className="p-6 cursor-pointer flex justify-between items-center hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                          isOpen
                            ? "bg-[#842A3B] text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <h3 className="font-black text-slate-800 text-sm uppercase truncate max-w-[150px]">
                        {restaurantName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      {!isOpen && (
                        <span className="font-black text-slate-900 text-sm">
                          ₹{bill.grandTotal}
                        </span>
                      )}
                      <ChevronRight
                        size={18}
                        className={`transition-transform duration-300 ${isOpen ? "rotate-90 text-[#842A3B]" : "text-slate-300"}`}
                      />
                    </div>
                  </div>

                  {/* Expandable Bill Content */}
                  <div
                    className={`transition-all duration-500 ease-in-out ${
                      isOpen
                        ? "max-h-[500px] opacity-100 p-6 pt-0"
                        : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="space-y-3 pt-4 border-t border-dashed border-slate-100">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Items Total</span>
                        <span className="text-slate-800">
                          ₹{bill.itemTotal}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Delivery Fee</span>
                        <span className="text-slate-800">₹{bill.delivery}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>GST & Taxes</span>
                        <span className="text-slate-800">₹{bill.gst}</span>
                      </div>
                      <div className="flex justify-between pt-3 mt-2">
                        <span className="text-[#842A3B] font-black uppercase text-[14px] tracking-tight">
                          Payable
                        </span>
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">
                          ₹{bill.grandTotal}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleCheckout(restaurantName, items, bill)
                        }
                        className="w-full mt-4 px-3 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-[#842A3B] transition-all flex items-center justify-center gap-2"
                      >
                        Order from {restaurantName} <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            },
          )}

          {/* Final Total (Ye hamesha dikhega) */}
          <div className="mt-8 bg-[#1a1a1a] p-8 rounded-[2.5rem] shadow-2xl text-white">
            <div className="flex justify-between items-center mb-6">
              <p className="font-black text-xs uppercase tracking-[0.2em] text-[#842A3B]">
                Grand Total
              </p>
              <h2 className="text-3xl font-black tracking-tighter">
                ₹
                {Object.values(groupedItems).reduce(
                  (sum, items) => sum + calculateRestBill(items).grandTotal,
                  0,
                )}
              </h2>
            </div>
            <button className="w-full bg-[#842A3B] py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
              Checkout All Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
