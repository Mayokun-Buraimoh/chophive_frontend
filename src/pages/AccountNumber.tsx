import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Check, Copy, X } from "lucide-react";
import { BsBank } from "react-icons/bs";
import { useState } from "react";

function AccountNumber() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderOid, total } = location.state;
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const accountDetails = {
    number: "4000000",
    name: "ChopHive",
    bank: "UBA",
  };
  const formatPrice = (price: string | number | undefined) => {
    if (!price) return "₦0.00";
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `₦${numPrice.toFixed(2)}`;
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      // addToast(`${fieldName} copied to clipboard!`, "success");
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      // addToast("Failed to copy to clipboard", "error");
    }
  };
  const handleCancelPayment = () => {
    if (orderOid) {
      navigate(`/checkout/${orderOid}`);
    } else {
      navigate("/food-menu");
    }
    // addToast("Payment cancelled", "info");
  };

  const handlePaid = () => {
    if (orderOid) {
      navigate("/orders", { state: { openOrderOid: orderOid } });
    } else {
      navigate("/orders");
    }
  };
  return (
    <div className="min-h-screen bg-[#1E1E1E]">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-700 shadow-2xl">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#A32110] to-[#8B1A0D] rounded-full flex items-center justify-center shadow-lg">
                <BsBank className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
              Payment Details
            </h1>
            <p className="text-gray-400 text-center mb-8">
              Please transfer the exact amount shown above.
              <br /> Your order will be processed once payment is verified.
            </p>
            {/* Amount to Pay */}
            {total && (
              <div className="bg-gradient-to-r from-[#A32110]/20 to-[#8B1A0D]/20 border border-[#A32110]/30 rounded-xl p-6 mb-8">
                <p className="text-gray-400 text-sm mb-2 text-center">
                  Amount to Pay
                </p>
                <p className="text-[#A32110] font-bold text-4xl md:text-5xl text-center">
                  {formatPrice(total)}
                </p>
              </div>
            )}

            {/* Account Details */}
            <div className="space-y-4 mb-8">
              {/* Account Number */}
              <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700 hover:border-[#A32110]/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm mb-2">Account Number</p>
                    <p className="text-white font-semibold text-xl md:text-2xl">
                      {accountDetails.number}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(accountDetails.number, "Account Number")
                    }
                    className="ml-4 p-3 rounded-lg bg-[#A32110] hover:bg-[#A32110]/90 text-white transition-colors flex-shrink-0"
                    title="Copy Account Number"
                  >
                    {copiedField === "Account Number" ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              {/* Account Name */}
              <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700 hover:border-[#A32110]/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm mb-2">Account Name</p>
                    <p className="text-white font-semibold text-xl md:text-2xl">
                      {accountDetails.name}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(accountDetails.name, "Account Name")
                    }
                    className="ml-4 p-3 rounded-lg bg-[#A32110] hover:bg-[#A32110]/90 text-white transition-colors flex-shrink-0"
                    title="Copy Account Name"
                  >
                    {copiedField === "Account Name" ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              {/* Bank */}
              <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700 hover:border-[#A32110]/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm mb-2">Bank</p>
                    <p className="text-white font-semibold text-xl md:text-2xl">
                      {accountDetails.bank}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(accountDetails.bank, "Bank")}
                    className="ml-4 p-3 rounded-lg bg-[#A32110] hover:bg-[#A32110]/90 text-white transition-colors flex-shrink-0"
                    title="Copy Bank Name"
                  >
                    {copiedField === "Bank" ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                onClick={handlePaid}
                className="flex-1 bg-[#A32110] hover:bg-[#A32110]/90 text-white h-12 text-base font-semibold"
              >
                I have Paid
              </Button>
              <Button
                onClick={handleCancelPayment}
                variant="outline"
                className="flex-1 border-2 border-gray-600 text-gray-300 bg-transparent hover:text-white hover:bg-gray-700 hover:border-gray-500 h-12 text-base font-semibold"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Payment
              </Button>
            </div>

            {/* Support Info */}
            <div className="pt-8 border-t border-gray-700">
              <p className="text-gray-400 text-sm text-center">
                Need help?{" "}
                <Link
                  to="/contact"
                  className="text-[#A32110] hover:text-[#A32110]/80 transition-colors font-medium"
                >
                  Contact our support team
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountNumber;
