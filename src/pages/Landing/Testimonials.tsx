import { Star, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface Testimonial {
  id: number;
  rating: number;
  text: string;
  image: string;
  user: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    rating: 5,
    text: "Absolutely delicious! Every bite was fresh and flavorful. The delivery was prompt and the packaging was excellent.",
    image: "🍕",
    user: "John D.",
  },
  {
    id: 2,
    rating: 5,
    text: "Absolutely delicious! Every bite was fresh and flavorful. The delivery was prompt and the packaging was excellent.",
    image: "🍔",
    user: "Sarah M.",
  },
  {
    id: 3,
    rating: 5,
    text: "Nice flavors and presentation, though the portion was smaller than I hoped. Tasty overall!",
    image: "🥗",
    user: "Mike T.",
  },
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-[#A32110] py-12 md:py-20 relative overflow-hidden">
      {/* Polka dots background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 3px, transparent 3px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            What Customers Say
          </h2>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 w-[320px] md:w-[400px] bg-white/10 backdrop-blur-sm rounded-lg p-6 md:p-8"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-6xl md:text-7xl mb-4">
                    {testimonial.image}
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="text-white fill-white"
                        size={20}
                      />
                    ))}
                  </div>
                  <p className="text-white text-sm md:text-base mb-6 leading-relaxed">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">
                      👤
                    </div>
                    <span className="text-white font-semibold">
                      {testimonial.user}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 z-10 backdrop-blur-sm"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}



