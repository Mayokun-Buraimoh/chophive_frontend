import { Cart, CartItem, GuestCartItem } from "../lib/interface";

export function mapGuestCartToCart(
  items: GuestCartItem[],
  cartId: string
): Cart {
  const cartItems: CartItem[] = items.map((item) => ({
    id: item.id ?? Date.now(), // IndexedDB id fallback
    food_item: item.food_item,
    quantity: item.qty,
    price: item.price,
    subtotal: item.sub_total,
  }));

  const total = cartItems.reduce((sum, i) => sum + Number(i.subtotal), 0);

  return {
    items: cartItems,
    item_count: cartItems.length,
    total_amount: total.toFixed(2),
    cart_id: cartId,
    user_id: null,
  };
}


