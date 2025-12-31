import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCheckout } from "../../api";
import { Checkout, OrderItem } from "../lib/interface";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft, CheckCircle, Clock, MapPin, Package } from "lucide-react";
import { Button } from "../components/ui/button";

export default function CheckoutDetails() {
  const { orderOid } = useParams<{ orderOid: string }>();
  const navigate = useNavigate();
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderOid) {
      setError("Order ID is required");
      setLoading(false);
      return;
    }

    getCheckout(orderOid)
      .then((data) => {
        setCheckout(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load checkout:", err);
        setError("Failed to load order details. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [orderOid]);

  /**
   * Group items by vendor
   */
  const groupedByVendor = useMemo(() => {
    if (!checkout) return {};

    return checkout.order_item.reduce((acc: any, item) => {
      const vendorId = item.vendor.id;

      if (!acc[vendorId]) {
        acc[vendorId] = {
          vendor: item.vendor,
          items: [],
          vendorTotal: 0,
        };
      }

      acc[vendorId].items.push(item);
      acc[vendorId].vendorTotal += Number(item.total);

      return acc;
    }, {});
  }, [checkout]);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `₦${numPrice.toFixed(2)}`;
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E]">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !checkout) {
    return (
      <div className="min-h-screen bg-[#1E1E1E]">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 mb-6">
              <p className="text-red-400 text-lg font-semibold mb-2">
                {error || "Order not found"}
              </p>
              <p className="text-gray-400 text-sm">
                The order you're looking for doesn't exist or has been removed.
              </p>
            </div>
            <Button
              onClick={() => navigate("/")}
              className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white"
            >
              Go to Home
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
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>

          {/* Order Header */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Order #{checkout.oid}
                </h1>
                <p className="text-sm text-gray-400">
                  Placed on {new Date(checkout.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-2">
                {getPaymentStatusIcon(checkout.payment_status)}
                <span
                  className={`font-semibold ${getPaymentStatusColor(
                    checkout.payment_status
                  )}`}
                >
                  {checkout.payment_status}
                </span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="flex items-start gap-3 pt-4 border-t border-gray-700">
              <MapPin className="w-5 h-5 text-[#FF6B35] mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-400 mb-1">Delivery Address</p>
                <p className="text-white">{checkout.delivery_address}</p>
              </div>
            </div>
          </div>

          {/* Order Items by Vendor */}
          <div className="space-y-6 mb-6">
            {Object.values(groupedByVendor).map((group: any) => (
              <div
                key={group.vendor.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
              >
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
                  <Package className="w-5 h-5 text-[#FF6B35]" />
                  <h2 className="text-xl font-bold text-white">
                    {group.vendor.name || group.vendor.username}
                  </h2>
                </div>

                <div className="space-y-4">
                  {group.items.map((item: OrderItem) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {item.food_item.image && (
                            <img
                              src={item.food_item.image}
                              alt={item.food_item.name}
                              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="text-white font-medium mb-1">
                              {item.food_item.name}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              Quantity: {item.quantity}
                            </p>
                            {item.food_item.description && (
                              <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                                {item.food_item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[#FF6B35] font-semibold">
                          {formatPrice(item.total)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-gray-500 text-xs mt-1">
                            {formatPrice(item.food_item.price)} each
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-700">
                  <span className="text-gray-400 font-medium">
                    Vendor Subtotal
                  </span>
                  <span className="text-white font-bold text-lg">
                    {formatPrice(group.vendorTotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(checkout.sub_total)}</span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Service Fee</span>
                <span className="text-white">{formatPrice(checkout.service_fee)}</span>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-[#FF6B35] font-bold text-xl">Total</span>
                  <span className="text-[#FF6B35] font-bold text-2xl">
                    {formatPrice(checkout.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-700">
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white h-12 text-base font-semibold"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

