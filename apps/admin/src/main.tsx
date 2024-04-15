import React, { useReducer, useEffect } from "react";
import "./main.css";
import "@repo/ui/styles.css";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { routes } from "./routes";

const container = document.getElementById("app") as HTMLElement;

const root = createRoot(container);

const router = createBrowserRouter([routes]);

const GAPID = process.env.VITE_GOOGLE_API_CLIENT_ID as string;
// console.log({ GAPID });
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GAPID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
