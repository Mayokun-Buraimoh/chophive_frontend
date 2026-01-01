import { useEffect, useState } from "react";
import { Vendor, FoodItem } from "../lib/interface";
import api, { fetchFoodItems } from "../../api";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import { Loader2, Store, MapPin } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/ui/button";
import { ShoppingCart, Plus } from "lucide-react";

function VendorDetails() {
  const { vendorName } = useParams<{ vendorName: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all vendors and find by slug
        const vendorsRes = await api.get("/vendor-list/");
        const vendors = vendorsRes.data;
        const foundVendor = vendors.find((v: Vendor) => v.slug === vendorName);

        if (!foundVendor) {
          setLoading(false);
          return;
        }

        setVendor(foundVendor);

        // Fetch food items
        const foodItemsData = await fetchFoodItems();

        // Filter food items by vendor
        const vendorFoodItems = foodItemsData.filter(
          (item: FoodItem) => item.vendor === foundVendor.id
        );

        setFoodItems(vendorFoodItems);
      } catch (err) {
        console.error("Failed to fetch vendor details", err);
      } finally {
        setLoading(false);
      }
    };

    if (vendorName) {
      fetchData();
    }
  }, [vendorName]);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `₦${numPrice.toFixed(2)}`;
  };

  const handleAddToCart = async (item: FoodItem) => {
    try {
      await addToCart(item, 1);
      setAddedItems((prev) => new Set(prev).add(item.id));
      setTimeout(() => {
        setAddedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(item.id);
          return newSet;
        });
      }, 3000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E]">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#1E1E1E]">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <Store className="w-16 h-16 md:w-20 md:h-20 text-gray-600 mx-auto mb-4" />
            <p className="text-red-400 text-lg md:text-xl">Vendor not found</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#1E1E1E]">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Vendor Header */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-8 mb-6 md:mb-8 border border-gray-700">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Logo */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-700 overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                {vendor.logo ? (
                  <img
                    src={vendor.logo}
                    alt={vendor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl md:text-6xl">
                    🏪
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 md:mb-3">
                  {vendor.name}
                </h1>
                <p className="text-gray-400 text-sm md:text-base mb-3 md:mb-4">
                  {vendor.description}
                </p>
                {vendor.address && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-sm md:text-base">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                    <span>{vendor.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Food Items Section */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">
              Menu
            </h2>

            {foodItems.length === 0 ? (
              <div className="text-center py-12 md:py-20">
                <p className="text-gray-400 text-base md:text-lg">
                  No food items available from this vendor
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {foodItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-700 hover:border-[#FF6B35] transition-all duration-300 hover:shadow-xl hover:shadow-[#FF6B35]/20 group"
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Image */}
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-700 overflow-hidden mb-3 md:mb-4 group-hover:scale-105 transition-transform duration-300">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl">
                            🍽️
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <h3 className="text-white font-semibold text-sm md:text-base mb-1 md:mb-2 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2 min-h-[2.5rem]">
                        {item.description}
                      </p>
                      <p className="text-[#FF6B35] font-bold text-base md:text-lg mb-3 md:mb-4">
                        {formatPrice(item.price)}
                      </p>

                      {/* Add to Cart Button */}
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-xs md:text-sm"
                        disabled={!item.is_available}
                      >
                        {addedItems.has(item.id) ? (
                          <>
                            <Plus className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                            Add Another
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                            {item.is_available ? "Add to Cart" : "Unavailable"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}

export default VendorDetails;
