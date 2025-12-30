import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";
import { Button } from "../components/ui/button";
import { useCart } from "../contexts/CartContext";
import { FoodItem } from "../lib/interface";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function FoodDetails() {
  const { itemId } = useParams<{ itemId: string }>();
  const [food, setFood] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
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

    fetchFood();
  }, [itemId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center text-white">
        Loading food details…
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center text-red-500">
        Food item not found
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#1E1E1E]">
      <Header />
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 py-12 px-4">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden border border-gray-800">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="text-white space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">{food.name}</h1>
          <p className="text-gray-400">{food.description}</p>

          <p className="text-lg">
            Vendor: <span className="font-semibold">{food.vendor_name}</span>
          </p>
          <Button onClick={() => navigate(`/vendors/${food.vendor}`)}>
            View {food.vendor_name} details
          </Button>

          <p className="text-2xl font-bold text-[#FF6B35]">₦{food.price}</p>

          <p
            className={`text-sm ${
              food.is_available ? "text-green-400" : "text-red-400"
            }`}
          >
            {food.is_available ? "Available" : "Out of stock"}
          </p>

          <Button
            disabled={!food.is_available}
            className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-black mt-4"
            onClick={() => addToCart(food, 1)}
          >
            Add to Cart
          </Button>
        </div>
      </div>
      <Footer />
    </section>
  );
}
