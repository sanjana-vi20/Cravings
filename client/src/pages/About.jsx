import React, { useEffect } from "react";
import { 
  Heart, Utensils, Star, Users, Globe, 
  ChefHat, Award, Leaf, Quote 
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "../components/Footer";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const stats = [
    { id: 1, label: "HAPPY CLIENTS", value: "15k+", icon: <Users size={20} /> },
    { id: 2, label: "MASTER CHEFS", value: "12", icon: <ChefHat size={20} /> },
    { id: 3, label: "CUIZINE VARIETY", value: "25+", icon: <Utensils size={20} /> },
    { id: 4, label: "AWARDS WON", value: "08", icon: <Award size={20} /> },
  ];

  return (
    <div className="font-sans text-[#1a1a1a] bg-white overflow-x-hidden scrollbar-hide">
      
      {/* --- 1. HERO SECTION: THE VISION --- */}
      <section className="relative h-[60vh] flex items-center justify-center bg-[#842A3B] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1500" 
            className="w-full h-full object-cover" 
            alt="Background" 
          />
        </div>
        <div className="relative z-10 text-center text-white px-6" data-aos="zoom-out">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F5DAA7]">Our Philosophy</span>
          <h1 className="text-5xl md:text-7xl font-black mt-4 tracking-tighter">
            More Than Just <br /> <span className="italic font-serif text-[#F5DAA7]">Cravings.</span>
          </h1>
        </div>
      </section>

      {/* --- 2. OUR STORY: CRAFTING EXCELLENCE --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-10 md:px-20 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative" data-aos="fade-right">
             <div className="rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-[#FDF6E3]">
                <img 
                  src="https://ansainteriors.com/wp-content/uploads/2019/01/3-13.jpg" 
                  alt="Restaurant Interior" 
                />
             </div>
             <div className="absolute -bottom-10 -right-10 bg-[#842A3B] p-8 rounded-[2rem] shadow-xl hidden md:block" data-aos="zoom-in" data-aos-delay="300">
                <Quote className="text-[#F5DAA7] mb-2" size={30} />
                <p className="text-white text-sm italic font-medium max-w-[200px]">
                  "We don't just cook; we create emotions on a plate."
                </p>
             </div>
          </div>

          <div className="space-y-8" data-aos="fade-left">
            <div className="space-y-2">
              <span className="text-[#842A3B] font-black uppercase text-[12px] tracking-widest">Since 2026</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-none">
                A Journey of <br /> Flavor and Passion.
              </h2>
            </div>
            <p className="text-gray-500 font-medium leading-relaxed">
              Founded in the heart of Bhopal, **Cravings** started with a simple mission: to bridge the gap between fine-dining artistry and the comfort of your home. We believe that every meal is an opportunity to celebrate life.
            </p>
            <div className="grid grid-cols-2 gap-6">
               <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#FDF6E3] rounded-lg text-[#842A3B]"><Leaf size={18}/></div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-wider">Organic Only</h4>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">Farm to Table Sourcing</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#FDF6E3] rounded-lg text-[#842A3B]"><Heart size={18}/></div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-wider">Made with Love</h4>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">Handcrafted Recipes</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. STATS SECTION: NUMBERS THAT MATTER --- */}
      <section className="py-20 bg-[#FDF6E3]/50">
        <div className="container mx-auto px-10 md:px-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={stat.id} className="text-center space-y-3" data-aos="fade-up" data-aos-delay={index * 150}>
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm mx-auto flex items-center justify-center text-[#842A3B]">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. THE CULINARY MASTERS --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-10 md:px-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8" data-aos="fade-down">
            <div className="space-y-2">
               <span className="font-black uppercase tracking-tight text-[#842A3B]">The Team</span>
               <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">Meet Our Chefs.</h2>
            </div>
            <p className="max-w-md text-gray-500 font-medium text-sm italic">
              Our kitchen is led by world-class chefs who have spent decades mastering the chemistry of spices and flavors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <ChefCard 
              img="https://www.hindustantimes.com/web-stories/famous-chefs-of-indian-kitchen-1277/assets/10.jpeg"
              name="Chef Arjun Sharma"
              role="Executive Chef"
              delay="0"
            />
            <ChefCard 
              img="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=500"
              name="Chef Maria Gomez"
              role="Pastry Specialist"
              delay="200"
            />
            <ChefCard 
              img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTySVC3Uw77-Sdxto796YhK5M06RYSalJ_kMA&s"
              name="Chef Vikram Singh"
              role="Spice Alchemist"
              delay="400"
            />
          </div>
        </div>
      </section>

      {/* --- 5. CALL TO ACTION --- */}
      <section className="py-24 bg-[#1a1a1a] relative overflow-hidden">
        <div className="container mx-auto px-10 text-center relative z-10" data-aos="zoom-in">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
            Taste the Magic <br /> <span className="text-[#F5DAA7]">Personally.</span>
          </h2>
          <button className="bg-[#842A3B] text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-[#662222] transition-all">
            Order Your First Experience
          </button>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#842A3B] rounded-full blur-[120px] opacity-20 -ml-32 -mt-32"></div>
      </section>

      <Footer />
    </div>
  );
};

/* --- UI Helper Component --- */
const ChefCard = ({ img, name, role, delay }) => (
  <div className="group space-y-6 text-center" data-aos="fade-up" data-aos-delay={delay}>
    <div className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-xl border-4 border-white transition-transform duration-700 group-hover:scale-95">
      <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={name} />
    </div>
    <div>
      <h4 className="text-xl font-black text-gray-900 tracking-tight">{name}</h4>
      <p className="text-[10px] font-bold text-[#842A3B] uppercase tracking-[0.2em] mt-1">{role}</p>
    </div>
  </div>
);

export default About;