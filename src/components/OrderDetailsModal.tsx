/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { X, Package, MapPin, Calendar, CheckCircle, Clock } from "lucide-react";
import { Order, OrderItem } from "../lib/interface";
import { fetchOrderDetail } from "../../api";
import { Loader2 } from "lucide-react";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  userId: string | null;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  userId,
}: OrderDetailsModalProps) {
  const [orderDetails, setOrderDetails] = useState<Order | null>(order);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && order.oid && userId) {
      setLoading(true);
      fetchOrderDetail(userId, order.oid)
        .then((data) => {
          setOrderDetails(data);
        })
        .catch((err) => {
          console.error("Failed to load order details:", err);
          setOrderDetails(order); // Fallback to passed order
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, order.oid, userId]);

  const groupedByVendor = useMemo(() => {
    if (!orderDetails) return {};

    return orderDetails.order_item.reduce((acc: any, item: OrderItem) => {
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
  }, [orderDetails]);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `₦${numPrice.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-400";
      case "processing":
        return "text-yellow-400";
      case "cancelled":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "processing":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1E1E1E] rounded-xl md:rounded-2xl border border-gray-700 w-full max-w-4xl my-4 md:my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1E1E1E] border-b border-gray-700 p-4 md:p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Order #{orderDetails?.oid || order.oid}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {getStatusIcon(orderDetails?.status || order.status)}
              <span
                className={`font-semibold text-sm md:text-base ${getStatusColor(
                  orderDetails?.status || order.status
                )}`}
              >
                {orderDetails?.status || order.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#A32110]" />
            </div>
          ) : (
            <>
              {/* Order Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#A32110] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Order Date</p>
                    <p className="text-white text-sm md:text-base">
                      {formatDate(orderDetails?.created_at || order.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#A32110] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Hostel</p>
                    <p className="text-white text-sm md:text-base">
                      {orderDetails?.hostel || order.hostel}
                    </p>
                    {orderDetails?.room_address && (
                      <p className="text-gray-400 text-xs md:text-sm mt-1">
                        Room: {orderDetails.room_address}
                      </p>
                    )}
                  </div>
                </div>

                {orderDetails?.delivery_batch && (
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-[#A32110] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Delivery Batch</p>
                      <p className="text-white text-sm md:text-base">
                        {orderDetails.delivery_batch}
                      </p>
                    </div>
                  </div>
                )}

                {orderDetails?.customer_name && (
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-[#A32110] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Customer Name</p>
                      <p className="text-white text-sm md:text-base">
                        {orderDetails.customer_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items by Vendor */}
              <div className="space-y-4 md:space-y-6">
                {Object.values(groupedByVendor).map((group: any) => (
                  <div
                    key={group.vendor.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-700"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
                      <Package className="w-5 h-5 text-[#A32110]" />
                      <h3 className="text-lg md:text-xl font-bold text-white">
                        {group.vendor.name || group.vendor.username}
                      </h3>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      {group.items.map((item: OrderItem) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-4"
                        >
                          <div className="flex-1">
                            <div className="flex items-start gap-3 md:gap-4">
                              {item.food_item.image && (
                                <img
                                  src={item.food_item.image}
                                  alt={item.food_item.name}
                                  className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium text-sm md:text-base mb-1">
                                  {item.food_item.name}
                                </h4>
                                <p className="text-gray-400 text-xs md:text-sm">
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
                          <div className="text-right flex-shrink-0">
                            <p className="text-[#A32110] font-semibold text-sm md:text-base">
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
                      <span className="text-gray-400 font-medium text-sm md:text-base">
                        Vendor Subtotal
                      </span>
                      <span className="text-white font-bold text-base md:text-lg">
                        {formatPrice(group.vendorTotal)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-700">
                <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">
                  Order Summary
                </h3>

                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  <div className="flex justify-between text-gray-400 text-sm md:text-base">
                    <span>Subtotal</span>
                    <span className="text-white">
                      {formatPrice(orderDetails?.sub_total || order.sub_total)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-400 text-sm md:text-base">
                    <span>Delivery Fee</span>
                    <span className="text-white">
                      {formatPrice(
                        orderDetails?.delivery_fee || order.delivery_fee || "0.00"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-400 text-sm md:text-base">
                    <span>Service Fee</span>
                    <span className="text-white">
                      {formatPrice(
                        orderDetails?.service_fee || order.service_fee || "0.00"
                      )}
                    </span>
                  </div>

                  <div className="pt-3 md:pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-[#A32110] font-bold text-lg md:text-xl">
                        Total
                      </span>
                      <span className="text-[#A32110] font-bold text-xl md:text-2xl">
                        {formatPrice(orderDetails?.total || order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}




