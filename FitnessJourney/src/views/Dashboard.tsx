import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import {
  Container,
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ScaleIcon from "@mui/icons-material/Scale";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to FitnessJourney
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {currentUser?.email}
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <FitnessCenterIcon sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6">Workout Tracking</Typography>
                <Typography variant="body2" color="text.secondary">
                  Track your workouts and monitor your progress
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/workout")}
                >
                  Start Workout
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <ScaleIcon sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6">BMI Calculator</Typography>
                <Typography variant="body2" color="text.secondary">
                  Calculate and track your Body Mass Index
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/bmi")}
                >
                  Calculate BMI
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleLogout}
          sx={{ mt: 4 }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
