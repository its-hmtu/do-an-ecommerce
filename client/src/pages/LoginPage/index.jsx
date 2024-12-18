import React, { useState } from "react";
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
  CircularProgress,
} from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import {
  Error,
  Visibility,
  VisibilityOff,
  Google,
  BadgeRounded,
} from "@mui/icons-material";
import { Link as RLink , useNavigate } from "react-router-dom";
import { useLogin } from "hooks";
import { PATHS } from "config";

function LoginPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [cred, setCred] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [warning, setWarning] = useState({});
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: loginMutate, isPending: isLoginPending } = useLogin({
    email: cred.email,
    password: cred.password,
  });

  const handleChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
    console.log(cred);
  };

  const validateCredentials = (cred) => {
    const errors = {};

    if (!cred.email) {
      errors.email = "Email is required";
    } else if (
      !/^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        cred.email.toLowerCase()
      )
    ) {
      errors.email = "Email address is invalid";
    }
    if (!cred.password) {
      errors.password = "Password is required";
    } else if (cred.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
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
    }

    if (cred && cred.email && cred.password) {
      loginMutate(cred, {
        onSuccess: () => {
          navigate("/");
        },
        onError: (error) => {
          console.log(error);
          setError({
            message: error.response.data.message,
          });
          setShake(true);
          setTimeout(() => {
            setShake(false);
          }, 500);
        },
      });
    }
  };

  return (
    // Create a login form with Joy UI
    <Box
      sx={{
        width: { xs: "100%" },
        zIndex: 1,
        display: "flex",
        justifyContent: "center",
        backgroundColor: "rgba(255 255 255 / 0.2)",
      }}
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
        <Box
          component="header"
          sx={{ py: 3, display: "flex", justifyContent: "space-between" }}
        >
          <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
            <IconButton variant="soft" color="primary" size="sm">
              <BadgeRounded />
            </IconButton>
            <Typography level="title-lg">Exclusive</Typography>
          </Box>
        </Box>
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
          <Stack sx={{ gap: 4 }}>
            <Stack sx={{ gap: 1 }}>
              <Typography component="h1" level="h3">
                Log in to your account
              </Typography>
              <Typography level="body-sm">
                Don't have an account?{" "}
                <Link component={RLink} to={PATHS.REGISTER}>
                  <Typography
                    level="title-sm"
                    color="primary"
                    sx={{ textAlign: "center" }}
                  >
                    Register here.
                  </Typography>
                </Link>
              </Typography>
            </Stack>
            <Stack sx={{ gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Google />
                Continue with Google
              </Button>
              <Divider sx={{ borderColor: "background.level2" }}>Or</Divider>
            </Stack>
          </Stack>
          <Stack sx={{ gap: 2 }}>
            {error.message && (
              <Alert
                color={"danger"}
                sx={{
                  borderRadius: "md",
                  animation: shake ? "shake 0.5s" : "none",
                }}
              >
                <Error />
                <Typography color={"danger"}>{error.message}</Typography>
              </Alert>
            )}
            {warning.email && (
              <Alert
                color={"warning"}
                sx={{
                  borderRadius: "md",
                  animation: shake ? "shake 0.5s" : "none",
                }}
              >
                <Error />
                <Typography color={"warning"}>{warning.email}</Typography>
              </Alert>
            )}
            {warning.password && (
              <Alert
                color={"warning"}
                sx={{
                  borderRadius: "md",
                  animation: shake ? "shake 0.5s" : "none",
                }}
              >
                <Error />
                <Typography color={"warning"}>{warning.password}</Typography>
              </Alert>
            )}
            <form>
              <FormControl required>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={cred.email}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl required>
                <FormLabel>Password</FormLabel>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={cred.password}
                  onChange={handleChange}
                  endDecorator={
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  }
                />
              </FormControl>
              <Stack
                sx={{
                  gap: 2,
                  mt: 1,
                  justifyContent: "center",
                  alignItems: "start",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "start",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Checkbox size="sm" label="Remember me" name="persistent" />
                  <Link level="title-sm" href="#replace-with-a-link">
                    Forgot your password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={isLoginPending}
                  sx={{
                    // disabled background color
                    "&.MuiButton-root.Mui-disabled": {
                      backgroundColor: "rgb(24, 94, 165)",
                      cursor: "not-allowed",
                    },

                    // circular progress stroke color MUI
                    "& .MuiCircularProgress-progress": {
                      stroke: "#fff",
                    },
                  }}
                >
                  {isLoginPending ? (
                    <CircularProgress variant="plain" />
                  ) : (
                    "Login"
                  )}
                </Button>
                {/* {!isRegister} */}
              </Stack>
            </form>
          </Stack>
        </Box>
        <Box component="footer" sx={{ py: 3 }}>
          <Typography level="body-xs" sx={{ textAlign: "center" }}>
            © Exclusive {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
