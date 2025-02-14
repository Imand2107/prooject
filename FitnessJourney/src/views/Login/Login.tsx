import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Styled components
const LoginContainer = styled(Box)(({ theme }) => ({
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

const LoginCard = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  padding: theme.spacing(5),
  borderRadius: "15px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
  width: "100%",
  maxWidth: "400px",
  border: "1px solid #e0e0e0",
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

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rememberMe" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("userEmail", formData.email);
      }
      navigate("/workout-plan");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      await signInWithGoogle();
      navigate("/workout-plan");
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Welcome Back!
        </Typography>

        {error && (
          <Box sx={{ mb: 2, p: 1, bgcolor: "error.light", borderRadius: 1 }}>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            margin="normal"
            required
            disabled={loading}
          />

          <Box
            sx={{
              mt: 2,
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              }
              label="Remember me"
            />
            <Link href="#" variant="body2" color="primary">
              Forgot Password?
            </Link>
          </Box>

          <StyledButton
            fullWidth
            type="submit"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Signing in..." : "Login"}
          </StyledButton>
        </form>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Or sign in with
          </Typography>
          <StyledButton
            fullWidth
            onClick={handleGoogleSignIn}
            disabled={loading}
            startIcon={
              <img
                src="/img/google-icon.svg"
                alt="Google"
                width={18}
                height={18}
              />
            }
            sx={{ mt: 1 }}
          >
            Sign in with Google
          </StyledButton>
        </Box>

        <Box
          sx={{
            mt: 3,
            pt: 3,
            borderTop: "1px solid #ddd",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Don't have an account?
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/signup")}
            sx={{ mt: 1 }}
          >
            Sign Up
          </Button>
        </Box>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
