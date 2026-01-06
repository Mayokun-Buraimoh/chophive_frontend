import Header from "../../components/Header";
import Hero from "./Hero";
import FeaturedFoods from "./FeaturedFoods";
import AboutChopHive from "./AboutChopHive";
import MostPopularFood from "./MostPopularFood";
import OurDishes from "./OurDishes";
import WhyChooseUs from "./WhyChooseUs";
import Testimonials from "./Testimonials";
import Footer from "../../components/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] scrollbar-thin scrollbar-webkit">
      <Header />
      <main>
        <Hero />
        <FeaturedFoods />
        <AboutChopHive />
        <MostPopularFood />
        <OurDishes />
        <WhyChooseUs />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

export default Home;



