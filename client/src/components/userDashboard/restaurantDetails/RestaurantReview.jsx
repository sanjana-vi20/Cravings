import React from "react";
import { Star, ThumbsUp, MessageSquare, User } from "lucide-react";

const RestaurantReview = () => {
  // Dummy data kyunki abhi humne reviews ka schema nahi banaya hai
  const reviews = [
    {
      id: 1,
      user: "Rahul Sharma",
      rating: 5,
      comment: "Bhopal ka sabse swadisht khana! Paneer Tikka lazawab tha.",
      date: "2 days ago",
    },
    {
      id: 2,
      user: "Priya Singh",
      rating: 4,
      comment: "Service thodi slow hai, par taste ek dum ghar jaisa hai.",
      date: "1 week ago",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* --- Part 1: Rating Summary --- */}
      <div className="flex flex-col md:flex-row items-center gap-10 p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-black text-slate-800">4.2</h1>
          <div className="flex gap-1 text-yellow-500">
            {[1, 2, 3, 4].map((s) => <Star key={s} fill="currentColor" size={20} />)}
            <Star size={20} className="text-slate-300" />
          </div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">128 Verified Reviews</p>
        </div>

        <div className="flex-1 w-full space-y-3">
          {/* Progress Bars for Ratings */}
          {[5, 4, 3, 2, 1].map((num) => (
            <div key={num} className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-500 w-4">{num}</span>
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#842A3B] rounded-full" 
                  style={{ width: `${num === 5 ? 70 : num === 4 ? 20 : 5}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Part 2: Reviews List --- */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <MessageSquare className="text-[#842A3B]" /> What People Say
        </h3>

        {reviews.map((rev) => (
          <div key={rev.id} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800">{rev.user}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase">{rev.date}</p>
                </div>
              </div>
              <div className="bg-green-600 text-white px-3 py-1 rounded-xl text-sm font-bold flex items-center gap-1">
                {rev.rating} <Star size={12} fill="currentColor" />
              </div>
            </div>
            
            <p className="text-slate-600 leading-relaxed mb-6">"{rev.comment}"</p>
            
            <div className="flex gap-6 border-t border-slate-50 pt-6">
              <button className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-[#842A3B] transition-colors uppercase tracking-widest">
                <ThumbsUp size={16} /> Helpful
              </button>
              <button className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-[#842A3B] transition-colors uppercase tracking-widest">
                Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantReview;