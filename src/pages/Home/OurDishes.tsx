import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import { Star, Plus } from "lucide-react";
import { useCart } from "../../contexts/CartContext";

interface Dish {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  cafetaria: string;
}

const dishes: Dish[] = [
  {
    id: 1,
    name: "French Special Pasta",
    description:
      "Creamy pasta with French herbs and fresh vegetables, a delightful fusion of flavors.",
    price: "$13.00",
    image: "🍝",
    cafetaria: "cafe1",
  },
  {
    id: 2,
    name: "French Special Burger",
    description:
      "Juicy beef patty with French cheese and special sauce, served with crispy fries.",
    price: "$12.00",
    image: "🍔",
    cafetaria: "cafe2",
  },
  {
    id: 3,
    name: "Italian Sandwich",
    description:
      "Fresh Italian bread with premium meats, cheese, and vegetables.",
    price: "$10.00",
    image: "🥪",
    cafetaria: "cafe3",
  },
  {
    id: 4,
    name: "Deluxe Thali",
    description:
      "A complete meal with rice, dal, vegetables, roti, and dessert.",
    price: "$15.00",
    image: "🍛",
    cafetaria: "cafe4",
  },
  {
    id: 5,
    name: "Classic Burger",
    description: "Traditional burger with all the fixings you love.",
    price: "$11.00",
    image: "🍔",
    cafetaria: "cafe5",
  },
  {
    id: 6,
    name: "Fast Food Combo",
    description: "Your favorite fast food items in one delicious combo meal.",
    price: "$14.00",
    image: "🍟",
    cafetaria: "cafe6",
  },
];

const cafetarias = ["cafe1", "cafe2", "cafe3", "cafe4", "cafe5", "cafe6"];

export default function OurDishes() {
  const { addItem } = useCart();

  return (
    <section id="menu" className="bg-[#1E1E1E] py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            OUR DISHES
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Explore our diverse menu featuring dishes from around the world.
            Each dish is prepared with fresh ingredients and authentic flavors.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-8 overflow-x-auto">
            <TabsList className="bg-transparent p-0 flex-wrap h-auto gap-2">
              {cafetarias.map((cafe) => (
                <TabsTrigger
                  key={cafe}
                  value={cafe}
                  className="data-[state=active]:bg-[#FF6B35] data-[state=active]:text-white text-gray-300 bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-xs sm:text-sm capitalize whitespace-nowrap"
                >
                  {cafe === "all"
                    ? "All items"
                    : cafe === "fastfoods"
                    ? "Fast Foods"
                    : cafe}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {cafetarias.map((cafe) => (
            <TabsContent key={cafe} value={cafe} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {dishes
                  .filter((dish) => cafe === "all" || dish.cafetaria === cafe)
                  .map((dish) => (
                    <div
                      key={dish.id}
                      className="bg-gray-800 rounded-lg p-4 md:p-6 flex flex-col"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-700 flex items-center justify-center text-5xl md:text-6xl mb-4">
                          {dish.image}
                        </div>
                        <h3 className="text-white font-semibold text-base md:text-lg mb-2">
                          {dish.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="text-[#FF6B35] fill-[#FF6B35]"
                              size={14}
                            />
                          ))}
                        </div>
                        <p className="text-gray-400 text-xs md:text-sm mb-4 text-left w-full">
                          {dish.description}
                        </p>
                        <div className="flex items-center justify-between w-full mt-auto">
                          <span className="text-white font-bold text-lg md:text-xl">
                            {dish.price}
                          </span>
                          <Button
                            size="icon"
                            className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-full h-8 w-8 md:h-10 md:w-10"
                            onClick={() => {
                              const price = parseFloat(
                                dish.price.replace("$", "")
                              );
                              addItem({
                                id: `dish-${dish.id}`,
                                name: dish.name,
                                description: dish.description,
                                price: price,
                                image: dish.image,
                                cafeteria: dish.cafetaria
                              });
                            }}
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
