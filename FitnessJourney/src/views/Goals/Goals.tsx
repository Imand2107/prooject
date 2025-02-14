import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Paper,
  Button,
  Alert,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/system";
import { useAuth } from "../../contexts/AuthContext";

const GoalsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
               url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: theme.spacing(2),
}));

const GoalsCard = styled(Paper)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  padding: theme.spacing(5),
  borderRadius: "15px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
  width: "100%",
  maxWidth: "500px",
  border: "1px solid #e0e0e0",
}));

const GoalOption = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  border: "2px solid transparent",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
}));

const GoalIcon = styled(Box)(({ theme }) => ({
  width: "70px",
  height: "70px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(255, 107, 107, 0.1)",
  borderRadius: "50%",
  marginRight: theme.spacing(2),
  color: theme.palette.primary.main,
  fontSize: "2rem",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #ff6b6b, #ff466b)",
  color: "white",
  padding: theme.spacing(1.5),
  borderRadius: "8px",
  fontSize: "1.1rem",
  textTransform: "uppercase",
  letterSpacing: "2px",
  fontWeight: "bold",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 15px rgba(255, 107, 107, 0.4)",
    background: "linear-gradient(135deg, #ff6b6b, #ff466b)",
  },
}));

interface GoalsFormData {
  bodyType: "slim" | "average" | "heavy";
  workoutFrequency: string;
}

export const Goals: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<GoalsFormData>({
    bodyType: "average",
    workoutFrequency: "",
  });
  const [showFrequencyNote, setShowFrequencyNote] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (name === "workoutFrequency" && value === "5") {
        setShowFrequencyNote(true);
      } else if (name === "workoutFrequency") {
        setShowFrequencyNote(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser) {
      const bmiData = localStorage.getItem("bmiData");
      const goalsData = {
        userId: currentUser.uid,
        ...formData,
        bmiData: bmiData ? JSON.parse(bmiData) : null,
        timestamp: new Date(),
      };

      try {
        await window.FirebasePlugin.setDocumentInFirestoreCollection(
          `users/${currentUser.uid}/fitness_goals`,
          "current",
          goalsData,
          () => {
            console.log("Goals data saved successfully");
            navigate("/workout-plan");
          },
          (error: any) => {
            console.error("Error saving goals data:", error);
          }
        );
      } catch (error) {
        console.error("Error saving goals data:", error);
      }
    }
  };

  const bodyTypeOptions = [
    {
      value: "slim",
      label: "Slim",
      description:
        "Naturally lean body structure with difficulty gaining weight. Typically has a fast metabolism and long, thin muscles.",
      icon: "🏃",
    },
    {
      value: "average",
      label: "Average",
      description:
        "Balanced body composition with moderate muscle definition and average weight distribution.",
      icon: "💪",
    },
    {
      value: "heavy",
      label: "Heavy",
      description:
        "Larger body frame with naturally higher muscle mass or weight. Tends to gain weight more easily.",
      icon: "🏋️",
    },
  ];

  return (
    <GoalsContainer>
      <GoalsCard>
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Select Your Body Type
        </Typography>

        <form onSubmit={handleSubmit}>
          <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
            <RadioGroup
              name="bodyType"
              value={formData.bodyType}
              onChange={handleInputChange}
            >
              {bodyTypeOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={
                    <GoalOption>
                      <Box display="flex" alignItems="center">
                        <GoalIcon>{option.icon}</GoalIcon>
                        <Box>
                          <Typography variant="h6" color="primary">
                            {option.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {option.description}
                          </Typography>
                        </Box>
                      </Box>
                    </GoalOption>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel>Weekly Workout Frequency</FormLabel>
            <Select
              name="workoutFrequency"
              value={formData.workoutFrequency}
              onChange={handleInputChange}
              required
            >
              <MenuItem value="">Select workout days per week</MenuItem>
              <MenuItem value="2">2 days/week</MenuItem>
              <MenuItem value="3">3 days/week</MenuItem>
              <MenuItem value="4">4 days/week</MenuItem>
              <MenuItem value="5">5+ days/week</MenuItem>
            </Select>
          </FormControl>

          {showFrequencyNote && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Remember: When exercising 5+ days per week, it's crucial to:
              <ul>
                <li>Get adequate sleep (7-9 hours)</li>
                <li>Allow muscle groups to rest between workouts</li>
                <li>Stay well hydrated</li>
                <li>Listen to your body and avoid overtraining</li>
              </ul>
            </Alert>
          )}

          <StyledButton fullWidth type="submit">
            Create My Program
          </StyledButton>
        </form>
      </GoalsCard>
    </GoalsContainer>
  );
};

export default Goals;
