import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, IconButton, Button } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../../contexts/AuthContext";

const AchievementsContainer = styled(Box)(({ theme }) => ({
  maxWidth: "800px",
  margin: "0 auto",
  padding: theme.spacing(2),
}));

const CategorySection = styled(Paper)(({ theme }) => ({
  background: "white",
  borderRadius: "16px",
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(3),
  boxShadow: "0 4px 0 #e5e5e5",
  border: "2px solid #e5e5e5",
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "20px",
  fontWeight: 800,
  marginBottom: theme.spacing(2.5),
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  textAlign: "center",
  paddingBottom: theme.spacing(1.5),
  borderBottom: `2px solid ${theme.palette.primary.main}`,
}));

const Achievement = styled(Paper)<{ unlocked?: boolean }>(
  ({ theme, unlocked }) => ({
    background: unlocked ? "#f7f7f7" : "#f0f0f0",
    borderRadius: "12px",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    border: "2px solid #e5e5e5",
    transition: "all 0.2s ease",
    opacity: unlocked ? 1 : 0.7,
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
  })
);

const AchievementIcon = styled(Box)<{ unlocked?: boolean }>(
  ({ theme, unlocked }) => ({
    width: "56px",
    height: "56px",
    background: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    border: `3px solid ${unlocked ? theme.palette.primary.main : "#e5e5e5"}`,
    boxShadow: `0 4px 0 ${unlocked ? theme.palette.primary.dark : "#e5e5e5"}`,
  })
);

const XPChip = styled(Box)(({ theme }) => ({
  background: "#fff3f5",
  color: theme.palette.primary.main,
  padding: "4px 8px",
  borderRadius: "20px",
  fontWeight: 700,
  fontSize: "14px",
  border: `2px solid ${theme.palette.primary.main}`,
}));

interface AchievementData {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  progress: number;
  target: number;
  unlocked: boolean;
}

interface CategoryData {
  id: string;
  title: string;
  achievements: AchievementData[];
}

const achievementCategories: Record<string, CategoryData> = {
  gettingStarted: {
    id: "getting-started",
    title: "Getting Started",
    achievements: [
      {
        id: "first-rep",
        title: "First Rep Done",
        description: "Complete your first home workout",
        icon: "🎯",
        xp: 50,
        progress: 0,
        target: 1,
        unlocked: false,
      },
    ],
  },
  consistency: {
    id: "consistency",
    title: "Building Good Habits",
    achievements: [
      {
        id: "home-streak",
        title: "Home Workout Streak",
        description: "Exercise for 7 days in a row",
        icon: "🔥",
        xp: 200,
        progress: 0,
        target: 7,
        unlocked: false,
      },
    ],
  },
};

const Achievements: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [totalXP, setTotalXP] = useState(0);
  const [totalUnlocked, setTotalUnlocked] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [categoryProgress, setCategoryProgress] = useState<
    Record<string, { unlocked: number; total: number }>
  >({});

  useEffect(() => {
    const loadAchievements = async () => {
      if (currentUser) {
        try {
          await window.FirebasePlugin.getDocumentFromFirestoreCollection(
            `users/${currentUser.uid}/achievements`,
            "data",
            (data: any) => {
              if (data) {
                setTotalXP(data.totalXP || 0);
                setTotalUnlocked(data.totalUnlocked || 0);
                setTotalProgress(data.totalProgress || 0);
                setCategoryProgress(data.categoryProgress || {});
              }
            },
            (error: any) => {
              console.error("Error loading achievements:", error);
            }
          );
        } catch (error) {
          console.error("Error loading achievements:", error);
        }
      }
    };

    loadAchievements();
  }, [currentUser]);

  return (
    <AchievementsContainer>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => navigate("/report")} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" color="primary" sx={{ flexGrow: 1 }}>
          Your Achievements
        </Typography>
      </Box>

      <CategorySection>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h4" color="primary" gutterBottom>
            ⭐ {totalXP} XP
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
            <Box>
              <Typography variant="h6">{totalUnlocked}</Typography>
              <Typography variant="body2" color="text.secondary">
                Unlocked
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6">{Math.round(totalProgress)}%</Typography>
              <Typography variant="body2" color="text.secondary">
                Complete
              </Typography>
            </Box>
          </Box>
        </Box>
      </CategorySection>

      {Object.entries(achievementCategories).map(([key, category]) => (
        <CategorySection key={category.id}>
          <CategoryTitle>{category.title}</CategoryTitle>

          {categoryProgress[key] && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={
                  (categoryProgress[key].unlocked /
                    categoryProgress[key].total) *
                  100
                }
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                align="right"
                sx={{ mt: 0.5 }}
              >
                {categoryProgress[key].unlocked}/{categoryProgress[key].total}
              </Typography>
            </Box>
          )}

          {category.achievements.map((achievement) => (
            <Achievement key={achievement.id} unlocked={achievement.unlocked}>
              <AchievementIcon unlocked={achievement.unlocked}>
                {achievement.icon}
              </AchievementIcon>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {achievement.title}
                  </Typography>
                  <XPChip>+{achievement.xp} XP</XPChip>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {achievement.description}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(achievement.progress / achievement.target) * 100}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="right"
                    sx={{ mt: 0.5 }}
                  >
                    {achievement.progress}/{achievement.target}
                  </Typography>
                </Box>
              </Box>
            </Achievement>
          ))}
        </CategorySection>
      ))}
    </AchievementsContainer>
  );
};

export default Achievements;
