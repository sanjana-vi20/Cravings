import React from "react";
import { useState } from "react";
import api from "../../config/Api";
import toast from "react-hot-toast";

const ForgetPasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [Loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSend] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (isOtpSent) {
        if (isOtpVerified) {
          res = await api.post("/auth/forgetPassword", formData);
          toast.success(res.data.message);
          onClose();
        } else {
          res = await api.post("/auth/verifyOtp", formData);
          toast.success(res.data.message);
          setIsOtpSend(true);
          setIsOtpVerified(true);
        }
      } else {
        console.log("Sending OTP");
        res = await api.post("/auth/getOtp", formData);
        toast.success(res.data.message);
        setIsOtpSend(true);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Unknown Error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex justify-center items-center">
        <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg">
          <div className="flex justify-between px-6 py-4 border-b border-gray-300 items-center sticky top-0 bg-white">
            <h2 className="text-xl font-semibold text-gray-800">
              Forget Password
            </h2>
            <button
              onClick={() => onClose()}
              className="text-gray-600 hover:text-red-600 text-2xl transition"
            >
              x
            </button>
          </div>

          <div className="p-6 flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 `}
                placeholder="Enter your email"
                disabled={isOtpSent}
              />
            </div>
            {isOtpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP *
                </label>
                <input
                  type="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className={`w-full border rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 `}
                  placeholder="Enter OTP "
                  disabled={isOtpVerified}
                />
              </div>
            )}

            {isOtpSent && isOtpVerified && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password *
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full border rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 `}
                    placeholder="Enter your newPassword"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full border rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 `}
                    placeholder="Enter your Password"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center p-5">
            <button
              onClick={handleSubmit}
              className=" px-6 py-2 rounded-xl font-semibold transition"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "#fff",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--color-primary-hover)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--color-primary)")
              }
            >
              {Loading ? (
                <>
                  <span></span> Loading...
                </>
              ) : isOtpSent ? (
                isOtpVerified ? (
                  "Update Password"
                ) : (
                  "verify OTP"
                )
              ) : (
                "Sent OTP"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPasswordModal;
