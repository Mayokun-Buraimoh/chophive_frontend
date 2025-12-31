import axios from "axios";
import {
  AddToCartPayload,
  BackendCartItem,
  Cart,
  CartItem,
  FoodItem,
  UpdateUserProfilePayload,
} from "./src/lib/interface";
// import { useAuth } from "./src/contexts/AuthContext";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies (session) with requests
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
          { refresh },
          { withCredentials: true }
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

export const updateUserProfile = async (
  userId: string | null,
  profileData: Partial<Omit<UpdateUserProfilePayload, "pid" | "user">>
) => {
  const res = await api.patch(`/user/profile/${userId}/`, profileData);
  return res.data;
};

export const FetchFoodItems = async (): Promise<FoodItem[]> => {
  const res = await api.get("/food-items/");
  return res.data;
};

export const getCartId = async (
  userId: string | null
): Promise<string | null> => {
  if (!userId) return null;

  const res = await api.get(`/get-cart_id/${userId}`);
  return res.data?.cart_id ?? null;
};

export const fetchCartDetails = async (
  cartId: string | null,
  userId: string | null
): Promise<{ delivery_fee: string; service_fee: string; sub_total: string; total_amount: string }> => {
  if (!cartId) {
    return {
      delivery_fee: "0.00",
      service_fee: "0.00",
      sub_total: "0.00",
      total_amount: "0.00",
    };
  }

  const url = userId 
    ? `/cart-detail/${cartId}/${userId}/`
    : `/cart-detail/${cartId}/`;
  const res = await api.get(url);
  return {
    delivery_fee: res.data.delivery_fee?.toString() || "0.00",
    service_fee: res.data.service_fee?.toString() || "0.00",
    sub_total: res.data.sub_total?.toString() || "0.00",
    total_amount: res.data.total_amount?.toString() || "0.00",
  };
};

export const fetchCart = async (
  cartId: string | null,
  userId: string | null
): Promise<Cart> => {
  const url = `/cart-list/${cartId}/${userId}/`;
  const res = await api.get(url);
  const backendItems = res.data as BackendCartItem[];

  // Fetch cart details for delivery_fee and service_fee
  const cartDetails = await fetchCartDetails(cartId, userId);

  if (!backendItems.length) {
    return {
      items: [],
      item_count: 0,
      total_amount: "0.00",
      delivery_fee: cartDetails.delivery_fee,
      service_fee: cartDetails.service_fee,
      cart_id: cartId,
      user_id: userId,
    };
  }

  return {
    items: backendItems.map((item) => ({
      id: item.id,
      food_item: item.food_item,
      quantity: item.qty,
      price: item.price,
      subtotal: item.sub_total,
    })),
    item_count: backendItems.length,
    total_amount: backendItems
      .reduce((sum, i) => sum + Number(i.sub_total), 0)
      .toFixed(2),
    delivery_fee: cartDetails.delivery_fee,
    service_fee: cartDetails.service_fee,
    cart_id: backendItems[0].cart_id,
    user_id: userId,
  };
};

export const addCartItem = async (payload: AddToCartPayload) => {
  const response = await api.post("/cart-view/", payload);
  return response.data;
};

export const updateCartItemQuantity = async ({
  cartItemId,
  quantity,
  userId,
}: {
  cartItemId: number;
  quantity: number;
  userId?: string | null;
}) => {
  const response = await api.patch(`/cart-item-update/${cartItemId}/`, {
    quantity,
    user_id: userId,
  });
  return response.data;
};

export const deleteCartItem = async ({
  cartId,
  cartItemId,
  userId,
}: {
  cartId: string | null;
  cartItemId: number;
  userId?: string | null;
}) => {
  const url = `/cart-delete/${cartId}/${cartItemId}/${userId}/`;
  return api.delete(url);
};

export const createOrder = async ({
  cartId,
  deliveryAddress,
  userId,
  customerName,
  roomAddress,
  deliveryTime,
  deliveryBatch,
}: {
  cartId: string | null;
  deliveryAddress: string;
  userId: string | null;
  customerName?: string;
  roomAddress?: string;
  deliveryTime?: string;
  deliveryBatch?: "1pm" | "6pm";
}) => {
  try {
    const res = await api.post(`/create-order/${cartId}/${userId}/`, {
      delivery_address: deliveryAddress,
      customer_name: customerName || "",
      room_address: roomAddress || "",
      delivery_time: deliveryTime || "",
      delivery_batch: deliveryBatch || "",
    });
    return res.data;
  } catch (error) {
    throw new Error("Failed to create order");
  }
};

export const getCheckout = async (orderOid: string) => {
  try {
    const res = await api.get(`/checkout/${orderOid}/`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to load checkout details");
  }
};

export const fetchCategory = async () => {
  const res = await api.get("/category/");
  return res.data;
};

export const fetchVendors = async () => {
  const res = await api.get("/vendor-list/");
  return res.data;
};

export default api;