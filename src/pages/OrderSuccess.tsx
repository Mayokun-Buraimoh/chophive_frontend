import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { CheckCircle, Package, Home, ShoppingBag } from "lucide-react";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1E1E1E]">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-700 shadow-2xl text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Thank you for your order. We've received your order and will begin
              preparing it right away.
            </p>

            {/* Order Info Card */}
            <div className="bg-gray-900/50 rounded-lg p-6 mb-8 border border-gray-700">
              <div className="flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-[#A32110] mr-2" />
                <span className="text-white font-semibold">Order Details</span>
              </div>
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-gray-300">
                  <span>Order Number:</span>
                  <span className="text-[#A32110] font-mono">
                    #{Math.random().toString(36).substring(2, 10).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Estimated Delivery:</span>
                  <span className="text-white">30-45 minutes</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Payment Status:</span>
                  <span className="text-green-500">Confirmed</span>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-gradient-to-br from-[#A32110]/10 to-transparent rounded-lg p-6 mb-8 border border-[#A32110]/20">
              <h2 className="text-xl font-bold text-white mb-4">
                What's Next?
              </h2>
              <div className="space-y-3 text-left">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-[#A32110] rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    You'll receive an order confirmation email shortly
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-[#A32110] rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    We'll notify you when your order is being prepared
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-[#A32110] rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Track your order in real-time through our app
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/")}
                className="bg-[#A32110] hover:bg-[#A32110]/90 text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Link to="/">
                <Button
                  variant="outline"
                  className="border-2 border-[#A32110] text-gray-300 bg-transparent hover:text-white hover:bg-[#A32110]"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {/* Support Info */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                Need help?{" "}
                <Link
                  to="/contact"
                  className="text-[#A32110] hover:text-[#A32110]/80 transition-colors"
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

export default OrderSuccess;




