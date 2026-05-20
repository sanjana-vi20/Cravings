import axios from "axios";
// import { Import } from "lucide-react";

const axiosInstance = axios.create({
    baseURL : import.meta.env.VITE_BACKEND_URL,
    withCredentials:true,
})

export default axiosInstance;