import { z } from "zod";

// Login form validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Signup form validation schema
export const signupSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    password2: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords don't match",
    path: ["password2"], // This will show the error on the password2 field
  });

export type SignupFormData = z.infer<typeof signupSchema>;

// Checkout form validation schema
export const checkoutSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Full name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\+?[\d\s-()]+$/, "Please enter a valid phone number"),
    address: z
      .string()
      .min(1, "Address is required")
      .min(5, "Please enter a complete address"),
    city: z
      .string()
      .min(1, "City is required")
      .min(2, "City must be at least 2 characters"),
    state: z
      .string()
      .min(1, "State is required")
      .min(2, "State must be at least 2 characters"),
    zipCode: z
      .string()
      .min(1, "ZIP code is required")
      .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
    deliveryInstructions: z.string().optional(),
    paymentMethod: z.enum(["card", "cash", "paypal"], {
      required_error: "Please select a payment method",
    }),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCVC: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "card") {
        return (
          data.cardNumber && data.cardName && data.cardExpiry && data.cardCVC
        );
      }
      return true;
    },
    {
      message: "Card details are required when paying with card",
      path: ["cardNumber"],
    }
  );

export type CheckoutFormData = z.infer<typeof checkoutSchema>;


