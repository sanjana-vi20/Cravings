import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../config/Api";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  ChevronRight,
  UserCircle,
  Truck,
  ChefHat,
  Trash2,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobnumber: "",
    password: "",
    confirmPass: "",
    role: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState({});

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleClear = () => {
    setFormData({
      fullName: "",
      email: "",
      mobnumber: "",
      password: "",
      confirmPass: "",
      role: "",
    });
    setValidationError({});
    toast.success("Form Cleared");
  };

  const validate = () => {
    let Error = {};
    if (formData.fullName.length < 3) Error.fullName = "Name is too short";
    if (
      !/^[\w\.]+@(gmail|outlook|ricr|yahoo)\.(com|in|co.in)$/.test(
        formData.email,
      )
    )
      Error.email = "Invalid email format";
    if (!/^[6-9]\d{9}$/.test(formData.mobnumber))
      Error.mobnumber = "Enter 10-digit Indian number";
    if (!formData.role) Error.role = "Please select a role";
    if (formData.password !== formData.confirmPass)
      Error.confirmPass = "Passwords don't match";

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
      toast.error("Please fill the form correctly");
      return;
    }
    try {
      const res = await api.post("/auth/register", formData);
      toast.success(res.data.message);
      handleClear();
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3]/40 py-16 px-4 flex justify-center items-center font-sans">
      <div
        className="w-full max-w-2xl bg-white rounded-[3rem] shadow-[0_25px_70px_rgba(132,42,59,0.08)] border border-white p-8 md:p-12"
        data-aos="zoom-in-up"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-[#842A3B]/5 rounded-2xl text-[#842A3B] mb-4">
            <User size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Create Account
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
            Join the Cravings Community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Role Selection (Single Row) */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
              I am registering as:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: "customer",
                  label: "Customer",
                  icon: <UserCircle size={20} />,
                },
                {
                  id: "manager",
                  label: "Manager",
                  icon: <ChefHat size={20} />,
                },
                { id: "partner", label: "Partner", icon: <Truck size={20} /> },
              ].map((role) => (
                <label
                  key={role.id}
                  className={`cursor-pointer flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    formData.role === role.id
                      ? "border-[#842A3B] bg-[#842A3B]/5 text-[#842A3B] shadow-sm"
                      : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.id}
                    className="hidden"
                    onChange={handleChange}
                    checked={formData.role === role.id}
                  />
                  {role.icon}
                  <span className="text-xs font-black uppercase">
                    {role.label}
                  </span>
                </label>
              ))}
            </div>
            {validationError.role && (
              <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">
                {validationError.role}
              </p>
            )}
          </div>

          {/* Form Fields - All in Column */}
          <div className="space-y-5">
            <InputGroup
              label="Full Name"
              icon={<User size={18} />}
              name="fullName"
              placeholder="Enter your name"
              value={formData.fullName}
              onChange={handleChange}
              error={validationError.fullName}
              disabled={isLoading}
            />
            <InputGroup
              label="Email Address"
              icon={<Mail size={18} />}
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              error={validationError.email}
              disabled={isLoading}
            />
            <InputGroup
              label="Mobile Number"
              icon={<Phone size={18} />}
              name="mobnumber"
              placeholder="91XXXXXXXX"
              value={formData.mobnumber}
              onChange={handleChange}
              error={validationError.mobnumber}
              disabled={isLoading}
              type="number"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputGroup
                label="Password"
                icon={<Lock size={18} />}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                type="password"
              />
              <InputGroup
                label="Confirm Password"
                icon={<Lock size={18} />}
                name="confirmPass"
                placeholder="••••••••"
                value={formData.confirmPass}
                onChange={handleChange}
                error={validationError.confirmPass}
                disabled={isLoading}
                type="password"
              />
            </div>
          </div>

          {/* Buttons Stack */}
          <div className="space-y-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#842A3B] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-[#842A3B]/20 hover:bg-[#662222] transition-all flex items-center justify-center gap-3 group"
            >
              {isLoading ? (
                "Creating Account..."
              ) : (
                <>
                  Sign Up Now{" "}
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="w-full py-3 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-red-500 flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 size={14} /> Clear Form
            </button>
          </div>

          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[#842A3B] hover:underline text-[15px] font-black ml-1"
              >
                Log In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

const InputGroup = ({
  label,
  icon,
  name,
  placeholder,
  value,
  onChange,
  error,
  disabled,
  type = "text",
}) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
      {label}
    </label>
    <div
      className={`group flex items-center border-2 px-5 py-3.5 rounded-2xl transition-all ${error ? "border-red-100 bg-red-50/30" : "border-slate-50 bg-slate-50 focus-within:border-[#842A3B]/20 focus-within:bg-white focus-within:shadow-sm"}`}
    >
      <span className="text-slate-400 group-focus-within:text-[#842A3B] transition-colors">
        {icon}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 w-full px-3 text-sm font-bold text-slate-700 placeholder:text-slate-300"
      />
    </div>
    {error && (
      <p className="text-[9px] text-red-500 font-black ml-2 uppercase tracking-wide">
        {error}
      </p>
    )}
  </div>
);

export default Register;
