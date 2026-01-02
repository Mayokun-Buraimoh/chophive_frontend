/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchVendors } from "../../api";
import { Vendor } from "../lib/interface";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Loader2, Store, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

export default function Vendors() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const data = await fetchVendors();
        setVendors(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load vendors:", err);
        setError("Failed to load vendors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadVendors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E]">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF4500]" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E]">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              Cafeterias
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Explore all our partner cafeterias
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {vendors.length === 0 && !loading && (
            <div className="text-center py-12 md:py-20">
              <Store className="w-16 h-16 md:w-20 md:h-20 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg md:text-xl mb-2">No vendors found</p>
            </div>
          )}

          {/* Vendors Grid */}
          {vendors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {vendors
                .filter((vendor) => vendor.is_active)
                .map((vendor) => (
                  <div
                    key={vendor.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-700 hover:border-[#FF4500] transition-all duration-300 hover:shadow-xl hover:shadow-[#FF4500]/20 group"
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Logo */}
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-700 overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
                        {vendor.logo ? (
                          <img
                            src={vendor.logo}
                            alt={vendor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            🏪
                          </div>
                        )}
                      </div>

                      {/* Vendor Info */}
                      <h3 className="text-white font-semibold text-base md:text-lg mb-2 line-clamp-1">
                        {vendor.name}
                      </h3>
                      <p className="text-gray-400 text-xs md:text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                        {vendor.description}
                      </p>
                      {vendor.address && (
                        <p className="text-gray-500 text-xs mb-4 line-clamp-1">
                          {vendor.address}
                        </p>
                      )}

                      {/* View Details Button */}
                      <Button
                        onClick={() => navigate(`/vendors/${vendor.slug}`)}
                        className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 text-white"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}



