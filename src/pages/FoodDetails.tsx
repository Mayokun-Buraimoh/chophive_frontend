import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";
import { Button } from "../components/ui/button";
import { useCart } from "../contexts/CartContext";
import { FoodItem } from "../lib/interface";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Loader2, ShoppingCart, Plus, Store, ArrowLeft } from "lucide-react";

export default function FoodDetails() {
  const { itemId } = useParams<{ itemId: string }>();
  const [food, setFood] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await api.get(`/food-item/${itemId}/`);
        setFood(res.data);
      } catch (err) {
        console.error("Failed to fetch food item", err);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchFood();
    }
  }, [itemId]);

  const handleAddToCart = async () => {
    if (!food) return;
    try {
      await addToCart(food, 1);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `₦${numPrice.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E]">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#A32110]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-[#1E1E1E]">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <p className="text-red-400 text-lg md:text-xl">
              Food item not found
            </p>
            <Button
              onClick={() => navigate("/food-menu")}
              className="mt-4 bg-[#A32110] hover:bg-[#A32110]/90 text-white"
            >
              Back to Menu
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#1E1E1E]">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-4 md:mb-6 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
            {/* Image */}
            <div className="rounded-xl md:rounded-2xl overflow-hidden border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
              {food.image ? (
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover aspect-square"
                />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center text-8xl bg-gray-700">
                  🍽️
                </div>
              )}
            </div>

            {/* Details */}
            <div className="text-white space-y-4 md:space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3">
                  {food.name}
                </h1>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  {food.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-gray-300 text-sm md:text-base">
                <Store className="w-4 h-4 md:w-5 md:h-5" />
                <span>Vendor:</span>
                <button
                  onClick={() => navigate(`/vendors/${food.vendor_slug}`)}
                  className="text-[#A32110] hover:text-[#A32110]/80 font-semibold transition-colors"
                >
                  {food.vendor_name}
                </button>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <p className="text-3xl md:text-4xl font-bold text-[#A32110] mb-4">
                  {formatPrice(food.price)}
                </p>

                <div className="flex items-center gap-2 mb-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${food.is_available
                        ? "text-green-400 bg-green-400/10"
                        : "text-red-400 bg-red-400/10"
                      }`}
                  >
                    {food.is_available ? "Available" : "Out of stock"}
                  </span>
                  {food.stock_qty > 0 && (
                    <span className="text-gray-400 text-xs md:text-sm">
                      {food.stock_qty} in stock
                    </span>
                  )}
                </div>

                <Button
                  disabled={!food.is_available}
                  className="w-full bg-[#A32110] hover:bg-[#A32110]/90 text-white h-12 md:h-14 text-base md:text-lg font-semibold"
                  onClick={handleAddToCart}
                >
                  {addedToCart ? (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Add Another
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}



