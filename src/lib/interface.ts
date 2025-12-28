export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  date_joined: string;
  password: string;
}

export interface UserProfile {
  id: number;
  username: string;
  address: string;
  gender: string;
  image: string;
  date_of_birth: string;
  hostel: string;
  room_number: string;
  phone: string;
  level: number;
  department: string;
  favorite_cafeteria: string;
  dietary_preferences: string;
  created_at: string;
  updated_at: string;
  user: User;
}


export type FoodItem = {
  id: number;
  vendor: number;
  vendor_name: string;
  vendor_slug: string;
  name: string;
  slug: string;
  description: string;
  price: string; // backend sends string
  image: string;
  is_available: boolean;
  stock_qty: number;
  item_id: string;
  created_at: string;
  updated_at: string;
};

export interface CartItem {
  id: number;
  food_item: FoodItem;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface Cart {
  items: CartItem[];
  item_count: number;
  total_amount: string;
  cart_id: string | null;
}


// What backend ACTUALLY returns
export interface BackendCartItem {
  id: number;
  food_item: FoodItem;
  qty: number;
  price: string;
  sub_total: string;
  cart_id: string;
  created_at: string;
  updated_at: string;
}
export interface AddToCartPayload {
    item_id: number;
    user_id: string | null;
    qty: number;
    price: string;
    shipping_amount: string;
    service_fee: string;
    cart_id: string | null;
}
  
export interface Vendor {
  id: number;
  username: string;
}
export interface OrderItem {
  id: number;
  quantity: number;
  total: string;
  food_item: FoodItem;
  vendor: Vendor;
}

export interface Checkout {
  oid: string;
  order_item: OrderItem[];
  sub_total: string;
  service_fee: string;
  total: string;
  payment_status: string;
  delivery_address: string;
  created_at: string;
}