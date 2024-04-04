// import '@repo/ui/styles.css'
// import './main.css'
// import { createRoot } from 'react-dom/client'
// import Page from './page'
// import Stub from '@components/Stub'
// const container = document.getElementById('app')

// const root = createRoot(container as HTMLElement)

// root.render(
//     <>
//         <Stub />
//         <Page />
//     </>
// )

import { H } from "highlight.run";

H.init("6gl9vozg", {
  serviceName: "gaza-care-app",
  tracingOrigins: true,
  networkRecording: {
    enabled: true,
    recordHeadersAndBody: true,
    urlBlocklist: [
      // insert full or partial urls that you don't want to record here
      // Out of the box, Highlight will not record these URLs (they can be safely removed):
      "https://www.googleapis.com/identitytoolkit",
      "https://securetoken.googleapis.com",
    ],
  },
});

import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "@highlight-run/react";

import { routes } from "./routes";
import Arabic from "@lang/ar.json";
import English from "@lang/en.json";
import { IntlProvider } from "react-intl";

const locale = navigator.language; // to detact users language

let lang;
if (locale.includes("en")) {
  lang = English;
} else {
  lang = Arabic; // currently setting arabic as default
}

const container = document.getElementById("app") as HTMLElement;
container.classList.add("root");
container.classList.add("is-dark");

const root = createRoot(container);

const router = createBrowserRouter([routes]);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <IntlProvider locale={locale} messages={lang}>
        <RouterProvider router={router} />
      </IntlProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
