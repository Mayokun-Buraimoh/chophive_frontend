import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ToastContainer from "../components/ToastContainer";
import { useCart } from "../contexts/CartContext";
import {
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Wallet,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { checkoutSchema, type CheckoutFormData } from "../lib/validations";
import type { Toast } from "../components/ui/toast";
import { BsPaypal } from "react-icons/bs";

function Checkout() {
  const navigate = useNavigate();
  const {
    items,
    getSubtotal,
    getDeliveryFee,
    getTax,
    getTotal,
    closeCart,
    clearCart,
  } = useCart();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "card",
    },
  });

  const paymentMethod = watch("paymentMethod");

  const addToast = (message: string, type: "error" | "success" | "info") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Checkout data:", data);
      // Clear cart and redirect to success page
      clearCart();
      closeCart();
      navigate("/order-success");
    } catch (error) {
      console.error("Checkout error:", error);
      addToast("Failed to process your order. Please try again.", "error");
    }
  };

  const onError = (errors: any) => {
    // Show error toast for form validation errors
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const firstError = errors[errorFields[0]] as any;
      if (firstError?.message) {
        addToast(firstError.message, "error");
      } else {
        addToast("Please fill in all required fields correctly.", "error");
      }
    } else {
      addToast("Please fill in all required fields correctly.", "error");
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#1E1E1E]">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-400 mb-8">
              Add some items to your cart before checkout
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Cart
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Checkout
                </h1>
                <p className="text-gray-400">
                  Complete your order by filling in the details below
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Delivery Information */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-[#FF6B35]" />
                    Delivery Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Full Name
                      </label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        className={`bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 ${
                          errors.fullName
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                        {...register("fullName")}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          className={`pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 ${
                            errors.email
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                          {...register("email")}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          className={`pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 ${
                            errors.phone
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                          {...register("phone")}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Street Address
                      </label>
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        className={`bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 ${
                          errors.address
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                        {...register("address")}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        City
                      </label>
                      <Input
                        id="city"
                        placeholder="New York"
                        className={`bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 ${
                          errors.city
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                        {...register("city")}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        State
                      </label>
                      <Input
                        id="state"
                        placeholder="NY"
                        className={`bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 ${
                          errors.state
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                        {...register("state")}
                      />
                      {errors.state && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.state.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="zipCode"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        ZIP Code
                      </label>
                      <Input
                        id="zipCode"
                        placeholder="10001"
                        className={`bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 ${
                          errors.zipCode
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                        {...register("zipCode")}
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.zipCode.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="deliveryInstructions"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        id="deliveryInstructions"
                        rows={3}
                        placeholder="Leave at door, ring bell, etc."
                        className="w-full rounded-md border border-gray-700 bg-gray-900/50 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] resize-none"
                        {...register("deliveryInstructions")}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-[#FF6B35]" />
                    Payment Method
                  </h2>
                  <div className="space-y-4">
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-700/50 border-gray-700">
                      <input
                        type="radio"
                        value="card"
                        className="w-4 h-4 text-[#FF6B35] border-gray-600 bg-gray-900 focus:ring-[#FF6B35]"
                        {...register("paymentMethod")}
                      />
                      <div className="ml-4 flex items-center flex-1">
                        <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-white font-medium">
                          Credit/Debit Card
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-700/50 border-gray-700">
                      <input
                        type="radio"
                        value="cash"
                        className="w-4 h-4 text-[#FF6B35] border-gray-600 bg-gray-900 focus:ring-[#FF6B35]"
                        {...register("paymentMethod")}
                      />
                      <div className="ml-4 flex items-center flex-1">
                        <Wallet className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-white font-medium">
                          Cash on Delivery
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-700/50 border-gray-700">
                      <input
                        type="radio"
                        value="paypal"
                        className="w-4 h-4 text-[#FF6B35] border-gray-600 bg-gray-900 focus:ring-[#FF6B35]"
                        {...register("paymentMethod")}
                      />
                      <div className="ml-4 flex items-center flex-1">
                        <BsPaypal className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-white font-medium">PayPal</span>
                      </div>
                    </label>
                  </div>

                  {/* Card Details */}
                  {paymentMethod === "card" && (
                    <div className="mt-6 pt-6 border-t border-gray-700 space-y-4">
                      <div>
                        <label
                          htmlFor="cardNumber"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Card Number
                        </label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          className={`bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 ${
                            errors.cardNumber
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                          {...register("cardNumber")}
                        />
                        {errors.cardNumber && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.cardNumber.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="cardName"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Cardholder Name
                        </label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          className={`bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 ${
                            errors.cardName
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : ""
                          }`}
                          {...register("cardName")}
                        />
                        {errors.cardName && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.cardName.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="cardExpiry"
                            className="block text-sm font-medium text-gray-300 mb-2"
                          >
                            Expiry Date
                          </label>
                          <Input
                            id="cardExpiry"
                            placeholder="MM/YY"
                            className={`bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 ${
                              errors.cardExpiry
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : ""
                            }`}
                            {...register("cardExpiry")}
                          />
                          {errors.cardExpiry && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.cardExpiry.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="cardCVC"
                            className="block text-sm font-medium text-gray-300 mb-2"
                          >
                            CVC
                          </label>
                          <Input
                            id="cardCVC"
                            placeholder="123"
                            className={`bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 ${
                              errors.cardCVC
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : ""
                            }`}
                            {...register("cardCVC")}
                          />
                          {errors.cardCVC && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.cardCVC.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-xl font-bold text-white mb-6">
                    Order Summary
                  </h2>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg bg-gray-700 flex-shrink-0 flex items-center justify-center text-2xl">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            "🍔"
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium text-sm truncate">
                            {item.name}
                          </h3>
                          <p className="text-gray-400 text-xs">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-[#FF6B35] font-semibold text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t border-gray-700 pt-4 space-y-3">
                    <div className="flex justify-between text-gray-400 text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(getSubtotal())}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-sm">
                      <span>Delivery Fee</span>
                      <span>{formatPrice(getDeliveryFee())}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-sm">
                      <span>Tax</span>
                      <span>{formatPrice(getTax())}</span>
                    </div>
                    <div className="border-t border-gray-700 pt-3">
                      <div className="flex justify-between">
                        <span className="text-[#FF6B35] font-bold text-lg">
                          Total
                        </span>
                        <span className="text-[#FF6B35] font-bold text-lg">
                          {formatPrice(getTotal())}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white h-12 text-base font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubmit(onSubmit)}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default Checkout;
