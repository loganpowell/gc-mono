import React, { useReducer, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from './routes';
import Arabic from './lang/ar.json';
import English from './lang/en.json';
import { IntlProvider } from 'react-intl';

const locale = navigator.language; // to detact users language

let lang;
if (locale.includes("en")) {
  lang = English;
} else {
  lang = Arabic; // currently setting arabic as default
}

const container = document.getElementById('root');
container.classList.add('root');
container.classList.add('is-dark');

const root = createRoot(container);

const router = createBrowserRouter([routes]);

root.render(
  <React.StrictMode>
    <IntlProvider locale ={locale} messages={lang}>
      <RouterProvider router={router} />
    </IntlProvider>
  </React.StrictMode>
);
