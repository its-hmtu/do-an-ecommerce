import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import MainLayout from "layouts/MainLayout";
import LoginPage from "pages/LoginPage";

import { CssVarsProvider, CssBaseline, GlobalStyles } from "@mui/joy";

import { useEffect, useCallback, useState, lazy, Suspense } from "react";

import ToastMessageProvider from "contexts/ToastMessageContext";
import { createTheme, ThemeProvider } from "@mui/material";

import PATHS from "constants";

import Fallback from "components/Fallback";

const OrderDetail = lazy(() =>
  import("pages/OrdersPage/components/OrderDetail")
);
const OrderMassShip = lazy(() =>
  import("pages/OrdersPage/components/OrderMassShip")
);
const OrderTable = lazy(() => import("pages/OrdersPage/components/OrderTable"));
const DashboardPage = lazy(() => import("pages/DashboardPage"));
const ProductPage = lazy(() => import("pages/ProductPage"));
const ProductTable = lazy(() =>
  import("pages/ProductPage/components/ProductTable")
);
const ProductDetail = lazy(() =>
  import("pages/ProductPage/components/ProductDetail")
);
const ProductCreate = lazy(() =>
  import("pages/ProductPage/components/ProductCreate")
);
const CategoryPage = lazy(() => import("pages/CategoryPage"));
const CategoryTable = lazy(() =>
  import("pages/CategoryPage/components/CategoryTable")
);
const CategoryCreate = lazy(() =>
  import("pages/CategoryPage/components/CategoryCreate")
);
const CategoryEdit = lazy(() =>
  import("pages/CategoryPage/components/CategoryEdit")
);
const RolesPage = lazy(() => import("pages/RolesPage"));
const OrdersPage = lazy(() => import("pages/OrdersPage"));

const router = createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/products",
        element: <ProductPage />,
        children: [
          {
            path: "/products",
            element: <ProductTable />,
          },
          {
            path: "/products/:id",
            element: <ProductDetail />,
          },
          {
            path: "/products/create",
            element: <ProductCreate />,
          },
        ],
      },
      {
        path: "/orders",
        element: <OrdersPage />,
        children: [
          {
            path: "/orders",
            element: <OrderTable />,
          },
          {
            path: "/orders/:id",
            element: <OrderDetail />,
          },
          {
            path: "/orders/mass-ship",
            element: <OrderMassShip />,
          },
        ],
      },
      {
        path: "/categories",
        element: <CategoryPage />,
        children: [
          {
            path: "/categories",
            element: <CategoryTable />,
          },
          {
            path: "/categories/create",
            element: <CategoryCreate />,
          },
          {
            path: "/categories/:id/edit",
            element: <CategoryEdit />,
          },
        ],
      },
      {
        path: "/users",
        element: <div>Users</div>,
      },
      {
        path: "/profile",
        element: <div>Profile</div>,
      },
      {
        path: "/roles",
        element: <RolesPage />,
        children: [
          {
            path: "roles/create-new-role",
            element: <div>Role</div>,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  }
]);

function App() {
  const defaultTheme = createTheme({ palette: { mode: "light" } });

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssVarsProvider disableTransitionOnChange defaultMode="light">
        <CssBaseline />
        <GlobalStyles
          styles={{
            ":root": {
              "--Form-maxWidth": "800px",
              "--Transition-duration": "0.4s", // set to `none` to disable transitions
            },
          }}
        />
        <ToastMessageProvider>
          <RouterProvider router={router} />
        </ToastMessageProvider>
      </CssVarsProvider>
    </ThemeProvider>
  );
}

export default App;

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test secret API key.
