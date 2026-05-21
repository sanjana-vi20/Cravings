import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL; // Tumhara backend port

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Isse hum apni marzi se connect karenge (jaise login ke baad)
  withCredentials: true,
  transports: ['websocket', 'polling'] // Ye line add karo
});