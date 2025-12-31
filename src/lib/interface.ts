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
  delivery_fee?: string;
  service_fee?: string;
  cart_id: string | null;
  user_id: string | null;
}


// What backend ACTUALLY returns
export interface BackendCartItem {
  id: number;
  food_item: FoodItem;
  qty: number;
  price: string;
  sub_total: string;
  cart_id: string | null;
  created_at: string;
  updated_at: string;
}
export interface AddToCartPayload {
    item_id: number;
    user_id: string | null;
    qty: number;
    price: string;
    // cart_id: string | null;
}
  
export interface Vendor {
  id: number;
  name: string;
  description: string;
  address: string;
  logo: string;
  is_active: boolean;
  slug: string;
  created_at: string;
  user: User;
}
export interface Category{
  id: number;
  name: string;
  description: string;
  created_at: string;
  slug: string;
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
  delivery_fee: string;
  service_fee: string;
  total: string;
  payment_status: string;
  delivery_address: string;
  created_at: string;
}



//IndexedDB Schema
export interface GuestCartItem {
  id?: number;
  cart_id: string;

  food_item_id: number; // 👈 flat index key

  food_item: FoodItem;

  qty: number;
  price: string;
  sub_total: string;
  delivery_fee: string;
  service_fee: string;
  total: string;

  created_at: string;
  updated_at: string;
}
