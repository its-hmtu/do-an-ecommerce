import MainLayout from "layouts/MainLayout";
import HomePage from "pages/HomePage";
import LoginPage from "pages/LoginPage";
import NotFoundPage from "pages/NotFoundPage";
import RegisterPage from "pages/RegisterPage";
import { createBrowserRouter } from "react-router-dom";

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
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "/account/login",
    element: <LoginPage />,
  },
  {
    path: "/account/register",
    element: <RegisterPage />,
  },
]);
