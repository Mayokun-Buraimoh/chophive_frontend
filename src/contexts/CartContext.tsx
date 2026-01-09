import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Cart, FoodItem } from "../lib/interface";
import {
  fetchCart,
  addCartItem,
  deleteCartItem,
  getCartId,
  updateCartItemQuantity,
} from "../../api";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cart: Cart | null;
  isOpen: boolean;
  loading: boolean;
  cartId: string | null;

  openCart: () => void;
  closeCart: () => void;

  addToCart: (food: FoodItem, quantity: number) => Promise<void>;
  increaseQuantity: (cartItemId: number) => Promise<void>;
  decreaseQuantity: (cartItemId: number) => Promise<void>;
  deleteItem: (cartItemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  refreshCartId: () => Promise<void>;
  getItemQuantity: (foodItemId: number) => number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userId, isAuthenticated } = useAuth();

  const loadCartId = async () => {
    if (!isAuthenticated) {
      setCartId(null);
      return;
    }
    const id = await getCartId(userId);
    setCartId(id);
    console.log("id: ", id);
  };

  useEffect(() => {
    loadCartId();
  }, [isAuthenticated, userId]);

  const loadCart = async () => {
    setLoading(true);
    try {
      if (!isAuthenticated) {
        setCart(null);
        return;
      }
      console.log("Fetching cart...", cartId);
      const data = await fetchCart(cartId, userId);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Load cart on mount and when cartId changes to show count at all times
  useEffect(() => {
    if (cartId || !isAuthenticated) {
      loadCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartId, isAuthenticated]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // ---------------- CART ACTIONS ----------------
  const addToCart = async (food: FoodItem, quantity = 1) => {
    try {
      console.log("user_id: " + userId);
      if (!isAuthenticated) {
        console.warn("No user_id found. User not authenticated.");
        return;
      }

      // If cartId is null, refresh it first (handles case after cart deletion)
      let currentCartId = cartId;
      if (!currentCartId) {
        await loadCartId();
        currentCartId = await getCartId(userId);
      }

      const payload = {
        item_id: food.id,
        user_id: isAuthenticated ? userId : null,
        qty: quantity,
        price: food.price,
      };

      console.log(payload);

      try {
        await addCartItem(payload);
        await loadCart();
      } catch (error) {
        // If cart not found error, refresh cartId and retry
        const axiosError = error as { response?: { status?: number } };
        if (
          axiosError.response?.status === 404 ||
          axiosError.response?.status === 400
        ) {
          console.log("Cart not found, refreshing cartId and retrying...");
          await loadCartId();
          const newCartId = await getCartId(userId);
          if (newCartId) {
            await addCartItem(payload);
            await loadCart();
          }
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  const increaseQuantity = async (cartItemId: number) => {
    if (!cart) return;

    if (!isAuthenticated) return;

    const item = cart.items.find((i) => i.id === cartItemId);
    if (!item) return;

    const payload = {
      item_id: item.food_item.id,
      user_id: userId,
      qty: 1,
      price: item.price,
    };

    await addCartItem(payload);
    await loadCart();
  };

  const decreaseQuantity = async (cartItemId: number) => {
    if (!cart) return;

    if (!isAuthenticated) return;

    const item = cart.items.find((i) => i.id === cartItemId);
    if (!item) return;

    const newQty = item.quantity - 1;

    if (newQty <= 0) {
      await deleteCartItem({
        cartId,
        cartItemId,
        userId,
      });
    } else {
      // Use the PATCH endpoint to update quantity directly
      await updateCartItemQuantity({
        cartItemId,
        quantity: newQty,
        userId,
      });
    }

    await loadCart();
  };

  const deleteItem = async (cartItemId: number) => {
    if (!cartId && isAuthenticated) {
      console.warn("Cart not initialized yet");
      return;
    }

    try {
      if (!isAuthenticated) return;

      // 👉 AUTHENTICATED USER FLOW
      await deleteCartItem({
        cartId,
        cartItemId,
        userId,
      });

      await loadCart();
    } catch (error) {
      console.error("Delete cart item failed:", error);
    }
  };

  const refreshCartId = async () => {
    await loadCartId();
  };

  const getItemQuantity = (foodItemId: number): number => {
    if (!cart || !cart.items) return 0;
    const item = cart.items.find((i) => i.food_item.id === foodItemId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        loading,
        cartId,
        openCart,
        closeCart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        deleteItem,
        refreshCart: loadCart,
        refreshCartId,
        getItemQuantity,
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
