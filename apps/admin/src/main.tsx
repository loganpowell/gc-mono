import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { routes } from './routes'

const container = document.getElementById('app')

const root = createRoot(container)

const router = createBrowserRouter([routes])

const GOOGLE_API_CLIENT_ID = import.meta.env.GOOGLE_API_CLIENT_ID || ''
root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_API_CLIENT_ID}>
            <RouterProvider router={router} />
        </GoogleOAuthProvider>
    </React.StrictMode>
)
