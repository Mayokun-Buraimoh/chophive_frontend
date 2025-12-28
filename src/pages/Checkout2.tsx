import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getCheckout } from "../../api";
import { Checkout, OrderItem } from "../lib/interface";


export default function CheckoutDetails() {
    const { orderOid } = useParams<{ orderOid: string }>();
    const [checkout, setCheckout] = useState<Checkout | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (!orderOid) return;
  
      getCheckout(orderOid)
        .then(setCheckout)
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
  
    if (loading) {
      return (
        <div className="p-6 text-white">
          Loading checkout details...
        </div>
      );
    }
  
    if (!checkout) {
      return (
        <div className="p-6 text-red-500">
          Order not found.
        </div>
      );
    }
  
    return (
      <div className="p-6 max-w-3xl mx-auto text-white space-y-6">
        {/* Header */}
        <div className="border-b border-gray-700 pb-4">
          <h1 className="text-2xl font-bold">
            Order #{checkout.oid}
          </h1>
          <p className="text-sm text-gray-400">
            Payment status: {checkout.payment_status}
          </p>
          <p className="text-sm text-gray-400">
            Delivery address: {checkout.delivery_address}
          </p>
        </div>
  
        {/* Vendors */}
        {Object.values(groupedByVendor).map((group: any) => (
          <div
            key={group.vendor.id}
            className="border border-gray-700 rounded-lg p-4 space-y-3"
          >
            <h2 className="text-lg font-semibold">
              Vendor: {group.vendor.username}
            </h2>
  
            {group.items.map((item: OrderItem) => (
              <div
                key={item.id}
                className="flex justify-between text-sm"
              >
                <div>
                  <p>{item.food_item.name}</p>
                  <p className="text-gray-400">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  ₦{item.total}
                </p>
              </div>
            ))}
  
            <div className="flex justify-between pt-2 border-t border-gray-600 font-semibold">
              <span>Vendor total</span>
              <span>₦{group.vendorTotal}</span>
            </div>
          </div>
        ))}
  
        {/* Order summary */}
        <div className="border-t border-gray-700 pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₦{checkout.sub_total}</span>
          </div>
  
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>₦{checkout.service_fee}</span>
          </div>
  
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₦{checkout.total}</span>
          </div>
        </div>
      </div>
    );
  }
  