import axios from "axios";

export const api = axios.create({
  baseURL: "https://haya-backend-nu.vercel.app/api/v1",
});
