import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Mail, Lock, User, ChefHat } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signupSchema, type SignupFormData } from "../../lib/validations";

function Signup() {
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

  const onSubmit = async (data: SignupFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Signup data:", data);
      // TODO: Implement actual signup logic
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Decorative */}
          <div className="hidden md:flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#FF6B35]/20 to-[#FF6B35]/5 rounded-2xl border border-gray-800 h-full min-h-[500px]">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-[#FF6B35] rounded-full mb-6">
                <ChefHat className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">
                Join <span className="text-[#FF6B35]">TastyHub</span> Today
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
                      className={`pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 ${
                        errors.username
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
                      className={`pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 ${
                        errors.email
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
                      className={`pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FF6B35] focus:ring-[#FF6B35] h-12 ${
                        errors.password
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

                <div className="space-y-2 pt-2">
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-900 text-[#FF6B35] focus:ring-[#FF6B35] focus:ring-offset-gray-900"
                      {...register("terms")}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-gray-400 cursor-pointer"
                    >
                      I agree to the{" "}
                      <Link
                        to="#"
                        className="text-[#FF6B35] hover:text-[#FF6B35]/80"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="#"
                        className="text-[#FF6B35] hover:text-[#FF6B35]/80"
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
                  disabled={isSubmitting}
                  className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white h-12 text-base font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <Button
                    variant="outline"
                    className="w-full bg-gray-700 border-gray-700 text-gray-300 hover:bg-[#bd5028fd] hover:text-white h-12"
                  >
                    <FcGoogle size={18} className="mr-1" />
                    Google
                  </Button>
                </div>
              </div>

              <p className="mt-8 text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#FF6B35] hover:text-[#FF6B35]/80 font-semibold transition-colors"
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
