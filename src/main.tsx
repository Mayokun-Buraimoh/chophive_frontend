import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./App.css";
// run once (e.g. app init)
import { v4 as uuid } from "uuid";

if (!localStorage.getItem("cart_id")) {
  localStorage.setItem("cart_id", uuid());
}


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



