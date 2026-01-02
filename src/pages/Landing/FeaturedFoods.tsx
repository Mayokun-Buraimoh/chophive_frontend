import { Button } from "../../components/ui/button";
import { Plus, ChevronRight } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useRef } from "react";
import { useFood } from "../../contexts/FoodContext";

export default function FeaturedSalads() {
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
    <section className="bg-[#1E1E1E] py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {foods.map((food) => (
              <div key={food.id} className="flex-shrink-0 relative group">
                <div className="relative w-[240px] h-[400px] rounded-t-full rounded-b-full bg-[#121212] border-none shadow-xl hover:shadow-2xl hover:shadow-[#FF4500]/30 transition-all duration-300 hover:scale-105">
                  <div className="absolute left-1/2 -translate-x-1/2">
                    <div className="w-56 h-56 rounded-full border-[6px] border-[#2a2a2a] overflow-hidden group-hover:border-[#FF4500] transition-colors duration-300">
                      {food.image ? (
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-700">
                          🍽️
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="icon"
                    className="absolute bottom-3 right-3 bg-[#FF4500] hover:bg-[#FF4500]/90 text-white rounded-full h-10 w-10 shadow-lg z-10 hover:scale-110 transition-transform duration-300"
                    onClick={() => {
                      addToCart(food, 1);
                    }}
                  >
                    <Plus size={18} />
                  </Button>

                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 flex-col">
                    <h3 className="text-white font-semibold text-sm md:text-base line-clamp-1">
                      {food.name}
                    </h3>
                    <span className="text-gray-400 text-xs line-clamp-2 max-w-[200px]">
                      {food.description}
                    </span>
                    <span className="text-[#FF4500] font-bold text-lg">
                      ₦{food.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-[#FF4500] hover:bg-[#FF4500]/90 text-white rounded-full p-2 z-10"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}


