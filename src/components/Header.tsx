import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, ShoppingCart, UserCircle, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { openCart, cart } = useCart();
  const { logout } = useAuth();
  const rtoken = localStorage.getItem("refresh_token");

  return (
    <header className="bg-[#FF4500] border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={"/"}>
              <span className="text-2xl md:text-3xl font-bold text-[#1E1E1E] relative">
                <span className="relative inline-block">
                  <span className="relative">
                    C
                    <span className="absolute -top-0.5 left-0.5 text-[#FF4500] text-sm leading-none">
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
            <Link
              to={"/food-menu"}
              className="text-white hover:text-[#1E1E1E] transition-colors"
            >
              Menu
            </Link>
            <Link
              to="/vendors"
              className="text-white hover:text-[#1E1E1E] transition-colors"
            >
              Cafeterias
            </Link>
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
              {(cart?.item_count ?? 0) > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#1E1E1E] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart?.item_count ?? 0}
                </span>
              )}
            </Button>
            {rtoken ? (
              <div>
                <Button
                  variant="outline"
                  className="border-2 border-[#1E1E1E] text-white bg-transparent hover:text-white hover:bg-[#1E1E1E]"
                  onClick={() => setProfileOpen((prev) => !prev)}
                >
                  <UserCircle size={20} />
                </Button>
                {profileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-[#1E1E1E] border border-gray-700 rounded-md shadow-lg z-50"
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <Link
                      to="/customer-profile"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Account
                    </Link>

                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Orders
                    </Link>

                    <Link
                      to="/password-reset"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
                      onClick={() => setProfileOpen(false)}
                    >
                      Reset Password
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="border-2 border-[#1E1E1E] text-white bg-transparent hover:text-white hover:bg-[#1E1E1E]"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[#1E1E1E] hover:bg-transparent hover:border-[#1E1E1E] border-2 border-[#FF4500] text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
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

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="md:hidden fixed inset-0 bg-black/70 z-40 top-16"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Menu */}
            <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-[#1E1E1E] z-50 shadow-2xl overflow-y-auto py-4 space-y-4 border-t border-gray-800 font-semibold">
              <Link to={"/"} className="block text-white hover:text-white">
                Home
              </Link>
              <Link
                to={"/food-menu"}
                className="block text-white hover:text-white"
              >
                Menu
              </Link>
              <Link
                to="/vendors"
                className="block text-white hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cafeterias
              </Link>
              <Link
                to={"/contact"}
                className="block text-white hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
              <div className="flex flex-col pt-4">
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
                  {(cart?.item_count ?? 0) > 0 && (
                    <span className="ml-2 bg-[#1E1E1E] text-white text-xs font-bold rounded-full px-2 py-0.5">
                      {cart?.item_count ?? 0}
                    </span>
                  )}
                </Button>
                {rtoken ? (
                  <div className="flex flex-col space-y-2 pt-4">
                    <Link
                      to="/customer-profile"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full border-[#1E1E1E] text-white bg-transparent "
                      >
                        My Account
                      </Button>
                    </Link>

                    <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-[#1E1E1E] text-white bg-transparent"
                      >
                        My Orders
                      </Button>
                    </Link>

                    <Link
                      to="/password-reset"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full border-[#1E1E1E] text-white bg-transparent"
                      >
                        Reset Password
                      </Button>
                    </Link>

                    <Button
                      onClick={logout}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Link
                      to={"/login"}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full border-[#1E1E1E] bg-transparent text-white"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link
                      to={"/signup"}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-[#1E1E1E] hover:bg-[#1E1E1E]/90 text-white">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}


