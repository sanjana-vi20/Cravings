import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4500"; // Tumhara backend port

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Isse hum apni marzi se connect karenge (jaise login ke baad)
  withCredentials: true,
  transports: ['websocket', 'polling'] // Ye line add karo
});