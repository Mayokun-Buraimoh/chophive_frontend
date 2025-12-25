import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Cart from "./components/Cart";
import Home from "./pages/Home/Home";
import Login from "./pages/Authentication/Login";
import Signup from "./pages/Authentication/Signup";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import "./App.css";
import { FoodProvider } from "./contexts/FoodContext";
import CustomerProfile from "./pages/CustomerProfile";
import { AuthProvider } from "./contexts/AuthContext";

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
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/customer-profile" element={<CustomerProfile />} />
            </Routes>
            <Cart />
          </BrowserRouter>
        </FoodProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
