import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "layouts/MainLayout";
import LoginPage from "pages/LoginPage";
import DashboardPage from "pages/DashboardPage";
import { CssVarsProvider, CssBaseline, GlobalStyles } from "@mui/joy";
import OrdersPage from "pages/OrdersPage";
import RolesPage from "pages/RolesPage";
import { useEffect } from "react";
import ProductPage from "pages/ProductPage";
import ProductTable from "pages/ProductPage/components/ProductTable";
import ProductDetailsPage from "pages/ProductDetailsPage";
import CategoryPage from "pages/CategoryPage";
import CategoryTable from "pages/CategoryPage/components/CategoryTable";
import CategoryEdit from "pages/CategoryPage/components/CategoryEdit";
import CategoryCreate from "pages/CategoryPage/components/CategoryCreate";
import ToastMessageProvider from "contexts/ToastMessageContext";
import { createTheme, ThemeProvider } from "@mui/material";
import ProductDetail from "pages/ProductPage/components/ProductDetail";
import ProductCreate from "pages/ProductPage/components/ProductCreate";


const router = createBrowserRouter([
  {
    path: "/",
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
            element: <ProductCreate />
          }
        ],
      },
      {
        path: "/orders",
        element: <OrdersPage />,
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
  },
]);

function App() {
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.navigate("/login");
    }
  }, []);

  const defaultTheme = createTheme({palette: {mode: "light"}});

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
