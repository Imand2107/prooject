import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const SignUpContainer = styled(Box)(({ theme }) => ({
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

const SignUpCard = styled(Paper)(({ theme }) => ({
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

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PasswordRequirement {
  id: string;
  label: string;
  regex: RegExp;
  met: boolean;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [passwordRequirements, setPasswordRequirements] = useState<
    PasswordRequirement[]
  >([
    {
      id: "length",
      label: "At least 8 characters",
      regex: /.{8,}/,
      met: false,
    },
    {
      id: "uppercase",
      label: "One uppercase letter",
      regex: /[A-Z]/,
      met: false,
    },
    {
      id: "lowercase",
      label: "One lowercase letter",
      regex: /[a-z]/,
      met: false,
    },
    { id: "number", label: "One number", regex: /[0-9]/, met: false },
    {
      id: "special",
      label: "One special character",
      regex: /[!@#$%^&*(),.?":{}|<>]/,
      met: false,
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordRequirements((prev) =>
        prev.map((req) => ({
          ...req,
          met: req.regex.test(value),
        }))
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const allRequirementsMet = passwordRequirements.every((req) => req.met);
    if (!allRequirementsMet) {
      setError("Please meet all password requirements");
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.name);
      localStorage.setItem("justSignedUp", "true");
      navigate("/bmi");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignUpContainer>
      <SignUpCard>
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
            disabled={loading}
          />

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

          <Box sx={{ mt: 1, mb: 2 }}>
            {passwordRequirements.map((req) => (
              <Typography
                key={req.id}
                variant="body2"
                color={req.met ? "success.main" : "text.secondary"}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  "&::before": {
                    content: '""',
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: req.met
                      ? "success.main"
                      : "text.secondary",
                  },
                }}
              >
                {req.label}
              </Typography>
            ))}
          </Box>

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            margin="normal"
            required
            disabled={loading}
          />

          <StyledButton
            fullWidth
            type="submit"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </StyledButton>
        </form>

        <Box
          sx={{
            mt: 3,
            pt: 3,
            borderTop: "1px solid #ddd",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Already have an account?
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/login")}
            sx={{ mt: 1 }}
          >
            Login
          </Button>
        </Box>
      </SignUpCard>
    </SignUpContainer>
  );
};

export default SignUp;
