import { useEffect, useState } from "react";
import { Eye, Pencil, CheckCircle, Plus, Search, Filter, Utensils } from "lucide-react";
import AddMenuModal from "./resturantModals/AddMenuModal";
import ViewItemModal from './resturantModals/ViewItemModal';
import EditItemModal from './resturantModals/EditItemModal';

import api from '../../config/Api'
import toast from "react-hot-toast";

export default function RestaurantMenu() {
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("all");
  const [openItemModal , setOpenItemModal] = useState(false);
  const [viewItemModal , setViewItemModal] = useState(false);
  const [editItemModal , setEditItemModal] = useState(false);
  const [selectedItem , setSelectedItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  const fetchMenuItem = async () => {
    try {
      const res = await api.get("/restaurant/menuItems");
      setMenuItems(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch menu items");
    }
  };

  useEffect(() => {
    if (!openItemModal && !editItemModal) fetchMenuItem();
  }, [openItemModal, editItemModal]);

  const filteredItems = menuItems?.filter((item) => {
    const matchesSearch = item.dishName.toLowerCase().includes(search.toLowerCase());
    const matchesCuisine = cuisine === "all" || item.cuisine === cuisine;
    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="p-4 md:p-8 bg-[#FAF7F2] min-h-screen font-sans">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          {/* Heading with Serif-like feel and Brand Color */}
          <h2 className="text-4xl font-serif font-bold text-[#842A3B] tracking-tight">
            The Menu Deck
          </h2>
          <div className="h-1 w-20 bg-[#F5DAA7] mt-2 rounded-full"></div>
          <p className="text-gray-500 mt-3 font-medium">Curate and manage your culinary offerings</p>
        </div>
        
        <button 
          className="flex items-center justify-center gap-2 bg-[#842A3B] text-[#F5DAA7] px-8 py-4 rounded-2xl hover:bg-[#662222] transition-all shadow-[0_10px_20px_rgba(132,42,59,0.2)] active:scale-95 group" 
          onClick={() => {setSelectedItem(null); setOpenItemModal(true)}}
        >
          <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" /> 
          <span className="font-bold tracking-wide uppercase text-sm">Add New Creation</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3485A]" size={20} />
          <input
            type="text"
            placeholder="Search for a masterpiece..."
            className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-[#842A3B] outline-none transition-all placeholder:text-gray-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3485A]" size={20} />
          <select
            className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-[#842A3B] outline-none appearance-none cursor-pointer font-bold text-[#842A3B]"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          >
            <option value="all">All Cuisines</option>
            <option value="Indian">Indian</option>
            <option value="Italian">Italian</option>
            <option value="Chinese">Chinese</option>
          </select>
        </div>
      </div>

      {/* Modern Luxury Table */}
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#842A3B] text-[#F5DAA7]">
              <th className="p-6 font-bold uppercase text-[20px] tracking-[0.2em] ps-10">Ref No.</th>
              <th className="p-6 font-bold uppercase text-[20px] tracking-[0.2em]">Dish Details</th>
              <th className="p-6 font-bold uppercase text-[20px] tracking-[0.2em]">Category</th>
              <th className="p-6 font-bold uppercase text-[20px] tracking-[0.2em]">Price</th>
              <th className="p-6 font-bold uppercase text-[20px] tracking-[0.2em] text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr key={item._id || index} className="hover:bg-[#F5DAA7]/5 transition-colors group">
                  <td className="p-6 ps-10  font-mono text-black">{index + 1}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#842A3B] group-hover:bg-[#842A3B] group-hover:text-[#F5DAA7] transition-all duration-300">
                        <Utensils size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-[#1a1a1a] text-lg">{item.dishName}</div>
                        <div className="text-[10px] font-bold text-[#A3485A] uppercase tracking-widest mt-0.5">{item.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-gray-600 font-medium italic">
                      {item.cuisine}
                    </span>
                  </td>
                  <td className="p-6 font-black text-[#842A3B] text-lg">
                    ₹{item.price}
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center items-center gap-3">
                      <button 
                        className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-[#842A3B] hover:text-white rounded-xl transition-all shadow-sm"
                        onClick={() => {setSelectedItem(item); setViewItemModal(true);}}
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-amber-500 hover:text-white rounded-xl transition-all shadow-sm"
                        onClick={() => {setSelectedItem(item); setEditItemModal(true);}}
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-sm ${item.availability ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-100 text-gray-300"}`}
                      >
                        <CheckCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-20 text-center">
                   <p className="text-gray-300 italic">No dishes have been added to the collection yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals Mapping */}
      {openItemModal && <AddMenuModal onClose={() => setOpenItemModal(false)} />}
      {viewItemModal && <ViewItemModal onClose={() => setViewItemModal(false)} selectedItem={selectedItem} />}
      {editItemModal && <EditItemModal onClose={() => setEditItemModal(false)} selectedItem={selectedItem} />}
    </div>
  );
}