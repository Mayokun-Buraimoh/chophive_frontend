/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCustomerOrders } from "../../api";
import { Order } from "../lib/interface";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Loader2, Package, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import OrderDetailsModal from "../components/OrderDetailsModal";

export default function Orders() {
  const navigate = useNavigate();
  const { userId, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadOrders = async () => {
      try {
        const data = await fetchCustomerOrders(userId);
        setOrders(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadOrders();
    }
  }, [userId, isAuthenticated, navigate]);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `₦${numPrice.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-400 bg-green-400/10";
      case "processing":
        return "text-yellow-400 bg-yellow-400/10";
      case "cancelled":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E]">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF4500]" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              My Orders
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              View and track all your orders
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {orders.length === 0 && !loading && (
            <div className="text-center py-12 md:py-20">
              <Package className="w-16 h-16 md:w-20 md:h-20 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg md:text-xl mb-2">No orders yet</p>
              <p className="text-gray-500 text-sm md:text-base mb-6">
                Start ordering to see your order history here
              </p>
              <Button
                onClick={() => navigate("/food-menu")}
                className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white"
              >
                Browse Menu
              </Button>
            </div>
          )}

          {/* Orders List */}
          {orders.length > 0 && (
            <div className="space-y-4 md:space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-700 hover:border-[#FF4500] transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2">
                        <h3 className="text-white font-semibold text-base md:text-lg">
                          Order #{order.oid}
                        </h3>
                        <span
                          className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs md:text-sm mb-2">
                        {formatDate(order.created_at)}
                      </p>
                      <p className="text-gray-400 text-xs md:text-sm mb-2">
                        {order.order_item?.length || 0} item(s)
                      </p>
                      <p className="text-[#FF4500] font-bold text-lg md:text-xl">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-[#FF4500] font-bold text-lg md:text-xl">
                        Order Pin: <span className="text-white font-normal text-sm md:text-base">{order.order_pin || "N/A"}</span>
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetailsModal(true);
                      }}
                      className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white w-full sm:w-auto"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          userId={userId}
        />
      )}

      <Footer />
    </div>
  );
}



