import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Cart } from "../lib/interface";
import api, {
  fetchCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
} from "../../api";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cart: Cart | null;
  isOpen: boolean;
  loading: boolean;
  // cartId: string | null;

  openCart: () => void;
  closeCart: () => void;

  addToCart: (
    foodItem: {
      id: number;
      price: string;
    },
    quantity: number
  ) => Promise<void>;
  increaseQuantity: (cartItemId: number) => Promise<void>;
  decreaseQuantity: (cartItemId: number) => Promise<void>;
  deleteItem: (cartItemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userId, isAuthenticated } = useAuth();

  const loadCart = async () => {
    setLoading(true);
    try {
      if (!isAuthenticated) {
        console.warn("No user_id found. User not authenticated.");
      }
      console.log("Fetching cart...");
      const data = await fetchCart("555", userId);
      setCart(data);
      console.log("Cart loaded:", data);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadCart();
  }, [isOpen]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // ---------------- CART ACTIONS ----------------
  const addToCart = async (
    foodItem: {
      id: number;
      price: string;
    },
    quantity = 1
  ) => {
    try {
      console.log("user_id: " + userId);
      if (!isAuthenticated) {
        console.warn("No user_id found. User not authenticated.");
      }

      // if (!cartId) {
      //   console.warn("Cart not initialized yet");
      //   return;
      // }

      const payload = {
        item_id: foodItem.id,
        user_id: isAuthenticated ? userId : null,
        qty: quantity,
        price: foodItem.price,
        // shipping_amount: "500.00",
        // service_fee: "200.00",
        cart_id: null,
      };

      console.log(payload);

      await addCartItem(payload);
      await loadCart();
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  const increaseQuantity = async (cartItemId: number) => {
    // if (!cartId) {
    //   console.warn("Cart not initialized yet");
    //   return;
    // }
    const item = cart?.items.find((i) => i.id === cartItemId);
    if (!item) return;

    await updateCartItem(cartItemId, item.quantity + 1);
    await loadCart();
  };

  const decreaseQuantity = async (cartItemId: number) => {
    // if (!cartId) {
    //   console.warn("Cart not initialized yet");
    //   return;
    // }
    const item = cart?.items.find((i) => i.id === cartItemId);
    if (!item) return;

    if (item.quantity <= 1) {
      await deleteCartItem({
        cartId : "555",
        cartItemId,
        userId,
      });
    } else {
      await updateCartItem(cartItemId, item.quantity - 1);
    }

    await loadCart();
  };

  const deleteItem = async (cartItemId: number) => {
    try {
      // if (!cartId) {
      //   console.warn("Cart not initialized yet");
      //   return;
      // }
      await deleteCartItem({
        cartId : "555",
        cartItemId,
        userId,
      });

      await loadCart();
    } catch (error) {
      console.error("Delete cart item failed:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        loading,
        // cartId,
        openCart,
        closeCart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        deleteItem,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
