import { v4 as uuidv4 } from "uuid";

export const getOrCreateCartId = (): string => {
  let cartId = localStorage.getItem("cart_id");
  if (!cartId) {
    cartId = crypto.randomUUID();
    localStorage.setItem("cart_id", cartId);
  }
  return cartId;
};

export const getGuestCartId = () => {
  let id = localStorage.getItem("guest_cart_id");
  if (!id) {
    id = uuidv4();
    localStorage.setItem("guest_cart_id", id);
  }
  return id;
};


