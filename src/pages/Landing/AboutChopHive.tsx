import { Button } from "../../components/ui/button";
import { ArrowRight, UtensilsCrossed, Utensils } from "lucide-react";

export default function AboutFoodex() {
  return (
    <section className="bg-[#1E1E1E] py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Side - Image */}
          <div className="relative flex justify-center md:justify-start">
            <div className="relative w-full max-w-md">
              {/* Irregular orange blob with polka dots */}
              <div className="relative w-full max-w-md mx-auto md:mx-0">
                <div
                  className="bg-[#FF6B35] relative"
                  style={{
                    width: "120%",
                    paddingBottom: "120%",
                    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                    position: "relative",
                    overflow: "visible",
                    left: "-10%",
                    top: "-10%",
                  }}
                >
                  <div className="absolute inset-0">
                    {/* Polka dots on the orange blob */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, white 3px, transparent 3px)",
                        backgroundSize: "35px 35px",
                        opacity: 0.5,
                        borderRadius: "inherit",
                      }}
                    ></div>
                    {/* Burger image in center */}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ padding: "10%" }}
                    >
                      <div className="bg-white rounded-full w-full h-full flex items-center justify-center text-6xl md:text-8xl shadow-lg z-10">
                        🍔
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
              About{" "}
              <span className="text-2xl md:text-3xl font-bold text-[#FF6B35] relative">
                <span className="relative inline-block">
                  <span className="relative">
                    C
                    <span className="absolute -top-0.5 left-0.5 text-[#FF6B35] text-sm leading-none">
                      🌿
                    </span>
                  </span>
                  hop
                </span>
                <span className="text-white">Hive</span>
              </span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base mb-6 md:mb-8 leading-relaxed">
              We are committed to providing you with the freshest, healthiest,
              and most delicious meals. Our chefs use only the finest
              ingredients to create culinary masterpieces that delight your
              taste buds and nourish your body.
            </p>

            <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#FF6B35] rounded-full flex items-center justify-center">
                  <UtensilsCrossed className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    Health Pizza
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Made with whole grain crust and fresh vegetables
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#FF6B35] rounded-full flex items-center justify-center">
                  <Utensils className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    Health Burger
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Lean protein with fresh greens and whole grain buns
                  </p>
                </div>
              </div>
            </div>

            <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white">
              See More <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
