import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import { styled } from "@mui/system";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";

const WorkoutContainer = styled(Box)(({ theme }) => ({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(10),
}));

const WorkoutCategory = styled(Paper)(({ theme }) => ({
  background: "white",
  borderRadius: "16px",
  padding: theme.spacing(2.5),
  boxShadow: "0 4px 0 #e5e5e5",
  border: "2px solid #e5e5e5",
  marginBottom: theme.spacing(3),
}));

const WorkoutCard = styled(Card)(({ theme }) => ({
  background: "#f7f7f7",
  borderRadius: "20px",
  overflow: "hidden",
  border: "2px solid #e5e5e5",
  boxShadow: "0 4px 0 #e5e5e5",
  cursor: "pointer",
  transition: "all 0.2s ease",
  display: "flex",
  flexDirection: "column",
  minHeight: "200px",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 0 #e5e5e5",
  },
  "&:active": {
    transform: "translateY(2px)",
    boxShadow: "0 2px 0 #e5e5e5",
  },
}));

const WorkoutImage = styled(CardMedia)(({ theme }) => ({
  width: "100%",
  height: "200px",
  objectFit: "cover",
}));

const DifficultyChip = styled(Chip)<{
  difficulty: "beginner" | "intermediate" | "advanced";
}>(({ theme, difficulty }) => {
  const colors = {
    beginner: {
      bg: "#e8f5e9",
      color: "#4caf50",
      border: "#4caf50",
    },
    intermediate: {
      bg: "#fff3e0",
      color: "#ff9800",
      border: "#ff9800",
    },
    advanced: {
      bg: "#ffebee",
      color: "#f44336",
      border: "#f44336",
    },
  };

  return {
    backgroundColor: colors[difficulty].bg,
    color: colors[difficulty].color,
    border: `2px solid ${colors[difficulty].border}`,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };
});

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  background: "white",
  padding: theme.spacing(1, 2),
  boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
  borderTop: "1px solid #e5e5e5",
  zIndex: 1000,
}));

interface WorkoutData {
  id: string;
  title: string;
  duration: string;
  focus: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  calories: number;
  exercises: number;
  image: string;
  path: string;
}

const workouts: WorkoutData[] = [
  {
    id: "arms",
    title: "10-Exercise Arm Workout",
    duration: "20 min",
    focus: "Arms Focus",
    difficulty: "beginner",
    calories: 85,
    exercises: 12,
    image: "https://images.unsplash.com/photo-1581009137042-c552e485697a",
    path: "/workouts/arms",
  },
  {
    id: "legs",
    title: "15-Exercise Leg Workout",
    duration: "30 min",
    focus: "Legs Focus",
    difficulty: "beginner",
    calories: 85,
    exercises: 12,
    image: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d",
    path: "/workouts/legs",
  },
  {
    id: "abs",
    title: "10-Exercise Abs Workout",
    duration: "20 min",
    focus: "Core Focus",
    difficulty: "beginner",
    calories: 85,
    exercises: 12,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b",
    path: "/workouts/abs",
  },
  {
    id: "chest",
    title: "10-Exercise Chest Workout",
    duration: "25 min",
    focus: "Chest Focus",
    difficulty: "beginner",
    calories: 85,
    exercises: 12,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    path: "/workouts/chest",
  },
  {
    id: "fullBody",
    title: "17-Exercise Full Body Workout",
    duration: "40 min",
    focus: "Full Body",
    difficulty: "beginner",
    calories: 85,
    exercises: 12,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    path: "/workouts/full-body",
  },
  {
    id: "fatBurning",
    title: "Fat Burning Workout (Beginner)",
    duration: "25 min",
    focus: "Full Body",
    difficulty: "beginner",
    calories: 85,
    exercises: 12,
    image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3",
    path: "/workouts/fat-burning",
  },
  {
    id: "fatBurningIntermediate",
    title: "Fat Burning Workout (Intermediate)",
    duration: "30 min",
    focus: "Full Body",
    difficulty: "intermediate",
    calories: 85,
    exercises: 12,
    image: "https://images.unsplash.com/photo-1550345332-09e3ac987658",
    path: "/workouts/fat-burning-intermediate",
  },
  {
    id: "fatBurningAdvanced",
    title: "Fat Burning Workout (Advanced)",
    duration: "35 min",
    focus: "Full Body",
    difficulty: "advanced",
    calories: 85,
    exercises: 12,
    image: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a",
    path: "/workouts/fat-burning-advanced",
  },
  {
    id: "endurance",
    title: "Improve Endurance Workout",
    duration: "30 min",
    focus: "Cardio Focus",
    difficulty: "intermediate",
    calories: 85,
    exercises: 12,
    image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c",
    path: "/workouts/endurance",
  },
  {
    id: "flexibility",
    title: "Increase Flexibility Workout",
    duration: "20 min",
    focus: "Flexibility Focus",
    difficulty: "beginner",
    calories: 85,
    exercises: 12,
    image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3",
    path: "/workouts/flexibility",
  },
];

export const WorkoutPlan: React.FC = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const handleWorkoutClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ pb: 7 }}>
      <WorkoutContainer>
        <WorkoutCategory>
          <Typography
            variant="h4"
            color="primary"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              pb: 1.5,
              borderBottom: "2px solid",
              borderColor: "primary.main",
            }}
          >
            All Workouts
          </Typography>

          <Grid container spacing={3}>
            {workouts.map((workout) => (
              <Grid item xs={12} sm={6} md={4} key={workout.id}>
                <WorkoutCard onClick={() => handleWorkoutClick(workout.path)}>
                  <WorkoutImage image={workout.image} title={workout.title} />
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {workout.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {workout.duration} • {workout.focus}
                    </Typography>
                    <DifficultyChip
                      label={workout.difficulty}
                      difficulty={workout.difficulty}
                      size="small"
                    />
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mt: 2,
                        pt: 2,
                        borderTop: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        🔥 {workout.calories} cal
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        💪 {workout.exercises} exercises
                      </Typography>
                    </Box>
                  </CardContent>
                </WorkoutCard>
              </Grid>
            ))}
          </Grid>
        </WorkoutCategory>
      </WorkoutContainer>

      <StyledBottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          switch (newValue) {
            case 0:
              navigate("/workout-plan");
              break;
            case 1:
              navigate("/report");
              break;
            case 2:
              navigate("/settings");
              break;
          }
        }}
      >
        <BottomNavigationAction label="Home" icon={<FitnessCenterIcon />} />
        <BottomNavigationAction label="Report" icon={<AssessmentIcon />} />
        <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
      </StyledBottomNavigation>
    </Box>
  );
};

export default WorkoutPlan;
