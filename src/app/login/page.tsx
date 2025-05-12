"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, loginWithGoogle } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Head from "next/head";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CssBaseline,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import { Login as LoginIcon, ArrowForward, Subject } from "@mui/icons-material";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import LockIcon from "@mui/icons-material/Lock";
import DevicesIcon from "@mui/icons-material/Devices";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import SearchIcon from "@mui/icons-material/Search";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/");
    });
    return () => unsubscribe();
  }, [router]);
  // const theme = useTheme();
  const handleLogin = async () => {
    await loginWithGoogle();
    router.push("/");
  };

  const features = [
    {
      icon: <CloudDoneIcon sx={{ color: "#5046e5" }} />,
      text: "Real-time cloud sync",
    },
    {
      icon: <LockIcon sx={{ color: "#5046e5" }} />,
      text: "End-to-end encryption",
    },
    {
      icon: <DevicesIcon sx={{ color: "#5046e5" }} />,
      text: "Cross-platform access",
    },
    {
      icon: <FormatColorTextIcon sx={{ color: "#5046e5" }} />,
      text: "Rich text formatting",
    },
    { icon: <SearchIcon sx={{ color: "#5046e5" }} />, text: "Powerful search" },
  ];

  return (
    <>
      <Head>
        <title>Scribe – Smart Notes, Simplified</title>
        <meta
          name="description"
          content="Scribe helps you capture, organize, and access your notes anywhere with cloud sync, rich formatting, and zero clutter."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#5046e5" />
      </Head>

      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* App Bar */}
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Subject sx={{ fontSize: 32, color: "#5046e5" }} />
              <Typography variant="h6" fontWeight={700} color="#5046e5">
                Scribe
              </Typography>
            </Stack>

            <Button
              aria-label="Sign in with Google"
              onClick={handleLogin}
              variant="outlined"
              startIcon={<LoginIcon />}
              sx={{
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                color: "#5046e5",
                borderColor: "#5046e5",
                "&:hover": {
                  borderColor: "#4038d0",
                  backgroundColor: "rgba(80, 70, 229, 0.04)",
                },
              }}
            >
              Sign In
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ mt: 8 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={6}
            alignItems="center"
            justifyContent="center"
          >
            {/* Left Side - Hero Text */}
            <Box
              sx={{
                maxWidth: 600,
                textAlign: "center",
                mx: "auto", // Auto margin to center horizontally
                px: 2, // Padding for small screens
              }}
            >
              <Typography
                variant="h2"
                fontWeight={800}
                gutterBottom
                sx={{
                  fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.5rem" },
                  lineHeight: 1.2,
                  mb: 3,
                }}
              >
                Organize Your Thoughts with{" "}
                <Typography
                  component="span"
                  sx={{ color: "#5046e5" }}
                  variant="inherit"
                >
                  Scribe
                </Typography>
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                paragraph
                sx={{ mb: 4 }}
              >
                {/* The intuitive note-taking app that helps you capture ideas,
                organize projects, and remember what matters. Access your notes
                anywhere, anytime. */}
                The intuitive note-taking app that helps you capture ideas and
                remember what matters. Access your notes anywhere, anytime.
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                sx={{ mt: 4 }}
              >
                <Button
                  aria-label="Get Started with Scribe"
                  onClick={handleLogin}
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    backgroundColor: "#5046e5",
                    "&:hover": {
                      backgroundColor: "#4038d0",
                    },
                  }}
                >
                  Get Started
                </Button>
              </Stack>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 3, pl: 0.5 }}
              >
                Free forever. No ads. No hassle.
              </Typography>
            </Box>

            {/* Right Side - Feature Card */}
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                maxWidth: 400,
                bgcolor: "background.paper",
              }}
            >
              <Stack spacing={3}>
                <Typography variant="h5" fontWeight={600}>
                  Why Choose Scribe?
                </Typography>

                <Stack spacing={2}>
                  {features.map((feature, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      spacing={2}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: 20,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="body1">{feature.text}</Typography>
                    </Stack>
                  ))}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary">
                  Get started with Scribe today and experience the difference.
                </Typography>
              </Stack>
            </Paper>
          </Stack>
        </Container>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            bgcolor: "rgba(80, 70, 229, 0.1)",
            zIndex: -1,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: "50%",
            bgcolor: "rgba(80, 70, 229, 0.05)",
            zIndex: -1,
          }}
        />
      </Box>
    </>
  );
}
