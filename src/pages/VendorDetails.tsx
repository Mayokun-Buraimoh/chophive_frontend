import { useEffect, useState } from "react";
import { Vendor } from "../lib/interface";
import api from "../../api";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";

function VendorDetails() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await api.get(`/vendor-detail/${vendorId}/`);
        setVendor(res.data);
      } catch (err) {
        console.error("Failed to fetch food item", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center text-white">
        Loading food details…
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center text-red-500">
        Vendor not found
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#1E1E1E]">
      <Header />
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 py-12 px-4">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden border border-gray-800">
          <img
            src={vendor?.logo}
            alt={vendor?.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="text-white space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">{vendor?.name}</h1>
          <p className="text-gray-400">{vendor?.description}</p>

          <p className="text-lg">Address: {vendor?.address}</p>
        </div>
      </div>
      <Footer />
    </section>
  );
}

export default VendorDetails;
