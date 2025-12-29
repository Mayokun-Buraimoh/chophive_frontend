export const getOrCreateCartId = (): string => {
  let cartId = localStorage.getItem("cart_id");
  if (!cartId) {
    cartId = crypto.randomUUID();
    localStorage.setItem("cart_id", cartId);
  }
  return cartId;
};
