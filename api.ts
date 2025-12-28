import axios from "axios";
import {
  AddToCartPayload,
  BackendCartItem,
  Cart,
  CartItem,
  FoodItem,
} from "./src/lib/interface";
// import { useAuth } from "./src/contexts/AuthContext";

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

export const fetchUserProfile = async (userId: string | null) => {
  const res = await api.get(`/user/profile/${userId}/`);
  return res.data;
};

export const FetchFoodItems = async (): Promise<FoodItem[]> => {
  const res = await api.get("/food-items/");
  return res.data;
};

export const fetchCart = async (): Promise<Cart> => {
  const res = await api.get("/cart-view/");
  const backendItems = res.data as BackendCartItem[];

  if (backendItems.length === 0) {
    return {
      items: [],
      item_count: 0,
      total_amount: "0.00",
      cart_id: null,
    };
  }

  const cart_id = backendItems[0].cart_id;

  const items: CartItem[] = backendItems.map((item) => ({
    id: item.id, // ✅ CartItem.id (THIS is item_id)
    food_item: item.food_item,
    quantity: item.qty,
    price: item.price,
    subtotal: item.sub_total,
  }));

  const total_amount = items
    .reduce((sum, item) => sum + Number(item.subtotal), 0)
    .toFixed(2);

  return {
    items,
    item_count: items.length,
    total_amount,
    cart_id,
  };
};


export const addCartItem = async (payload: AddToCartPayload) => {
  const response = await api.post("/cart-view/", payload);
  return response.data;
};

export const updateCartItem = (cartItemId: number, quantity: number) =>
  api.patch(`/cart-detail/${cartItemId}/`, { qty: quantity });

export const deleteCartItem = async ({
  cartId,
  cartItemId,
  userId,
}: {
  cartId: string;
  cartItemId: number;
  userId?: string | null;
}) => {
  const url = userId
    ? `/cart-delete/${cartId}/${cartItemId}/${userId}/`
    : `/cart-delete/${cartId}/${cartItemId}/`;

  return api.delete(url);
};

export const createOrder = async ({
  cartId,
  deliveryAddress,
  userId,
}: {
  cartId: string;
  deliveryAddress: string;
  userId: string | null;
}) => {
  try {
    const res = await api.post(`/create-order/${cartId}/${userId}/`, {
      delivery_address: deliveryAddress,
    });
    return res.data;
  } catch (error) {
    throw new Error("Failed to create order");
  }
};

export const getCheckout = async (orderOid: string) => {
  try {
    const res = api.get(`/checkout/${orderOid}`);
    return (await res).data;
  } catch (error) {
    throw new Error("Failed to checkout");
    console.error(error);
  }
};

export default api;
