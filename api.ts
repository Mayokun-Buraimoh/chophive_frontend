import axios from "axios";
import {
  AddToCartPayload,
  BackendCartItem,
  Cart,
  FoodItem,
  UpdateUserProfilePayload,
  Order,
  DeliveryBatch,
  Hostel,
} from "./src/lib/interface";
// import { useAuth } from "./src/contexts/AuthContext";

const API_BASE_URL = "https://chophive-backend.onrender.com/api/v1"; // Updated to production backend

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
          `${API_BASE_URL}/user/token/refresh/`,
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
): Promise<{
  delivery_fee: string;
  service_fee: string;
  sub_total: string;
  total_amount: string;
}> => {
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
  userId,
  customerName,
  roomNumber,
  deliveryBatch,
  hostel,
}: {
  cartId: string | null;
  userId: string | null;
  customerName: string;
  hostel: string;
  deliveryTime?: string;
  roomNumber: number;
  deliveryBatch: string;
}) => {
  try {
    const res = await api.post(`/create-order/${cartId}/${userId}/`, {
      customer_name: customerName || "",
      room_number: roomNumber || 0,
      delivery_batch: deliveryBatch || "",
      hostel: hostel || "",
    });
    return res.data;
  } catch (error) {
    throw new Error("Failed to create order");
  }
};

export const deleteCart = async (cartId: string | null) => {
  if (!cartId) {
    throw new Error("Cart ID is required");
  }
  try {
    const res = await api.delete(`/cart/delete/${cartId}/`);
    return res.data;
  } catch (error) {
    throw new Error("Failed to delete cart");
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

export const fetchCategories = async () => {
  const res = await api.get("/category/");
  return res.data;
};

export const fetchFoodItems = async () => {
  const res = await api.get("/food-items/");
  return res.data;
};

export const fetchVendors = async () => {
  const res = await api.get("/vendor-list/");
  return res.data;
};

export const fetchCustomerOrders = async (
  userId: string | null
): Promise<Order[]> => {
  if (!userId) return [];
  const res = await api.get(`/customer/orders/${userId}/`);
  return res.data;
};

export const fetchOrderDetail = async (
  userId: string | null,
  orderOid: string
): Promise<Order> => {
  if (!userId) throw new Error("User ID is required");
  const res = await api.get(`/customer/order/detail/${userId}/${orderOid}/`);
  return res.data;
};

export const requestPasswordReset = async (email: string) => {
  const res = await api.get(`/user/password-reset/${email}/`);
  return res.data;
};

export const changePassword = async (payload: {
  otp: string;
  uidb64: string;
  reset_token: string;
  password: string;
}) => {
  const res = await api.post("/user/password-change/", payload);
  return res.data;
};

export const syncCartOnSignup = async (
  cartItems: Array<{
    food_item_id: number;
    quantity: number;
    price: string;
  }>
) => {
  const res = await api.post("/cart/sync-on-signup/", {
    cart_items: cartItems,
  });
  return res.data;
};

export const obtainToken = async (email: string, password: string) => {
  const res = await api.post("/user/token/", {
    email,
    password,
  });
  return res.data; // {access, refresh}
};

export const fetchDeliveryBatches = async (): Promise<DeliveryBatch[]> => {
  const res = await api.get("/delivery-batches/");
  return res.data;
};

export const fetchHostels = async (): Promise<Hostel[]> => {
  const res = await api.get("/hostels/");
  return res.data;
};

export default api;
