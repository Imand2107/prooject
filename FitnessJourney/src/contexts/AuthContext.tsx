import React, { createContext, useContext, useState, useEffect } from "react";
import { FirebasePlugin } from "../types/cordova";
import { Box, CircularProgress } from "@mui/material";

interface AuthContextType {
  currentUser: any | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  console.log("AuthProvider rendering");
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("AuthProvider useEffect running");
    let mounted = true;

    const initializeFirebase = () => {
      console.log("Initializing Firebase");
      try {
        // The plugin is already initialized by this point
        // Just check the current auth state
        checkAuthState();
        if (mounted) {
          setInitialized(true);
        }
      } catch (err) {
        console.error("Error during Firebase initialization:", err);
        if (mounted) {
          setError("Failed to initialize Firebase");
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    const handleDeviceReady = () => {
      console.log("Device ready event fired");
      initializeFirebase();
    };

    // Check if we're running in Cordova environment
    if (typeof window.cordova !== "undefined") {
      console.log("Cordova detected, waiting for deviceready");
      document.addEventListener("deviceready", handleDeviceReady, false);
    } else {
      console.log("No Cordova detected, initializing Firebase directly");
      initializeFirebase();
    }

    return () => {
      console.log("AuthProvider useEffect cleanup");
      mounted = false;
      if (typeof window.cordova !== "undefined") {
        document.removeEventListener("deviceready", handleDeviceReady);
      }
    };
  }, []);

  const checkAuthState = () => {
    console.log("Checking auth state");
    try {
      window.FirebasePlugin.getCurrentUser(
        (user: any) => {
          console.log("Current user:", user);
          setCurrentUser(user);
          setLoading(false);
        },
        (error: any) => {
          console.error("Error getting current user:", error);
          setCurrentUser(null);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error("Error checking auth state:", err);
      setCurrentUser(null);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log("Attempting sign in with email:", email);
    return new Promise<void>((resolve, reject) => {
      window.FirebasePlugin.signInWithEmailAndPassword(
        email,
        password,
        (userInfo: any) => {
          console.log("Sign in successful:", userInfo);
          setCurrentUser(userInfo);
          resolve();
        },
        (error: any) => {
          console.error("Sign in error:", error);
          reject(error);
        }
      );
    });
  };

  const signUp = async (email: string, password: string, name: string) => {
    console.log("Attempting sign up with email:", email);
    return new Promise<void>((resolve, reject) => {
      window.FirebasePlugin.createUserWithEmailAndPassword(
        email,
        password,
        async (userInfo: any) => {
          console.log("User created successfully:", userInfo);
          try {
            // Update user profile with name
            await window.FirebasePlugin.updateUserProfile(
              { displayName: name },
              () => {
                console.log("User profile updated with name:", name);
                setCurrentUser({ ...userInfo, displayName: name });
                resolve();
              },
              (error: any) => {
                console.error("Error updating user profile:", error);
                reject(error);
              }
            );
          } catch (error) {
            console.error("Error in sign up process:", error);
            reject(error);
          }
        },
        (error: any) => {
          console.error("Error creating user:", error);
          reject(error);
        }
      );
    });
  };

  const signInWithGoogle = async () => {
    console.log("Attempting Google sign in");
    return new Promise<void>((resolve, reject) => {
      window.FirebasePlugin.authenticateUserWithGoogle(
        (userInfo: any) => {
          console.log("Google sign in successful:", userInfo);
          setCurrentUser(userInfo);
          resolve();
        },
        (error: any) => {
          console.error("Google sign in error:", error);
          reject(error);
        }
      );
    });
  };

  const signOut = async () => {
    console.log("Attempting sign out");
    return new Promise<void>((resolve, reject) => {
      window.FirebasePlugin.signOut(
        () => {
          console.log("Sign out successful");
          setCurrentUser(null);
          resolve();
        },
        (error: any) => {
          console.error("Sign out error:", error);
          reject(error);
        }
      );
    });
  };

  const value = {
    currentUser,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    loading,
    initialized,
  };

  console.log("AuthProvider state:", {
    currentUser,
    loading,
    initialized,
    error,
  });

  // Show error state if initialization failed
  if (error) {
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
        <CircularProgress color="error" />
        <Box mt={2} color="error.main">
          {error}
        </Box>
      </Box>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
