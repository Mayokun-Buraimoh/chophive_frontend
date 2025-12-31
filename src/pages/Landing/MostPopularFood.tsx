import { ChevronRight, ArrowUpRight, Plus } from "lucide-react";
import { useRef } from "react";
import { Button } from "../../components/ui/button";
import { useCart } from "../../contexts/CartContext";
import { useFood } from "../../contexts/FoodContext";
import { useNavigate } from "react-router-dom";

export default function MostPopularFood() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { foods } = useFood();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-[#1E1E1E] py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            MOST POPULAR FOOD
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Discover our most loved dishes, handpicked by our customers. Each
            dish is crafted with care and made with the finest ingredients.
          </p>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {foods.map((food) => (
              <div key={food.id} className="flex-shrink-0 relative">
                <div className="relative w-[240px] h-[400px] rounded-t-full rounded-b-full bg-[#121212] border-none shadow-xl">
                  <div className="absolute left-1/2 -translate-x-1/2">
                    <div className="w-56 h-56 rounded-full border-[6px] border-[#2a2a2a] overflow-hidden">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <button
                    className="absolute top-3 right-3 w-12 h-12 rounded-full bg-[#FF6B35] flex items-center justify-center shadow-lg hover:scale-105 transition"
                    title="View Details"
                    onClick={() => navigate(`/food/${food.item_id}`)}
                  >
                    <ArrowUpRight className="w-5 h-5 text-black" />
                  </button>

                  <Button
                    size="icon"
                    className="absolute bottom-3 right-3 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-full h-10 w-10 shadow-lg z-10"
                    onClick={() => {
                      addToCart(food, 1);
                    }}
                  >
                    <Plus size={18} />
                  </Button>

                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 flex-col">
                    <h3 className="text-white font-semibold text-sm md:text-base">
                      {food.name}
                    </h3>
                    <span className="text-white font-semibold text-sm md:text-base">
                      {food.description}
                    </span>
                    <span className="text-white font-bold text-lg">
                            ₦{food.price}
                          </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-full p-2 z-10"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
