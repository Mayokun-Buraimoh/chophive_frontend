import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./App.css";
<<<<<<< HEAD
=======
// run once (e.g. app init)
import { v4 as uuid } from "uuid";

if (!localStorage.getItem("cart_id")) {
  localStorage.setItem("cart_id", uuid());
}

>>>>>>> 18491e4e4f3b633eaecc04e970ba281dd6245e46

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



