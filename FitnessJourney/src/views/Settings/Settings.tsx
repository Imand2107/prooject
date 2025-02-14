import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";

const SettingsContainer = styled(Box)(({ theme }) => ({
  maxWidth: "600px",
  margin: "0 auto",
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(10),
}));

const SettingsSection = styled(Paper)(({ theme }) => ({
  background: "white",
  borderRadius: "15px",
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(2.5),
  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
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

interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface SettingsData {
  reminderTime: string;
  weeklyUpdates: boolean;
  theme: "light" | "dark";
}

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(2); // 2 is the index for Settings in bottom nav
  const [settings, setSettings] = useState<SettingsData>({
    reminderTime: "30",
    weeklyUpdates: true,
    theme: "light",
  });

  const handleSettingChange = (
    setting: keyof SettingsData,
    value: string | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Save settings to local storage
      localStorage.setItem("settings", JSON.stringify(settings));

      // If user is logged in, save to Firestore
      const user = await new Promise<FirebaseUser | null>((resolve) => {
        window.FirebasePlugin.getCurrentUser(
          (user: FirebaseUser) => resolve(user),
          () => resolve(null)
        );
      });

      if (user) {
        await window.FirebasePlugin.setDocumentInFirestoreCollection(
          `users/${user.uid}/settings`,
          "preferences",
          settings,
          () => {
            console.log("Settings saved successfully");
          },
          (error: any) => {
            console.error("Error saving settings:", error);
          }
        );
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <Box sx={{ pb: 7 }}>
      <SettingsContainer>
        <SettingsSection>
          <Typography variant="h5" color="primary" gutterBottom>
            Reminder Time
          </Typography>
          <FormControl fullWidth>
            <FormLabel>When should we remind you?</FormLabel>
            <Select
              value={settings.reminderTime}
              onChange={(e) =>
                handleSettingChange("reminderTime", e.target.value)
              }
            >
              <MenuItem value="15">15 minutes before</MenuItem>
              <MenuItem value="30">30 minutes before</MenuItem>
              <MenuItem value="45">45 minutes before</MenuItem>
              <MenuItem value="60">1 hour before</MenuItem>
            </Select>
          </FormControl>
        </SettingsSection>

        <SettingsSection>
          <Typography variant="h5" color="primary" gutterBottom>
            Progress Updates
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.weeklyUpdates}
                onChange={(e) =>
                  handleSettingChange("weeklyUpdates", e.target.checked)
                }
              />
            }
            label="Weekly summary of your fitness progress"
          />
        </SettingsSection>

        <SettingsSection>
          <Typography variant="h5" color="primary" gutterBottom>
            Theme
          </Typography>
          <FormControl fullWidth>
            <FormLabel>Choose your theme</FormLabel>
            <Select
              value={settings.theme}
              onChange={(e) =>
                handleSettingChange("theme", e.target.value as "light" | "dark")
              }
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
            </Select>
          </FormControl>
        </SettingsSection>

        <StyledButton fullWidth onClick={handleSave}>
          Save Changes
        </StyledButton>
      </SettingsContainer>

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

export default Settings;
