import MainLayout from "layouts/MainLayout";
import HomePage from "pages/HomePage";
import LoginPage from "pages/LoginPage";
import NotFoundPage from "pages/NotFoundPage";
import ProductPage from "pages/ProductPage";
import RegisterPage from "pages/RegisterPage";
import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "config";

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
