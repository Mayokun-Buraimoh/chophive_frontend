import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Cart from "./components/Cart";
import Home from "./pages/Landing/Home";
import Login from "./pages/Authentication/Login";
import Signup from "./pages/Authentication/Signup";
import VerifyEmail from "./pages/Authentication/VerifyEmail";
import Contact from "./pages/Contact";
import CheckoutDetails from "./pages/CheckoutDetails";
import OrderSuccess from "./pages/OrderSuccess";
import "./App.css";
import { FoodProvider } from "./contexts/FoodContext";
import CustomerProfile from "./pages/CustomerProfile";
import { AuthProvider } from "./contexts/AuthContext";
import FoodDetails from "./pages/FoodDetails";
import VendorDetails from "./pages/VendorDetails";
import Orders from "./pages/Orders";
import Vendors from "./pages/Vendors";
import PasswordReset from "./pages/Authentication/PasswordReset";
import PasswordChange from "./pages/Authentication/PasswordChange";
import AccountNumber from "./pages/AccountNumber";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FoodProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/checkout/:orderOid" element={<CheckoutDetails />} />
              <Route path="/payment-account" element={<AccountNumber />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/customer-profile" element={<CustomerProfile />} />
              <Route path="/food/:itemId" element={<FoodDetails />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/vendors/:vendorName" element={<VendorDetails />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path="/create-new-password" element={<PasswordChange />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
            </Routes>
            <Cart />
          </BrowserRouter>
        </FoodProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
