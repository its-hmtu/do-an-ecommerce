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
  Button,
  Alert,
  CircularProgress,
} from "@mui/joy";
import {
  Error,
  Visibility,
  VisibilityOff,
  Google,
  BadgeRounded,
  Check,
  Close,
} from "@mui/icons-material";
import { useNavigate, Link as RLink } from "react-router-dom";
import { useRegister } from "hooks";
import { PATHS } from "config";

function RegisterPage() {
  const navigate = useNavigate();
  const [cred, setCred] = useState({
    email: "",
    username: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState({});
  const [warning, setWarning] = useState({});
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: registerMutate, isPending: isRegisterPending } = useRegister({
    email: cred.email,
    password: cred.password,
    username: cred.username,
    confirm_password: cred.confirm_password,
    first_name: cred.first_name,
    last_name: cred.last_name,
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
    } else if (cred.password !== cred.confirm_password) {
      errors.password = "Passwords do not match";
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

    if (
      cred &&
      cred.email &&
      cred.password &&
      cred.confirm_password &&
      cred.username &&
      cred.first_name &&
      cred.last_name
    ) {
      registerMutate(cred, {
        onSuccess: () => {
          navigate(PATHS.EMAIL_VERIFICATION, { state: { email: cred.email } });
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

  const renderValidatePass = () => {
    if (cred.password.length === 0) {
      return <Check />;
    }

    if (cred.password.length >= 8) {
      return <Check color="success" />;
    }

    if (cred.password.length < 8) {
      return <Close color="danger" />;
    }
  };

  const renderValPassNotIncludeEmail = () => {
    if (cred.password.length === 0) {
      return <Check />;
    }
    if (cred.password.length >= 8) {
      if (cred.password.includes(cred.email)) {
        return <Close color="danger" />;
      }
      return <Check color="success" />;
    }

    return <Check color="success" />;
  };

  return (
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
                Create an account
              </Typography>
              <Typography level="body-sm">
                Have an account?{" "}
                <Link component={RLink} to={PATHS.LOGIN}>
                  <Typography
                    level="title-sm"
                    color="primary"
                    sx={{ textAlign: "center" }}
                  >
                    Login here.
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
            <form style={{}}>
              <Stack
                direction="row"
                gap={2}
                width={"100%"}
                justifyContent={"space-between"}
              >
                <FormControl
                  required
                  sx={{
                    width: "45%",
                  }}
                >
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    name="first_name"
                    value={cred.first_name}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl
                  required
                  sx={{
                    width: "50%",
                  }}
                >
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    name="last_name"
                    value={cred.last_name}
                    onChange={handleChange}
                  />
                </FormControl>
              </Stack>
              <FormControl required>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  name="username"
                  value={cred.username}
                  onChange={handleChange}
                />
              </FormControl>
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

                <Stack sx={{ mt: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {renderValidatePass()}
                    <Typography level="body-sm" color="neutral">
                      Password must be at least 8 characters
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {
                      // password must not include email
                      renderValPassNotIncludeEmail()
                    }
                    <Typography level="body-sm" color="neutral">
                      Does not include your email
                    </Typography>
                  </Box>
                </Stack>
              </FormControl>

              <FormControl required>
                <FormLabel>Confirm password</FormLabel>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  value={cred.confirm_password}
                  onChange={handleChange}
                  endDecorator={
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                <Button
                  type="submit"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={isRegisterPending || Object.values(cred).some(value => !value)}
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
                  {isRegisterPending ? (
                    <CircularProgress variant="plain" />
                  ) : (
                    "Register"
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

export default RegisterPage;
