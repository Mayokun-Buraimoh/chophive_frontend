import { useEffect, useState } from "react";
import { Vendor, FoodItem } from "../lib/interface";
import api, { fetchFoodItems } from "../../api";
import Header from "../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Loader2, Store, MapPin, ArrowUpRight } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";

function VendorDetails() {
  const { vendorName } = useParams<{ vendorName: string }>();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, getItemQuantity } = useCart();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E]">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#A32110]" />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {foodItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 relative opacity-0 animate-fade-in group"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: "forwards",
                    }}
                  >
                    <div className="relative w-[240px] h-[400px] rounded-t-full rounded-b-full bg-[#121212] border-none shadow-xl hover:shadow-2xl hover:shadow-[#A32110]/30 transition-all duration-300 hover:scale-105 mx-auto">
                      <div className="absolute left-1/2 -translate-x-1/2">
                        <div className="w-56 h-56 rounded-full border-[6px] border-[#2a2a2a] overflow-hidden group-hover:border-[#A32110] transition-colors duration-300">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-700">
                              🍽️
                            </div>
                          )}
                          {!item.is_available && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white text-xs font-semibold bg-red-500 px-2 py-1 rounded">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        className="absolute top-3 right-3 w-12 h-12 rounded-full bg-[#A32110] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
                        title="View Details"
                        onClick={() => navigate(`/food/${item.item_id}`)}
                      >
                        <ArrowUpRight className="w-5 h-5 text-black" />
                      </button>

                      {getItemQuantity(item.id) > 0 && (
                        <div className="absolute top-3 left-3 w-12 h-12 rounded-full bg-[#A32110] flex items-center justify-center shadow-lg z-10">
                          <span className="text-black font-bold text-sm">
                            {getItemQuantity(item.id)}
                          </span>
                        </div>
                      )}

                      <Button
                        size="icon"
                        disabled={!item.is_available}
                        className="absolute bottom-3 right-3 bg-[#A32110] hover:bg-[#A32110]/90 text-white rounded-full h-10 w-10 shadow-lg z-10 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform duration-300"
                        onClick={() => addToCart(item, 1)}
                      >
                        <Plus size={18} />
                      </Button>

                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 flex-col">
                        <h3 className="text-white font-semibold text-sm md:text-base line-clamp-1">
                          {item.name}
                        </h3>
                        <span className="text-gray-400 text-xs line-clamp-2 max-w-[200px]">
                          {item.description}
                        </span>
                        <span className="text-[#A32110] font-bold text-lg">
                          ₦{parseFloat(item.price).toLocaleString()}
                        </span>
                      </div>
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



