import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import { Star, Plus } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useFood } from "../../contexts/FoodContext";

export default function OurDishes() {
  const { addToCart } = useCart();
  const { foods, loading } = useFood();

  // 1️⃣ Build vendors list from foods
  const vendors = Array.from(
    new Map(
      foods.map((food) => [
        food.vendor_slug,
        {
          vendor_slug: food.vendor_slug,
          vendor_name: food.vendor_name,
        },
      ])
    ).values()
  );

  if (loading) {
    return (
      <section className="bg-[#1E1E1E] py-20 text-center text-gray-400">
        Loading menu…
      </section>
    );
  }

  return (
    <section id="menu" className="bg-[#1E1E1E] py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">OUR DISHES</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse meals by cafeteria. Each vendor cooks their own magic.
          </p>
        </div>

        <Tabs defaultValue={vendors[0]?.vendor_slug} className="w-full">
          {/* 2️⃣ Vendor Tabs */}
          <div className="flex justify-center mb-8 overflow-x-auto">
            <TabsList className="bg-transparent p-0 gap-2 flex-wrap">
              {vendors.map((vendor) => (
                <TabsTrigger
                  key={vendor.vendor_slug}
                  value={vendor.vendor_slug}
                  className="data-[state=active]:bg-[#A32110] data-[state=active]:text-white bg-gray-800 text-gray-300 border border-gray-700 px-4 py-2 rounded-md text-sm capitalize"
                >
                  {vendor.vendor_name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* 3️⃣ Foods per Vendor */}
          {vendors.map((vendor) => (
            <TabsContent key={vendor.vendor_slug} value={vendor.vendor_slug}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {foods
                  .filter((food) => food.vendor_slug === vendor.vendor_slug)
                  .map((food) => (
                    <div key={food.id} className="flex-shrink-0 relative group">
                      <div className="relative w-[240px] h-[400px] rounded-t-full rounded-b-full bg-[#121212] border-none shadow-xl hover:shadow-2xl hover:shadow-[#A32110]/30 transition-all duration-300 hover:scale-105 mx-auto">
                        <div className="absolute left-1/2 -translate-x-1/2">
                          <div className="w-56 h-56 rounded-full border-[6px] border-[#2a2a2a] overflow-hidden group-hover:border-[#A32110] transition-colors duration-300">
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
                          className="absolute bottom-3 right-3 bg-[#A32110] hover:bg-[#A32110]/90 text-white rounded-full h-10 w-10 shadow-lg z-10 hover:scale-110 transition-transform duration-300"
                          onClick={() => addToCart(food, 1)}
                        >
                          <Plus size={18} />
                        </Button>

                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 flex-col">
                          <h3 className="text-white font-semibold text-sm md:text-base line-clamp-1">
                            {food.name}
                          </h3>
                          <div className="flex gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className="text-[#A32110] fill-[#A32110]"
                              />
                            ))}
                          </div>
                          <span className="text-gray-400 text-xs line-clamp-2 max-w-[200px]">
                            {food.description}
                          </span>
                          <span className="text-[#A32110] font-bold text-lg">
                            ₦{food.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}



