import { Package, Truck, Gift, Zap } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Package className="text-[#FF6B35]" size={48} />,
    title: "Best Quality",
    description:
      "We source only the finest ingredients and maintain the highest standards in food preparation.",
  },
  {
    icon: <Truck className="text-[#FF6B35]" size={48} />,
    title: "Fastest Delivery",
    description:
      "Get your food delivered hot and fresh in record time, right to your doorstep.",
  },
  {
    icon: (
      <div className="w-12 h-12 bg-[#FF6B35] rounded flex items-center justify-center">
        <span className="text-white font-bold text-sm">FREE</span>
      </div>
    ),
    title: "Free Delivery",
    description:
      "Enjoy free delivery on orders above a certain amount. No hidden charges.",
  },
  {
    icon: <Zap className="text-[#FF6B35]" size={48} />,
    title: "Ultra-Fast Shipping",
    description:
      "Lightning-fast shipping ensures your food arrives fresh and on time, every time.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#1E1E1E] py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Why to choose Us
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            We are committed to providing exceptional service and quality that
            sets us apart from the competition.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-6 md:p-8 text-center flex flex-col items-center"
            >
              <div className="mb-4 md:mb-6">{feature.icon}</div>
              <h3 className="text-white font-semibold text-lg md:text-xl mb-2 md:mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
