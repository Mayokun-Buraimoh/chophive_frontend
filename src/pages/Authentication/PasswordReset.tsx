/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../../../api";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Loader2, Mail, CheckCircle } from "lucide-react";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to send password reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="w-full max-w-md">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-700">
            {!success ? (
              <>
                <div className="text-center mb-6 md:mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Reset Password
                  </h1>
                  <p className="text-gray-400 text-sm md:text-base">
                    Enter your email address and we'll send you a password reset
                    link
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 md:p-4">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A32110] focus:ring-[#A32110]"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#A32110] hover:bg-[#A32110]/90 text-white h-11 md:h-12 text-base font-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    Remember your password?{" "}
                    <Link
                      to="/login"
                      className="text-[#A32110] hover:text-[#A32110]/80 font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-400 mx-auto mb-4 md:mb-6" />
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 md:mb-3">
                  Check Your Email
                </h2>
                <p className="text-gray-400 text-sm md:text-base mb-6 md:mb-8">
                  We've sent a password reset link to{" "}
                  <span className="text-white font-medium">{email}</span>
                </p>
                <Link to="/login">
                  <Button className="w-full bg-[#A32110] hover:bg-[#A32110]/90 text-white">
                    Back to Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}




