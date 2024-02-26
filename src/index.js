import React, { useReducer, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from './routes';

const container = document.getElementById('root');
container.classList.add('root');
container.classList.add('is-dark');

const root = createRoot(container);

const router = createBrowserRouter([routes]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
