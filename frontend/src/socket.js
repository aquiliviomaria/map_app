import { io } from "socket.io-client";

// Em desenvolvimento: backend local. Em produção: substituir pelo URL do Fly.io
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const socket = io(BACKEND_URL, {
  autoConnect: true,
});

export default socket;
