export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  date_joined: string;
  password: string;
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

export type CartItem = {
  id: number;
  cart: number;
  food_item: FoodItem;
  quantity: number;
  price: string;
  subtotal: string;
  created_at: string;
  updated_at: string;
};

export type Cart = {
  id: number;
  items: CartItem[];
  total_amount: string;
  item_count: number;
  created_at: string;
  updated_at: string;
};

export interface AddToCartPayload {
    item_id: number;
    user_id: string | null;
    qty: number;
    price: string;
    shipping_amount: string;
    service_fee: string;
    cart_id: string;
  }