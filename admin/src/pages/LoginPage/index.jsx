import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Stack,
  Link,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Button,
  Alert,
  CircularProgress
} from "@mui/joy";
import { adminLogin } from "api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Error } from "@mui/icons-material";
function LoginPage() {
  const queryClient = useQueryClient();
  const [cred, setCred] = useState({ email: "", password: "" });
  const [error, setError] = useState({});
  const [warning, setWarning] = useState({});
  const [shake, setShake] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      console.log(data);
      if (data.status !== 200) {
        setError({
          message: data.message,
        });
        setShake(true);
        setTimeout(() => {
          setShake(false);
        }, 500);
      } else {
        queryClient.setQueryData("admin", data);
        console.log(data);
        alert(data);
      }
    },
    onError: (error) => {
      console.log(error);
      setError({
        message: error.message,
      });
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 500);
    },
  });

  useEffect(() => {
    console.log(isPending)
  }, [isPending])

  const handleChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
    console.log(cred);
  };

  const validateCredentials = (cred) => {
    const errors = {};
    if (!cred.email) {
      errors.email = "Email is required";
    } else if (!/^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(cred.email)) {
      errors.email = "Email address is invalid";
    }
    if (!cred.password) {
      errors.password = "Password is required";
    } else if (cred.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({}); // Clear previous error
    setWarning({}); // Clear previous warning
    const errors = validateCredentials(cred);
    if (Object.keys(errors).length) {
      setWarning(errors);
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 500);
      return;
    } else {
      mutate(cred);
    }
  };

  return (
    // Create a login form with Joy UI
    <>
      <Box
        sx={(theme) => ({
          width: { xs: "100%", md: "50vw" },
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255 255 255 / 0.2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19 19 24 / 0.4)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width: "100%",
            px: 2,
          }}
        >
          {/* <Box
              component="header"
              sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}
            >
              <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                <IconButton variant="soft" color="primary" size="sm">
                  <BadgeRoundedIcon />
                </IconButton>
                <Typography level="title-lg">Company logo</Typography>
              </Box>
              <ColorSchemeToggle />
            </Box> */}
          <Box
            component="main"
            sx={{
              my: "auto",
              py: 2,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "sm",
              "& form": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: "hidden",
              },
            }}
          >
            <Stack sx={{ gap: 4, mb: 2 }}>
              <Stack sx={{ gap: 1 }}>
                <Typography component="h1" level="h3">
                  Welcome back!
                </Typography>
                <Typography level="body-sm">
                  Login with your admin account to continue.
                  {/* <Link href="#replace-with-a-link" level="title-sm">
                      Sign up!
                    </Link> */}
                </Typography>
              </Stack>
            </Stack>
            <Stack sx={{ gap: 2, mt: 2 }}>
              {
                error.message && (
                  <Alert color={"danger"} sx={{ borderRadius: "md", 
                    animation: shake ? "shake 0.5s" : "none"
                  }}>
                    <Error  />
                    <Typography color={"danger"}>{error.message}</Typography>
                  </Alert>
                )
              }
              {
                warning.email && (
                  <Alert color={"warning"} sx={{ borderRadius: "md", 
                    animation: shake ? "shake 0.5s" : "none"
                  }}>
                    <Error  />
                    <Typography color={"warning"}>{warning.email}</Typography>
                  </Alert>
                )
              }
              {
                warning.password && (
                  <Alert color={"warning"} sx={{ borderRadius: "md", 
                    animation: shake ? "shake 0.5s" : "none"
                  }}>
                    <Error  />
                    <Typography color={"warning"}>{warning.password}</Typography>
                  </Alert>
                )
              }
              <form>
                <FormControl required>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" name="email" value={cred.email} onChange={handleChange} />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    value={cred.password}
                    onChange={handleChange}
                  />
                </FormControl>
                <Stack sx={{ gap: 4, mt: 2 }}>
                  {/* <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Checkbox size="sm" label="Remember me" name="persistent" />
                      <Link level="title-sm" href="#replace-with-a-link">
                        Forgot your password?
                      </Link>
                    </Box> */}
                  <Button type="submit" fullWidth onClick={handleSubmit} disabled={isPending}
                    sx={{ 
                      // disabled background color
                      "&.MuiButton-root.Mui-disabled": {
                        backgroundColor: "rgb(24, 94, 165)",
                        cursor: "not-allowed",
                      }
                    }}
                  >
                    {
                      isPending ? <CircularProgress variant="plain"/>: "Login"
                    }
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" sx={{ textAlign: "center" }}>
              © Your company {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: "50vw" },
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage:
              "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)",
          },
        })}
      />
    </>
  );
}

export default LoginPage;
