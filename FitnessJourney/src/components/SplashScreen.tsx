import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";

const SplashScreen: React.FC = () => {
  console.log("SplashScreen rendering");

  useEffect(() => {
    console.log("SplashScreen mounted");
    return () => {
      console.log("SplashScreen unmounted");
    };
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: "linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)",
        color: "white",
      }}
    >
      <Typography variant="h2" component="h1" fontWeight="bold">
        Fitness Journey
      </Typography>
    </Box>
  );
};

export default SplashScreen;
