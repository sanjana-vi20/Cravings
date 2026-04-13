import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../config/Api";
import { useNavigate } from "react-router-dom";
import { BsSend } from "react-icons/bs";
import { FiLock, FiMail } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";
import ForgetPasswordModal from "../components/publicModals/ForgetPasswordModal.jsx";

function Login() {
  const { setUser, setIsLogin, setRole } = useAuth();
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState({});

  const handleClear = () => {
    setFormData({ email: "", password: "" });
  };

  const validate = () => {
    let Error = {};
    if (!/^[\w\.]+@(gmail|outlook|ricr|yahoo)\.(com|in|co.in)$/.test(formData.email)) {
      Error.email = "Please use a valid email format";
    }
    setValidationError(Error);
    return Object.keys(Error).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validate()) {
      setIsLoading(false);
      toast.error("Please fill the form");
      return;
    }

    try {
      const res = await api.post("/auth/login", formData);
      toast.success(res.data.message);
      setUser(res.data.data);
      setIsLogin(true);
      sessionStorage.setItem("CravingUser", JSON.stringify(res.data.data));
      
      handleClear();
      
      const role = res.data.data.role;
      setRole(role);
      
      const dashboardMap = {
        manager: "/restaurant-dashboard",
        partner: "/ride-dashboard",
        customer: "/user-dashboard",
        admin: "/admin-dashboard"
      };
      
      navigate(dashboardMap[role] || "/");

    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 font-sans text-[#1a1a1a]">
      <div className="w-full max-w-xl">
        
        {/* Header Section */}
        <div className="text-center mb-10 space-y-2">
          <h1 className="text-5xl font-black tracking-tighter leading-none text-gray-900">
            Welcome <span className="text-[#842A3B]">Back.</span>
          </h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Login to your craving account
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                Email Address
              </label>
              <div className="relative group text-[#1a1a1a]">
                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#842A3B] transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  className="w-full bg-[#FAF7F2] p-5 pl-14 rounded-2xl outline-none border-2 border-transparent focus:border-[#842A3B]/10 focus:bg-white transition-all font-bold text-sm"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {validationError.email && (
                <span className="text-[10px] font-black text-red-500 ml-2 uppercase tracking-tight">
                  {validationError.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                Password
              </label>
              <div className="relative group">
                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#842A3B] transition-colors" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full bg-[#FAF7F2] p-5 pl-14 rounded-2xl outline-none border-2 border-transparent focus:border-[#842A3B]/10 focus:bg-white transition-all font-bold text-sm"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="flex justify-end pr-2">
                <button
                  type="button"
                  onClick={() => setIsForgetPassword(true)}
                  className="text-[10px] font-black text-[#842A3B] uppercase border-b border-transparent hover:border-[#842A3B] transition-all"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#842A3B] text-white p-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-[#842A3B]/20 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:scale-100 transition-all"
            >
              {isLoading ? (
                <span className="animate-pulse">Authenticating...</span>
              ) : (
                <>
                  <BsSend size={16} /> 
                  Enter Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-10 text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">
              New to Craving?{" "}
              <button
                className="text-[#842A3B] font-black hover:underline underline-offset-4"
                onClick={() => navigate("/register")}
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>

      {isForgetPassword && (
        <ForgetPasswordModal onClose={() => setIsForgetPassword(false)} />
      )}
    </div>
  );
}

export default Login;