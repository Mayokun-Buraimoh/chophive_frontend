import axios from "axios";
import { AddToCartPayload, Cart, FoodItem } from "./src/lib/interface";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) return Promise.reject(error);

      try {
        const res = await axios.post(
          "http://localhost:8000/api/v1/user/token/refresh/",
          { refresh }
        );

        localStorage.setItem("access_token", res.data.access);
        error.config.headers.Authorization = `Bearer ${res.data.access}`;
        return api(error.config);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const FetchFoodItems = async (): Promise<FoodItem[]> => {
  const res = await api.get("/food-items/");
  return res.data;
};

export const fetchCart = async (): Promise<Cart> => {
  const res = await api.get("/cart-view/");
  return res.data;
};

export const addCartItem = async (payload: AddToCartPayload) => {
  const response = await api.post("/cart-view/", payload);
  return response.data;
};

export const updateCartItem = (cartItemId: number, quantity: number) =>
  api.patch(`/cart-detail/${cartItemId}/`, { quantity });

export const deleteCartItem = (cartItemId: number) =>
  api.delete(`/cart-delete/${cartItemId}/`);

export default api;
