import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/system";
import { useAuth } from "../../contexts/AuthContext";

const BMIContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
               url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: theme.spacing(2),
}));

const BMICard = styled(Paper)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  padding: theme.spacing(5),
  borderRadius: "15px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
  width: "100%",
  maxWidth: "500px",
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

interface BMIFormData {
  gender: "male" | "female";
  age: string;
  weight: string;
  height: string;
}

interface BMIResult {
  bmi: number;
  category: string;
  description: string;
  color: string;
}

export const BMI: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<BMIFormData>({
    gender: "male",
    age: "",
    weight: "",
    height: "",
  });
  const [result, setResult] = useState<BMIResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateBMI = () => {
    const height = parseFloat(formData.height) / 100; // convert cm to m
    const weight = parseFloat(formData.weight);
    const bmi = weight / (height * height);

    let category: string;
    let color: string;
    let description: string;

    if (bmi < 18.5) {
      category = "Underweight";
      color = "#17a2b8";
      description = `Being underweight can indicate nutritional deficiencies and may affect your overall health. 
        Consider consulting with a nutritionist to develop a healthy weight gain plan that includes:
        • Nutrient-dense foods
        • Protein-rich meals
        • Healthy caloric surplus
        • Strength training exercises`;
    } else if (bmi < 25) {
      category = "Normal weight";
      color = "#28a745";
      description = `Congratulations! You're at a healthy weight. To maintain this:
        • Continue balanced nutrition
        • Regular exercise (150 minutes/week)
        • Mix of cardio and strength training
        • Stay hydrated
        • Get adequate sleep`;
    } else if (bmi < 30) {
      category = "Overweight";
      color = "#ffc107";
      description = `Being overweight may increase health risks. Consider these steps:
        • Create a moderate caloric deficit
        • Increase physical activity
        • Focus on whole foods
        • Regular exercise routine
        • Consider working with a fitness professional`;
    } else {
      category = "Obesity";
      color = "#dc3545";
      description = `Obesity can lead to various health complications. It's recommended to:
        • Consult with healthcare providers
        • Develop a structured weight loss plan
        • Start with low-impact exercises
        • Make sustainable lifestyle changes
        • Consider professional support`;
    }

    setResult({ bmi, category, description, color });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    calculateBMI();

    // Save BMI data to Firestore
    if (currentUser) {
      const bmiData = {
        userId: currentUser.uid,
        ...formData,
        bmi: result?.bmi,
        category: result?.category,
        timestamp: new Date(),
      };

      try {
        await window.FirebasePlugin.getDocumentFromFirestoreCollection(
          `users/${currentUser.uid}/health_data`,
          "bmi",
          () => {
            console.log("BMI data saved successfully");
            navigate("/goals");
          },
          (error: any) => {
            console.error("Error saving BMI data:", error);
          }
        );
      } catch (error) {
        console.error("Error saving BMI data:", error);
      }
    }
  };

  return (
    <BMIContainer>
      <BMICard>
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          BMI Calculator
        </Typography>

        <form onSubmit={handleSubmit}>
          <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              row
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
            </RadioGroup>
          </FormControl>

          <TextField
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleInputChange}
            margin="normal"
            required
            inputProps={{ min: 15, max: 100 }}
          />

          <TextField
            fullWidth
            label="Weight (kg)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleInputChange}
            margin="normal"
            required
            inputProps={{ min: 20, max: 300, step: 0.1 }}
          />

          <TextField
            fullWidth
            label="Height (cm)"
            name="height"
            type="number"
            value={formData.height}
            onChange={handleInputChange}
            margin="normal"
            required
            inputProps={{ min: 100, max: 250, step: 0.1 }}
          />

          <StyledButton fullWidth type="submit" sx={{ mt: 3 }}>
            Calculate BMI
          </StyledButton>
        </form>

        {result && (
          <Box sx={{ mt: 4 }}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: `${result.color}20`,
                color: result.color,
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Your BMI: {result.bmi.toFixed(1)}
              </Typography>
              <Typography variant="subtitle1">
                Category: {result.category}
              </Typography>
            </Paper>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recommendations
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: "pre-line" }}
              >
                {result.description}
              </Typography>
            </Box>

            <StyledButton
              fullWidth
              onClick={() => navigate("/goals")}
              sx={{ mt: 3 }}
            >
              Set Your Fitness Goals
            </StyledButton>
          </Box>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            BMI Categories
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Underweight: < 18.5" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Normal weight: 18.5 - 24.9" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Overweight: 25 - 29.9" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Obesity: ≥ 30" />
            </ListItem>
          </List>
        </Box>
      </BMICard>
    </BMIContainer>
  );
};

export default BMI;
