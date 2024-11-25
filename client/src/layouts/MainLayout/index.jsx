import Header from "components/Header";
import Footer from "components/Footer";
import { UserProvider } from "contexts/UserContext";
import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = () => {
  return (
    <UserProvider>
      <Header />
      <Outlet />
      <ToastContainer stacked />
      <Footer />
    </UserProvider>
  );
};

export default MainLayout;
