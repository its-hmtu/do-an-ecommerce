import Header from "components/Header";
import { UserProvider } from "contexts/UserContext";
import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <UserProvider>
      <Header />
      <Outlet />
    </UserProvider>
  );
};

export default MainLayout;
