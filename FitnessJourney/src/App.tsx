import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Login from "./views/Login/Login";
import SignUp from "./views/SignUp/SignUp";
import BMI from "./views/BMI/BMI";
import Goals from "./views/Goals/Goals";
import WorkoutPlan from "./views/WorkoutPlan/WorkoutPlan";
import Settings from "./views/Settings/Settings";
import Achievements from "./views/Achievements/Achievements";
import SplashScreen from "./components/SplashScreen";
import { useAuth } from "./contexts/AuthContext";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#ff466b",
      dark: "#cc1b40",
      light: "#ff6b6b",
    },
    secondary: {
      main: "#6a0dad",
    },
  },
});

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          p={3}
          textAlign="center"
        >
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {this.state.error?.message || "An unexpected error occurred"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Reload App
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

const LoadingScreen = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

const App: React.FC = () => {
  console.log("App component rendering");
  const [showSplash, setShowSplash] = useState(true);
  const { currentUser, loading, initialized } = useAuth();

  console.log("Auth state:", { currentUser, loading, initialized, showSplash });

  useEffect(() => {
    console.log("App useEffect running");

    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => {
      console.log("Hiding splash screen");
      setShowSplash(false);
    }, 2000);

    return () => {
      console.log("App useEffect cleanup");
      clearTimeout(timer);
    };
  }, []);

  // Show loading screen while Firebase is initializing
  if (!initialized) {
    console.log("Waiting for Firebase initialization");
    return <LoadingScreen />;
  }

  // Show loading screen while checking auth state
  if (loading) {
    console.log("Showing loading screen");
    return <LoadingScreen />;
  }

  if (showSplash) {
    console.log("Showing initial splash screen");
    return <SplashScreen />;
  }

  console.log("Rendering main app content");
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route
            path="/"
            element={
              currentUser ? (
                <Navigate to="/workout-plan" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/bmi"
            element={currentUser ? <BMI /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/goals"
            element={currentUser ? <Goals /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/workout-plan"
            element={
              currentUser ? <WorkoutPlan /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/settings"
            element={
              currentUser ? <Settings /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/achievements"
            element={
              currentUser ? <Achievements /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
