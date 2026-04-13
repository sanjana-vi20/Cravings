import React, { useState } from "react";
import api from '../../../config/Api'
import toast from "react-hot-toast";

const ResetPasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading ,setIsLoading] = useState(false);
  const [error ,setErrors] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async(e) =>{
    const newErrors = {}
    e.preventDefault();
    setIsLoading(true);

    if(formData.newPassword !== formData.confirmPassword)
    {
        newErrors.newPassword = "Password not Matched";
       setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    try {
        const res = await api.patch("/user/resetPassword" , formData);
    toast.success(res.data.message)
    } catch (error) {
        console.log(error); 
         toast.error(error?.response?.data?.message || "Unknown Error");
    }finally{
        setIsLoading(false);
    }

  }
  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex justify-center items-center">
        <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg">
          <div className="flex justify-between px-6 py-4 border-b border-gray-300 items-center sticky top-0 bg-white">
            <h2 className="text-xl font-semibold text-gray-800">
              Reset Password
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
                Old Password *
              </label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleInputChange}
                className={`w-full border rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 `}
                placeholder="Enter your oldPassword"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password *
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={`w-full border rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 `}
                placeholder="Enter your oldPassword"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full border rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 `}
                placeholder="Enter your oldPassword"
              />
            </div>
          </div>

          <div className="flex justify-center p-5">
            <button
              onClick={handleSubmit}
              className="mt-6 px-6 py-2 rounded-xl font-semibold transition"
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
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordModal;
