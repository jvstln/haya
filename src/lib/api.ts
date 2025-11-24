import axios from "axios";

export const api = axios.create({
  // baseURL: "https://haya-backend-nu.vercel.app/api/v1",
  // baseURL: "https://haya-backend-1.onrender.com/api/v1",
  // baseURL: "http://89.168.47.6:3001/api/v2",
  baseURL: "https://api.usehaya.io/api/v2",
});
