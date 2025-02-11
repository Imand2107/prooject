// Main data structures for FitnessJourney app

// User Profile Data
const profileData = {
    userName: '',
    bio: 'Fitness Enthusiast',
    lastUpdated: null,
    settings: {
        notifications: true,
        darkMode: false,
        language: 'en',
        workoutReminders: true,
        reminderTime: '30min',
        progressUpdates: true
    },
    stats: {
        age: null,
        gender: null,
        weight: null,
        height: null,
        fitnessGoal: null,
        bmi: null
    }
};

// Workout Data
const workoutData = {
    history: [], // Array of completed workouts
    currentWorkout: {
        id: null,
        type: null,
        startTime: null,
        endTime: null,
        exercises: [],
        totalCalories: 0,
        duration: 0
    },
    stats: {
        totalWorkouts: 0,
        totalMinutes: 0,
        totalCalories: 0,
        favoriteWorkout: null,
        bestPerformance: null
    },
    preferences: {
        restTime: 60, // seconds
        countdownTime: 5, // seconds
        voiceGuidance: true
    }
};

// Exercise Data
const exerciseData = {
    exercises: {
        pushups: {
            name: 'Push-ups',
            type: 'strength',
            muscle: 'chest',
            difficulty: 'beginner',
            calories: 100,
            duration: 30, // seconds
            reps: 10,
            sets: 3
        },
        // ... more exercises
    },
    userProgress: {
        totalReps: 0,
        personalBests: {},
        recentExercises: []
    }
};

// Progress Tracking
const progressData = {
    weight: {
        history: [], // Array of weight entries
        goals: {
            target: null,
            weekly: null
        },
        stats: {
            initial: null,
            current: null,
            change: null
        }
    },
    measurements: {
        chest: [],
        waist: [],
        arms: [],
        legs: []
    },
    goals: {
        daily: [],
        weekly: [],
        monthly: []
    }
};

// Streak and XP System
const streakData = {
    currentStreak: 0,
    bestStreak: 0,
    totalXP: 0,
    weeklyProgress: {
        Monday: { completed: false, xp: 0 },
        Tuesday: { completed: false, xp: 0 },
        Wednesday: { completed: false, xp: 0 },
        Thursday: { completed: false, xp: 0 },
        Friday: { completed: false, xp: 0 },
        Saturday: { completed: false, xp: 0 },
        Sunday: { completed: false, xp: 0 }
    },
    history: [],
    lastWorkout: null
};

// Achievement System
const achievementData = {
    totalXP: 0,
    lastUnlocked: null,
    categories: {
        gettingStarted: {
            id: 'getting-started',
            title: 'Getting Started',
            achievements: [] // Array of achievements
        },
        // ... other categories
    },
    stats: {
        totalUnlocked: 0,
        totalProgress: 0,
        categoryProgress: {}
    }
};

// Workout Plans
const workoutPlans = {
    beginner: {
        name: 'Beginner Plan',
        duration: '4 weeks',
        workoutsPerWeek: 3,
        workouts: [] // Array of workout IDs
    },
    intermediate: {
        name: 'Intermediate Plan',
        duration: '8 weeks',
        workoutsPerWeek: 4,
        workouts: []
    },
    advanced: {
        name: 'Advanced Plan',
        duration: '12 weeks',
        workoutsPerWeek: 5,
        workouts: []
    }
};

// Initialize all data structures
function initializeAppData() {
    if (!localStorage.getItem('profileData')) {
        localStorage.setItem('profileData', JSON.stringify(profileData));
    }
    if (!localStorage.getItem('workoutData')) {
        localStorage.setItem('workoutData', JSON.stringify(workoutData));
    }
    if (!localStorage.getItem('exerciseData')) {
        localStorage.setItem('exerciseData', JSON.stringify(exerciseData));
    }
    if (!localStorage.getItem('progressData')) {
        localStorage.setItem('progressData', JSON.stringify(progressData));
    }
    if (!localStorage.getItem('streakData')) {
        localStorage.setItem('streakData', JSON.stringify(streakData));
    }
    if (!localStorage.getItem('achievementData')) {
        localStorage.setItem('achievementData', JSON.stringify(achievementData));
    }
    if (!localStorage.getItem('workoutPlans')) {
        localStorage.setItem('workoutPlans', JSON.stringify(workoutPlans));
    }
}

// Update functions for each data type
function updateProfileData(newData) {
    const currentData = JSON.parse(localStorage.getItem('profileData'));
    const updatedData = { ...currentData, ...newData, lastUpdated: new Date().toISOString() };
    localStorage.setItem('profileData', JSON.stringify(updatedData));
}

function updateWorkoutData(newData) {
    const currentData = JSON.parse(localStorage.getItem('workoutData'));
    const updatedData = { ...currentData, ...newData };
    localStorage.setItem('workoutData', JSON.stringify(updatedData));
}

// ... similar update functions for other data types

// Export the data structures and functions
export {
    initializeAppData,
    updateProfileData,
    updateWorkoutData,
    // ... other exports
}; 