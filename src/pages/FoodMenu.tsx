import Header from "../components/Header";
import Footer from "../components/Footer";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  ArrowUpRight,
  Loader2,
  Plus,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useFood } from "../contexts/FoodContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useEffect, useState, useMemo } from "react";
import { fetchVendors } from "../../api";
import { Vendor } from "../lib/interface";

type PriceRange = "all" | "low" | "medium" | "high";

function FoodMenu() {
  const { foods, loading } = useFood();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<number | "all">("all");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [showFilters, setShowFilters] = useState(false);

  const getVendors = async () => {
    try {
      const vendorsData = await fetchVendors();
      setVendors(vendorsData);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    }
  };

  useEffect(() => {
    getVendors();
  }, []);

  // Filter and search logic
  const filteredFoods = useMemo(() => {
    let filtered = [...foods];

    // Search filter (by name, vendor name, or description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (food) =>
          food.name.toLowerCase().includes(query) ||
          food.vendor_name.toLowerCase().includes(query) ||
          food.description.toLowerCase().includes(query)
      );
    }

    // Vendor filter
    if (selectedVendor !== "all") {
      filtered = filtered.filter((food) => food.vendor === selectedVendor);
    }

    // Price range filter
    if (priceRange !== "all") {
      filtered = filtered.filter((food) => {
        const price = parseFloat(food.price);
        switch (priceRange) {
          case "low":
            return price < 1000;
          case "medium":
            return price >= 1000 && price < 3000;
          case "high":
            return price >= 3000;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [foods, searchQuery, selectedVendor, priceRange]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedVendor("all");
    setPriceRange("all");
  };

  const hasActiveFilters =
    searchQuery.trim() || selectedVendor !== "all" || priceRange !== "all";

  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Food Menu
          </h1>
          <p className="text-gray-400 text-lg">
            Discover delicious meals from our vendors
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="search"
              placeholder="Search by food name or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF4500] focus:ring-[#FF4500]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                title="clear search"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 bg-[#FF4500] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {
                    [
                      searchQuery.trim() && 1,
                      selectedVendor !== "all" && 1,
                      // selectedCategory !== "all" && 1,
                      priceRange !== "all" && 1,
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-gray-400 hover:text-white"
              >
                Clear all
              </Button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 space-y-4 transition-all duration-300 ease-in-out">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vendor Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Vendor
                  </label>
                  <select
                    title="vendor list"
                    value={selectedVendor}
                    onChange={(e) =>
                      setSelectedVendor(
                        e.target.value === "all"
                          ? "all"
                          : Number(e.target.value)
                      )
                    }
                    className="w-full h-10 rounded-md border border-gray-700 bg-gray-900/50 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500]"
                  >
                    <option value="all">All Vendors</option>
                    {vendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price Range
                  </label>
                  <select
                    title="price range"
                    value={priceRange}
                    onChange={(e) =>
                      setPriceRange(e.target.value as PriceRange)
                    }
                    className="w-full h-10 rounded-md border border-gray-700 bg-gray-900/50 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500]"
                  >
                    <option value="all">All Prices</option>
                    <option value="low">Under ₦1,000</option>
                    <option value="medium">₦1,000 - ₦3,000</option>
                    <option value="high">Above ₦3,000</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="text-sm text-gray-400">
            {loading ? (
              "Loading..."
            ) : (
              <>
                Showing {filteredFoods.length} of {foods.length} items
                {hasActiveFilters && (
                  <span className="ml-2 text-[#FF4500]">(filtered)</span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Food Items Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF4500]" />
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No items found</p>
            <p className="text-gray-500 text-sm mb-6">
              Try adjusting your search or filters
            </p>
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map((food, index) => (
              <div
                key={food.id}
                className="flex-shrink-0 relative opacity-0 animate-fade-in group"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="relative w-[240px] h-[400px] rounded-t-full rounded-b-full bg-[#121212] border-none shadow-xl hover:shadow-2xl hover:shadow-[#FF4500]/30 transition-all duration-300 hover:scale-105 mx-auto">
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
                      {!food.is_available && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white text-xs font-semibold bg-red-500 px-2 py-1 rounded">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    className="absolute top-3 right-3 w-12 h-12 rounded-full bg-[#FF4500] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
                    title="View Details"
                    onClick={() => navigate(`/food/${food.item_id}`)}
                  >
                    <ArrowUpRight className="w-5 h-5 text-black" />
                  </button>

                  <Button
                    size="icon"
                    disabled={!food.is_available}
                    className="absolute bottom-3 right-3 bg-[#FF4500] hover:bg-[#FF4500]/90 text-white rounded-full h-10 w-10 shadow-lg z-10 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform duration-300"
                    onClick={() => addToCart(food, 1)}
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
                      ₦{parseFloat(food.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default FoodMenu;


