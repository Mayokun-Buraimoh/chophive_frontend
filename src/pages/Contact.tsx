import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
} from "lucide-react";

function Contact() {
  return (
    <div className="min-h-screen bg-[#1E1E1E]">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#A32110]/10 to-transparent py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#A32110] rounded-full mb-6">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Get in <span className="text-[#A32110]">Touch</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl">
              Have a question or feedback? We'd love to hear from you. Send us a
              message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-gray-700 shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Send us a Message
              </h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-300"
                    >
                      Your Name
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A32110] focus:ring-[#A32110] h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-300"
                    >
                      Email Address
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A32110] focus:ring-[#A32110] h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium text-gray-300"
                  >
                    Subject
                  </label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="What's this about?"
                    className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A32110] focus:ring-[#A32110] h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-gray-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full rounded-md border border-gray-700 bg-gray-900/50 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#A32110] focus:border-[#A32110] resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#A32110] hover:bg-[#A32110]/90 text-white h-12 text-base font-semibold"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Cards */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#A32110]/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-[#A32110]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Email</h3>
                      <p className="text-gray-400 text-sm">
                        support@tastyhub.com
                      </p>
                      <p className="text-gray-400 text-sm">info@tastyhub.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#A32110]/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-[#A32110]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Phone</h3>
                      <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
                      <p className="text-gray-400 text-sm">+1 (555) 987-6543</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#A32110]/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-[#A32110]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Address</h3>
                      <p className="text-gray-400 text-sm">
                        123 Food Street, Suite 100
                      </p>
                      <p className="text-gray-400 text-sm">
                        New York, NY 10001, USA
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#A32110]/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-[#A32110]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        Business Hours
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Monday - Friday: 9:00 AM - 8:00 PM
                      </p>
                      <p className="text-gray-400 text-sm">
                        Saturday - Sunday: 10:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Stay connected with us on social media for the latest updates,
                  special offers, and delicious food content.
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href="#"
                    className="w-12 h-12 bg-gray-700 hover:bg-[#A32110] rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-gray-700 hover:bg-[#A32110] rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-gray-700 hover:bg-[#A32110] rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a
                    href="#"
                    className="w-12 h-12 bg-gray-700 hover:bg-[#A32110] rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          {/* <div className="mt-12 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Find Us on the Map
            </h2>
            <div className="w-full h-64 md:h-96 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-[#A32110] mx-auto mb-4" />
                <p className="text-gray-400">
                  Interactive map would be integrated here
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  123 Food Street, Suite 100, New York, NY 10001
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </section>
    </div>
  );
}

export default Contact;



