import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Cart } from "../lib/interface";
import {
  fetchCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
} from "../../api";

interface CartContextType {
  cart: Cart | null;
  isOpen: boolean;
  loading: boolean;

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

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await fetchCart();
      setCart(data);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

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
      const userId = localStorage.getItem("user_id");
      console.log("user_id: " + userId)
      const payload = {
        item_id: foodItem.id,
        user_id: userId,
        qty: quantity,
        price: foodItem.price,
        shipping_amount: "500.00",
        service_fee: "200.00",
        cart_id: localStorage.getItem("cart_id")!,
      };
console.log(payload);

      await addCartItem(payload);
      await loadCart();
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  const increaseQuantity = async (cartItemId: number) => {
    const item = cart?.items.find((i) => i.id === cartItemId);
    if (!item) return;

    await updateCartItem(cartItemId, item.quantity + 1);
    await loadCart();
  };

  const decreaseQuantity = async (cartItemId: number) => {
    const item = cart?.items.find((i) => i.id === cartItemId);
    if (!item) return;

    if (item.quantity <= 1) {
      await deleteCartItem(cartItemId);
    } else {
      await updateCartItem(cartItemId, item.quantity - 1);
    }

    await loadCart();
  };

  const deleteItem = async (cartItemId: number) => {
    await deleteCartItem(cartItemId);
    await loadCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        loading,
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
