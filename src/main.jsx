import React from "react";
import ReactDOM from "react-dom/client";
import ChatGpt from "./ChatComponent.jsx";
import App from "./App.jsx";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/chatgpt",
    element: (
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: 10,
          display: "flex",
          alignItems: "center",
          backgroundColor: "#444",
        }}
      >
        <div style={{ width: 300 }}>
          <ChatGpt close />
        </div>
      </div>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div style={{ overflow: "hidden" }}>
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
);
