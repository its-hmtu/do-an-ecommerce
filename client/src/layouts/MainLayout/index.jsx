import Header from "components/Header";
import Footer from "components/Footer";
import { UserProvider } from "contexts/UserContext";
import React, { useContext, useEffect, useState } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/joy";
import { ArrowUpwardRounded } from "@mui/icons-material";

const MainLayout = () => {
  const [isShowScrollToTop, setIsShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsShowScrollToTop(true);
      } else {
        setIsShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <ScrollRestoration />
      <UserProvider>
        <Header />
        <Outlet />
        <ToastContainer stacked />
        <Footer />

        {
          // Scroll to top button
          isShowScrollToTop && (
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              variant="soft"
              color="primary"
              sx={{
                position: "fixed",
                right: "50px",
                bottom: "50px",
                zIndex: 9999,
                borderRadius: "50%",
                padding: "10px",
                // color: "white",
              }}
            >
              <ArrowUpwardRounded />
            </Button>
          )
        }
      </UserProvider>
    </>
  );
};

export default MainLayout;
