import React from "react";
import MainLayout from "layouts/MainLayout";

import LoginPage from "pages/LoginPage";

import RegisterPage from "pages/RegisterPage";

import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "config";

const HomePage = React.lazy(() => import("pages/HomePage"));
const ProductPage = React.lazy(() => import("pages/ProductPage"));
const NotFoundPage = React.lazy(() => import("pages/NotFoundPage"));
const CartPage = React.lazy(() => import("pages/CartPage"));
const AccountPage = React.lazy(() => import("pages/AccountPage"));
const PaymentInfoPage = React.lazy(() => import("pages/PaymentInfoPage"));
const ContactPage = React.lazy(() => import("pages/ContactPage"));
const PaymentPage = React.lazy(() => import("pages/PaymentPage"));

export default createBrowserRouter([
  {
    path: PATHS.HOME, 
    element: <MainLayout />,
    children: [
      {
        path: PATHS.HOME,
        element: <HomePage />,
      },
      {
        path: PATHS.MOBILE,
        element: <div>Mobile</div>,
      },
      {
        path: PATHS.TABLET,
        element: <div>Tablet</div>,
      },
      {
        path: PATHS.PRODUCT,
        element: <ProductPage />
      },
      {
        path: PATHS.NOT_FOUND,
        element: <NotFoundPage />,
      },
      {
        path: PATHS.CONTACT,
        element: <ContactPage />,
      },
      {
        path: PATHS.CART,
        element: <CartPage />
      },
      {
        path: PATHS.PAYMENT_INFO,
        element: <PaymentInfoPage />
      },
      {
        path: PATHS.PAYMENT,
        element: <PaymentPage />
      },
      {
        path: PATHS.ACCOUNT_PAGE,
        element: <AccountPage />,
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
