import React from "react";
import MainLayout from "layouts/MainLayout";

import LoginPage from "pages/LoginPage";

import RegisterPage from "pages/RegisterPage";
import ContactPage from "pages/ContactPage";
import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "config";

const HomePage = React.lazy(() => import("pages/HomePage"));
const ProductPage = React.lazy(() => import("pages/ProductPage"));
const NotFoundPage = React.lazy(() => import("pages/NotFoundPage"));

export default createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/mobile",
        element: <div>Mobile</div>,
      },
      {
        path: "/tablet",
        element: <div>Tablet</div>,
      },
      {
        path: '/products/:path',
        element: <ProductPage />
      },
      {
        path: PATHS.NOT_FOUND,
        element: <NotFoundPage />,
      },
      {
        path: `${PATHS.CONTACT}`,
        element: <ContactPage />,
      },
    ],
  },
  {
    path: PATHS.LOGIN,
    element: <LoginPage />,
  },
  {
    path: PATHS.REGISTER,
    element: <RegisterPage />,
  },
]);
