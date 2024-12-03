import React from "react";
import MainLayout from "layouts/MainLayout";

import LoginPage from "pages/LoginPage";

import RegisterPage from "pages/RegisterPage";

import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "config";
import CheckoutPage from "pages/CheckoutPage";
import ReturnPage from "pages/ReturnPage";
import { brands } from "config/constants";
import AccountManage from "pages/AccountPage/component/AccountManage";
import EmailVerificationPage from "pages/EmailVerificationPage";
import SearchResultPage from "pages/SearchResultPage";

const HomePage = React.lazy(() => import("pages/HomePage"));
const ProductPage = React.lazy(() => import("pages/ProductPage"));
const NotFoundPage = React.lazy(() => import("pages/NotFoundPage"));
const CartPage = React.lazy(() => import("pages/CartPage"));
const AccountPage = React.lazy(() => import("pages/AccountPage"));
const PaymentInfoPage = React.lazy(() => import("pages/PaymentInfoPage"));
const ContactPage = React.lazy(() => import("pages/ContactPage"));
const PaymentPage = React.lazy(() => import("pages/PaymentPage"));
const BrowseBrandPage = React.lazy(() => import("pages/BrowseBrandPage"));
const BrowseSeriesPage = React.lazy(() => import("pages/BrowseSeriesPage"));
const BrowseCategoryPage = React.lazy(() => import("pages/BrowseCategoryPage"));
const OrderPage = React.lazy(() => import("pages/OrderPage"));

const routes = [
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
        element: <BrowseCategoryPage />,
      },
      {
        path: PATHS.TABLET,
        element: <BrowseCategoryPage />,
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
        children: [
          {
            path: PATHS.ACCOUNT_PAGE,
            element: <AccountManage />
          },
          {
            path: PATHS.MY_ORDERS,
            element: <OrderPage />
          }
        ]
      },
      {
        path: PATHS.BROWSE_SERIES,
        element: <BrowseSeriesPage />
      },
      {
        path: PATHS.BROWSE_BRAND,
        element: <BrowseBrandPage />
      },
      {
        path: PATHS.BROWSE_CATEGORY,
        element: <BrowseCategoryPage />
      },
      {
        path: PATHS.SEARCH_RESULTS,
        element: <SearchResultPage />
      }
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
  {
    path: PATHS.EMAIL_VERIFICATION,
    element: <EmailVerificationPage />
  },
  {
    path: '/checkout',
    element: <CheckoutPage />
  },
  {
    path: '/return',
    element: <ReturnPage />
  }
]

export default createBrowserRouter(routes);
