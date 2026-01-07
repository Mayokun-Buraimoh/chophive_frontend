/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Mail, Lock, User, ChefHat, Loader2 } from "lucide-react";
import { signupSchema, type SignupFormData } from "../../lib/validations";
import api, { syncCartOnSignup } from "../../../api";
import { useAuth } from "../../contexts/AuthContext";
import { useGoogleSignIn } from "../../hooks/useGoogleSignIn";
import { useState } from "react";
import { getGuestCart, clearGuestCart } from "../../lib/indexedDB";
import { getGuestCartId } from "../../lib/cart";

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      terms: false,
    },
  });

  // Get Google Client ID from environment variable
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const handleGoogleSuccess = async (credential: string) => {
    try {
      setGoogleLoading(true);

      // Get guest cart before Google sign-in (if exists)
      const guestCartId = getGuestCartId();
      const guestCartItems = await getGuestCart(guestCartId);

      // Send the credential to your backend
      const res = await api.post("/user/google-signin/", {
        credential,
      });

      const { refresh, access } = res.data;

      // Login user first to get authentication token
      login(access, refresh);

      // Sync guest cart to user account (SIGN-UP ONLY - Google creates account if new)
      if (guestCartItems && guestCartItems.length > 0) {
        try {
          // Prepare cart items for sync
          const cartItemsToSync = guestCartItems.map((item) => ({
            food_item_id: item.food_item_id,
            quantity: item.qty,
            price: item.price,
          }));

          // Sync cart to backend
          await syncCartOnSignup(cartItemsToSync);

          // Clear guest cart from IndexedDB after successful sync
          await clearGuestCart(guestCartId);
          console.log("Guest cart synced and cleared successfully");
        } catch (syncError: any) {
          console.error(
            "Cart sync error:",
            syncError.response?.data || syncError.message
          );
          // Don't block sign-up if cart sync fails
        }
      }

      navigate("/vendors");
    } catch (error: any) {
      console.error(
        "Google Sign-In error:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
        "Failed to sign in with Google. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = (error: Error) => {
    console.error("Google Sign-In initialization error:", error);
  };

  const { buttonRef } = useGoogleSignIn({
    clientId: GOOGLE_CLIENT_ID,
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    try {
      // Get guest cart before registration (if exists)
      // const guestCartId = getGuestCartId();
      // const guestCartItems = await getGuestCart(guestCartId);

      //Register
      await api.post("/user/register/", data);

      //Auto Login
      // const autoLogin = await api.post("/user/token/", {
      //   email: data.email,
      //   password: data.password,
      // });

      // const { refresh, access } = autoLogin.data;

      // Login user first to get authentication token
      // login(access, refresh);

      // Sync guest cart to user account (SIGN-UP ONLY)
      // if (guestCartItems && guestCartItems.length > 0) {
      //   try {
      //     // Prepare cart items for sync
      //     const cartItemsToSync = guestCartItems.map((item) => ({
      //       food_item_id: item.food_item_id,
      //       quantity: item.qty,
      //       price: item.price,
      //     }));

      //     // Sync cart to backend
      //     await syncCartOnSignup(cartItemsToSync);

      //     // Clear guest cart from IndexedDB after successful sync
      //     await clearGuestCart(guestCartId);
      //     console.log("Guest cart synced and cleared successfully");
      //   } catch (syncError: any) {
      //     console.error(
      //       "Cart sync error:",
      //       syncError.response?.data || syncError.message
      //     );
      //     // Don't block sign-up if cart sync fails
      //   }
      // }

      // Save email and password in localStorage for auto-login after verify
      localStorage.setItem("pending_email", data.email);
      localStorage.setItem("pending_password", data.password);
      navigate("/signup?verify=1&email=" + encodeURIComponent(data.email));
    } catch (error: any) {
      console.error("Signup error:", error.response?.data || error.message);
    }
  };

  // Show email verification notice if just registered
  const [searchParams] =
    typeof window !== "undefined"
      ? [new URLSearchParams(window.location.search)]
      : [new URLSearchParams()];
  const showVerifyNotice = searchParams.get("verify") === "1";

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Decorative */}
          <div className="hidden md:flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#A32110]/20 to-[#A32110]/5 rounded-2xl border border-gray-800 h-full min-h-[500px]">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-[#A32110] rounded-full mb-6">
                <ChefHat className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">
                Join{" "}
                <span className="text-2xl md:text-3xl font-bold text-[#1E1E1E] relative">
                  <span className="relative inline-block text-[#A32110]">
                    <span className="relative">
                      C
                      <span className="absolute -top-0.5 left-0.5 text-[#A32110] text-sm leading-none">
                        🌿
                      </span>
                    </span>
                    hop
                  </span>
                  <span className="text-white">Hive</span>
                </span>{" "}
                Today
              </h1>
              <p className="text-gray-400 text-lg">
                Create your account and start enjoying fresh, healthy meals
                delivered right to your doorstep.
              </p>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="w-full">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-gray-700 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Create Account
                </h2>
                <p className="text-gray-400">
                  Enter your details to get started
                </p>
              </div>

              {showVerifyNotice && (
                <div className="bg-green-900/80 border border-green-900 rounded-lg p-4 my-4 text-center">
                  <h3 className="text-lg font-semibold text-green-300 mb-1">
                    Verify Your Email
                  </h3>
                  <p className="text-green-100">
                    Thanks for signing up! Please check your email and click the
                    verification link to activate your account.
                    <br />
                    Once verified, you can log in.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-300"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      id="username"
                      placeholder="Choose a username"
                      className={`pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A32110] focus:ring-[#A32110] h-12 ${errors.username
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                        }`}
                      {...register("username")}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-300"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      className={`pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A32110] focus:ring-[#A32110] h-12 ${errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                        }`}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="password"
                      id="password"
                      placeholder="Create a strong password"
                      className={`pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A32110] focus:ring-[#A32110] h-12 ${errors.password
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                        }`}
                      {...register("password")}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Must contain uppercase, lowercase, and a number
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password2"
                    className="text-sm font-medium text-gray-300"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="password"
                      id="password2"
                      placeholder="Confirm your password"
                      className={`pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#A32110] focus:ring-[#A32110] h-12 ${errors.password2
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                        }`}
                      {...register("password2")}
                    />
                  </div>
                  {errors.password2 && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password2.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-900 text-[#A32110] focus:ring-[#A32110] focus:ring-offset-gray-900"
                      {...register("terms")}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-gray-400 cursor-pointer"
                    >
                      I agree to the{" "}
                      <Link
                        to="#"
                        className="text-[#A32110] hover:text-[#A32110]/80"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="#"
                        className="text-[#A32110] hover:text-[#A32110]/80"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.terms.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || showVerifyNotice}
                  className="w-full bg-[#A32110] hover:bg-[#A32110]/90 text-white h-12 text-base font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-800/50 text-gray-400">
                      Or sign up with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4">
                  <div
                    ref={buttonRef}
                    className="flex justify-center"
                    style={{ minHeight: "48px" }}
                  />
                  {googleLoading && (
                    <p className="text-sm text-gray-400 text-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing up with Google...
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-8 text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#A32110] hover:text-[#A32110]/80 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
