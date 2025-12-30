import Header from "../components/Header";
import Footer from "../components/Footer";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ArrowUpRight, Loader2, Plus, SearchIcon } from "lucide-react";
import { useFood } from "../contexts/FoodContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useEffect, useState } from "react";
import { fetchCategory, fetchVendors } from "../../api";
import { Category, Vendor } from "../lib/interface";

function FoodMenu() {
  const { foods, loading } = useFood();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const getCategories = async () => {
    const categoriesData = await fetchCategory();
    console.log("Categories: ", categoriesData);
    setCategories(categoriesData);
  };

  const getVendors = async () => {
    const vendorsData = await fetchVendors();
    console.log("Vendors: ", vendorsData);
    setVendors(vendorsData);
  };

  useEffect(() => {
    getCategories();
    getVendors();
  }, []);

  return (
    <div className="min-h-screen bg-[#1E1E1E] scrollbar-thin scrollbar-webkit">
      <Header />
      <main>
        <section className="bg-[#1E1E1E] py-12 md:py-20 lg:py-32 px-5 md:11 lg:px-16">
          <div className="flex gap-2">
            <Input
              type="search"
              title="Search your favorite food"
              placeholder="Search your favorite food"
            />
            <Button>
              <SearchIcon size={20} />
            </Button>
          </div>
          <div>
            <ul>
              {categories.map((category) => (
                <li key={category.id}>{category.name}</li>
              ))}
            </ul>
            <ul>
              {vendors.map((vendor) => (
                <li key={vendor.id}>{vendor.name}</li>
              ))}
            </ul>
          </div>
        </section>
        <section className="bg-[#1E1E1E] py-12 md:py-20 lg:py-32 px-5 md:11 lg:px-16">
          <div className="relative">
            <div
              className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              )}
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default FoodMenu;
