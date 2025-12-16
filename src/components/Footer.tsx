import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-[#1E1E1E] border-t border-gray-800 py-12 md:py-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-8">
          {/* Logo and Slogan */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl md:text-3xl font-bold text-[#FF6B35] relative">
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
            </div>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
              Experience the joy of delicious, chef-crafted meals delivered
              right to your home with BiteBlitz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter Your Email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 flex-1"
              />
              <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Information
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  More Search
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Testimonial
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Event
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Term of Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Refund Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  All Cafeterias
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Site Map
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Help
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-[#FF6B35] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#FF6B35] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#FF6B35] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#FF6B35] transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
            <p className="text-gray-400 text-sm text-center sm:text-right">
              © 2025 ChopHive. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
