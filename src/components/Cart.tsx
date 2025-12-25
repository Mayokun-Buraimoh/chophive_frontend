import { X, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useCart } from "../contexts/CartContext";

export default function Cart() {
  console.log("🛒 Cart component mounted");

  const navigate = useNavigate();

  const {
    isOpen,
    closeCart,
    deleteItem,
    cart,
    loading,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle opening animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to trigger the animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match the transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close cart on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeCart]);

  if (!shouldRender) return null;

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:z-50 transition-opacity duration-300 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#1E1E1E] z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ease-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Orange accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B35]" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            Cart ({cart?.item_count})
          </h2>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          )}
          {!loading && (!cart || cart?.item_count === 0) && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-400 text-lg mb-2">Your cart is empty</p>
              <p className="text-gray-500 text-sm">
                Add some delicious meals to get started!
              </p>
            </div>
          )}
          {!loading && cart && cart.item_count > 0 && (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b border-gray-800 last:border-b-0"
                >
                  {/* Item Image */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gray-800 overflow-hidden">
                      {item.food_item.image ? (
                        <img
                          src={item.food_item.image}
                          alt={item.food_item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🍔
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="text-white font-semibold text-base md:text-lg mb-1">
                        {item.food_item.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {item.food_item.description}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.quantity === 1 ? (
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-red-600/20 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                        )}
                        <span className="text-white font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-white font-bold text-lg">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        {cart?.items && cart?.items.length > 0 && (
          <div className="border-t border-gray-800 p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(Number(cart?.total_amount))}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Delivery Fee</span>
                <span>10.00</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Tax</span>
                <span>10.00</span>
              </div>
              <div className="border-t border-gray-700 pt-3">
                <div className="flex justify-between">
                  <span className="text-[#FF6B35] font-bold text-lg">
                    Total
                  </span>
                  <span className="text-[#FF6B35] font-bold text-lg">
                    {formatPrice(Number(cart?.total_amount) + 10.0 + 10.0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white h-12 text-base font-semibold"
              onClick={() => {
                closeCart();
                navigate("/checkout");
              }}
            >
              Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
