export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_SERVER_URL
    : import.meta.env.VITE_SERVER_URL
