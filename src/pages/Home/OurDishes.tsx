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
          <h2 className="text-3xl font-bold text-white mb-4">
            OUR DISHES
          </h2>
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
                  className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white bg-gray-800 text-gray-300 border border-gray-700 px-4 py-2 rounded-md text-sm capitalize"
                >
                  {vendor.vendor_name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* 3️⃣ Foods per Vendor */}
          {vendors.map((vendor) => (
            <TabsContent
              key={vendor.vendor_slug}
              value={vendor.vendor_slug}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {foods
                  .filter(
                    (food) => food.vendor_slug === vendor.vendor_slug
                  )
                  .map((food) => (
                    <div
                      key={food.id}
                      className="bg-gray-800 rounded-lg p-5 flex flex-col"
                    >
                      <div className="flex flex-col items-center text-center">
                        {/* Image */}
                        <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden mb-4">
                          {food.image ? (
                            <img
                              src={food.image}
                              alt={food.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">
                              🍽️
                            </div>
                          )}
                        </div>

                        <h3 className="text-white font-semibold text-lg mb-2">
                          {food.name}
                        </h3>

                        <div className="flex gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className="text-[#FF6B35] fill-[#FF6B35]"
                            />
                          ))}
                        </div>

                        <p className="text-gray-400 text-sm mb-4">
                          {food.description}
                        </p>

                        <div className="flex items-center justify-between w-full mt-auto">
                          <span className="text-white font-bold text-lg">
                            ₦{food.price}
                          </span>

                          <Button
                            size="icon"
                            className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-full h-9 w-9"
                            onClick={() =>
                              addToCart(
                                {
                                  id: food.id,
                                  price: food.price,
                                },
                                1
                              )
                            }
                          >
                            <Plus size={16} />
                          </Button>
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
