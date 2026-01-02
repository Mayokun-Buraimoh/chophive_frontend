import { Button } from "../../components/ui/button";

export default function Hero() {
  return (
    <section id="home" className="bg-[#1E1E1E] py-12 md:py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-[#FF4500]">Early to Rise, </span>
            <span className="text-white">Eat Fresh</span>
            <span className="text-white"> & Healthy to </span>
            <span className="text-[#FF4500]">Live.</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the joy of delicious, chef-crafted meals delivered right
            to your home. Fresh ingredients, amazing flavors, and healthy
            options for every meal.
          </p>
          <Button
            size="lg"
            className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white text-base md:text-lg px-8 md:px-12 py-6 md:py-7"
          >
            Order Now
          </Button>
        </div>
      </div>
    </section>
  );
}


