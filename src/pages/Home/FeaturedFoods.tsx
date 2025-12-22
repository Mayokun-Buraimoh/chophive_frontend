import { Button } from "../../components/ui/button";
import { Plus, ChevronRight } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useRef } from "react";

interface Salad {
  id: number;
  name: string;
  calories: string;
  persons: string;
  price: string;
  image: string;
  cafeteria: string;
}

const salads: Salad[] = [
  {
    id: 1,
    name: "Fresh and Health Salad",
    calories: "60 calories",
    persons: "4 persons",
    price: "$2.65",
    image: "🥗",
    cafeteria: "cafe1",
  },
  {
    id: 2,
    name: "Cashewnut Chicken Salad",
    calories: "85 calories",
    persons: "2 persons",
    price: "$3.20",
    image: "🥙",
    cafeteria: "cafe2",
  },
  {
    id: 3,
    name: "Greek Feta Salad",
    calories: "70 calories",
    persons: "3 persons",
    price: "$2.90",
    image: "🥗",
    cafeteria: "cafe3",
  },
  {
    id: 4,
    name: "Mediterranean Salad",
    calories: "75 calories",
    persons: "4 persons",
    price: "$3.15",
    image: "🥙",
    cafeteria: "cafe4",
  },
];

export default function FeaturedSalads() {
  const { addToCart } = useCart();
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
            {salads.map((salad) => (
              <div
                key={salad.id}
                className="flex-shrink-0 w-[280px] sm:w-[300px] bg-gray-800 rounded-lg p-4 md:p-6"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-700 flex items-center justify-center text-5xl md:text-6xl mb-4">
                    {salad.image}
                  </div>
                  <h3 className="text-white font-semibold text-sm md:text-base mb-2">
                    {salad.name}
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm mb-3">
                    {salad.calories} {salad.persons}
                  </p>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-white font-bold text-lg md:text-xl">
                      {salad.price}
                    </span>
                    <Button
                      size="icon"
                      className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-full h-8 w-8 md:h-10 md:w-10"
                      onClick={() => {
                        addToCart({id: salad.id, price: salad.price}, 1);
                      }}
                    >
                      <Plus size={16} />
                    </Button>
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
