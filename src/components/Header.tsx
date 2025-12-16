import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openCart, getTotalItems } = useCart();

  return (
    <header className="bg-[#FF6B35] border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={"/"}>
              <span className="text-2xl md:text-3xl font-bold text-[#1E1E1E] relative">
                <span className="relative inline-block">
                  <span className="relative">
                    C
                    <span className="absolute -top-0.5 left-0.5 text-[#FF6B35] text-sm leading-none">
                      🌿
                    </span>
                  </span>
                  hop
                </span>
                <span className="text-white">Hive</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 font-semibold">
            <Link
              to={"/"}
              className="text-white hover:text-[#1E1E1E] transition-colors"
            >
              Home
            </Link>
            <a
              href="#menu"
              className="text-white hover:text-[#1E1E1E] transition-colors"
            >
              Menu
            </a>
            <a
              href="#cafeterias"
              className="text-white hover:text-[#1E1E1E] transition-colors"
            >
              Cafeterias
            </a>
            <Link
              to="/contact"
              className="text-white hover:text-[#1E1E1E] transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          {/* Desktop Auth and Cart Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              className="border-2 border-[#1E1E1E] text-white bg-transparent hover:text-white hover:bg-[#1E1E1E] relative"
              onClick={openCart}
            >
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#1E1E1E] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>
            <Link to="/login">
              <Button
                variant="outline"
                className="border-2 border-[#1E1E1E] text-white bg-transparent hover:text-white hover:bg-[#1E1E1E]"
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-[#1E1E1E] hover:bg-transparent hover:border-[#1E1E1E] border-2 border-[#FF6B35] text-white">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-gray-800 font-semibold">
            <Link to={"/"} className="block text-white hover:text-white">
              Home
            </Link>
            <a href="#menu" className="block text-white hover:text-white">
              Menu
            </a>
            <a
              href="#cafeterias"
              className="block text-white hover:text-white"
            >
              Cafeterias
            </a>
            <Link
              to={"/contact"}
              className="block text-white hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
            <div className="flex flex-col space-y-2 pt-4">
              <Button
                variant="outline"
                className="w-full border-[#1E1E1E] bg-transparent text-white relative"
                onClick={() => {
                  openCart();
                  setMobileMenuOpen(false);
                }}
              >
                <ShoppingCart size={18} className="mr-2" />
                Cart
                {getTotalItems() > 0 && (
                  <span className="ml-2 bg-[#1E1E1E] text-white text-xs font-bold rounded-full px-2 py-0.5">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
              <Link to={"/login"} onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full border-[#1E1E1E] bg-transparent text-white"
                >
                  Login
                </Button>
              </Link>
              <Link to={"/signup"} onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-[#1E1E1E] hover:bg-[#1E1E1E]/90 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
