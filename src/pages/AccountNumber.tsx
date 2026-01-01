import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ShoppingBag } from "lucide-react";
import { BsBank } from "react-icons/bs";

function AccountNumber() {
  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-700 shadow-2xl text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-[#FF6B35] rounded-full flex items-center justify-center">
                <BsBank className="w-12 h-12 text-white text-2xl" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Account Number: 4000000
            </h1>
            <h2 className="text-white text-2xl font-semibold mb-4">
              Account Name: ChopHive
            </h2>
            <h3 className="text-white text-xl font-semibold mb-8">
              Bank: UBA
            </h3>
            <p className="text-gray-400 text-lg mb-8">
              Pay into this account to complete your order.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/food-menu">
                <Button
                  variant="outline"
                  className="border-2 border-[#FF6B35] text-gray-300 bg-transparent hover:text-white hover:bg-[#FF6B35]"
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
                  className="text-[#FF6B35] hover:text-[#FF6B35]/80 transition-colors"
                >
                  Contact our support team
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AccountNumber;

