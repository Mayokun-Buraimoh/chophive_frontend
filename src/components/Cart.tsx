import {
  X,
  Minus,
  Plus,
  Trash2,
  Loader2,
  MapPin,
  User,
  Home,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import {
  createOrder,
  fetchUserProfile,
  deleteCart,
  fetchDeliveryBatches,
  fetchHostels,
} from "../../api";
import { DeliveryBatch, Hostel, UserProfile } from "../lib/interface";

export default function Cart() {
  const navigate = useNavigate();

  const {
    isOpen,
    closeCart,
    deleteItem,
    cart,
    cartId,
    loading,
    increaseQuantity,
    decreaseQuantity,
    refreshCartId,
  } = useCart();

  const { userId, isAuthenticated } = useAuth();

  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [, setRoomNumber] = useState("");
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [deliveryBatches, setDeliveryBatches] = useState<DeliveryBatch[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `₦${numPrice.toFixed(2)}`;
  };

  const handleCheckoutClick = async () => {
    // Show address modal first
    setShowAddressModal(true);

    // Fetch user profile if authenticated
    if (isAuthenticated && userId) {
      setLoadingProfile(true);
      try {
        const profile: UserProfile = await fetchUserProfile(userId);
        const batches: DeliveryBatch[] = await fetchDeliveryBatches();
        const hostels: Hostel[] = await fetchHostels();
        setDeliveryBatches(batches);
        setHostels(hostels);
        if (profile.username) {
          setCustomerName(profile.username);
        }
        if (profile.room_number) {
          setRoomNumber(profile.room_number);
        }
        if (profile.hostel) {
          setSelectedHostel(
            hostels.find((h) => h.name === profile.hostel) || null
          );
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    }
  };

  const handleAddressSubmit = async () => {
    if (!customerName.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!selectedRoom) {
      alert("Please enter your room number");
      return;
    }
    if (!selectedHostel) {
      alert("Please enter your hostel");
      return;
    }
    if (!selectedBatch) {
      alert("Please select a delivery batch time");
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrder({
        cartId,
        userId,
        hostel: selectedHostel.name,
        customerName: customerName.trim(),
        roomNumber: Number(selectedRoom),
        deliveryBatch: selectedBatch,
      });

      // Delete cart after successful order creation
      if (cartId) {
        try {
          await deleteCart(cartId);
          // Refresh cartId after deletion so a new cart can be created
          await refreshCartId();
        } catch (error) {
          console.error("Failed to delete cart:", error);
          // Don't block navigation if cart deletion fails
        }
      }

      closeCart();
      setShowAddressModal(false);
      // Reset form fields
      setCustomerName("");
      setSelectedRoom(null);
      setSelectedHostel(null);
      setSelectedBatch(null);
      navigate(`/checkout/${order.order_oid}`);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#A32110]" />

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
          {cart && cart.item_count > 0 && (
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
                        {formatPrice(Number(item.subtotal))}
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
              <div className="">
                <div className="flex justify-between">
                  <span className="text-[#A32110] font-bold text-lg">
                    Total
                  </span>
                  <span className="text-[#A32110] font-bold text-lg">
                    {formatPrice(Number(cart?.total_amount || 0).toFixed(2))}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              className="w-full bg-[#A32110] hover:bg-[#A32110]/90 text-white h-12 text-base font-semibold"
              onClick={handleCheckoutClick}
            >
              Checkout
            </Button>
          </div>
        )}
      </div>

      {/* Checkout Information Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] rounded-2xl border border-gray-700 w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Checkout Information
              </h3>
              <button
                onClick={() => {
                  setShowAddressModal(false);
                  setCustomerName("");
                  setRoomNumber("");
                  setSelectedHostel(null);
                  setSelectedBatch(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {loadingProfile ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#A32110]" />
              </div>
            ) : (
              <>
                {/* Customer Name */}
                <div>
                  <label
                    htmlFor="customer-name"
                    className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"
                  >
                    <User className="w-4 h-4" />
                    Customer Name
                  </label>
                  <Input
                    id="customer-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A32110] focus:ring-[#A32110]"
                    autoFocus
                  />
                </div>

                {/*Hostel Dropdown*/}
                <div>
                  <label
                    htmlFor="hostel"
                    className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Hostel
                  </label>
                  <select
                    id="hostel"
                    title="Select Hostel"
                    value={selectedHostel?.name || ""}
                    onChange={(e) =>
                      setSelectedHostel(
                        hostels.find((h) => h.name === e.target.value) || null
                      )
                    }
                    className="w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-white shadow-sm transition-colors duration-150 focus:ring-2 focus:ring-[#A32110] focus:border-[#A32110] hover:border-[#A32110] placeholder-gray-500 appearance-none outline-none"
                  >
                    <option value="">Select your hostel</option>
                    {hostels.map((hostel) => (
                      <option
                        key={hostel.name}
                        value={hostel.name}
                        className="bg-gray-900"
                      >
                        {hostel.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room Number Dropdown */}
                <div>
                  <label
                    htmlFor="room-number"
                    className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"
                  >
                    <Home className="w-4 h-4" />
                    Room Number
                  </label>
                  <select
                    name="room_number"
                    id="room_number"
                    title="Select Room Number"
                    className="w-full rounded-md border border-gray-700 bg-gray-900/80 px-3 py-2 text-sm text-white shadow-sm transition-colors duration-150 focus:ring-2 focus:ring-[#A32110] focus:border-[#A32110] hover:border-[#A32110] placeholder-gray-500 appearance-none outline-none"
                    required
                    value={selectedRoom || ""}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                  >
                    <option value="">Select your room number</option>
                    {selectedHostel?.rooms.length === 0 && (
                      <option value="" disabled className="bg-gray-900">
                        No rooms available for this hostel
                      </option>
                    )}
                    {selectedHostel?.rooms.map((room) => (
                      <option key={room.id} value={room.number} className="bg-gray-900">
                        {room.number}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Batch Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Select Delivery Batch Time
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {deliveryBatches.map((batch) => (
                      <Button
                        key={batch.id}
                        type="button"
                        variant={
                          selectedBatch === batch.name ? "default" : "outline"
                        }
                        onClick={() => setSelectedBatch(batch.name)}
                        className={`h-12 ${
                          selectedBatch === batch.name
                            ? "bg-[#A32110] hover:bg-[#A32110]/90 text-white border-[#A32110]"
                            : "border-gray-700 text-gray hover:text-white hover:bg-gray-800"
                        }`}
                      >
                        {batch.name}
                      </Button>
                    ))}
                  </div>
                  {!selectedBatch && (
                    <p className="text-xs text-gray-500 mt-2">
                      Please select a delivery batch time
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddressModal(false);
                      setCustomerName("");
                      setSelectedRoom(null);
                      setSelectedHostel(null);
                      setSelectedBatch(null);
                    }}
                    className="flex-1 border-gray-700 text-gray hover:text-white hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddressSubmit}
                    disabled={
                      !selectedHostel ||
                      !customerName.trim() ||
                      !selectedRoom ||
                      !selectedBatch ||
                      isSubmitting
                    }
                    className="flex-1 bg-[#A32110] hover:bg-[#A32110]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                        Processing...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
