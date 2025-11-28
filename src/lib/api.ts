import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.usehaya.io/api/v2",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    throw {
      ...error,
      originalMessage: error.message,
      message: getErrorMessage(error),
    };
  }
);

export const getErrorMessage = (error: unknown, fallback?: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
