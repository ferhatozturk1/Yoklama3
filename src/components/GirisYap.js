import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginLecturer } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Container,
  Alert,
  IconButton,
  InputAdornment,
  Fade,
  Grow,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  School,
  Login,
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  DarkMode,
  LightMode,
} from "@mui/icons-material";

const GirisYap = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Zaten login olduysa ana sayfaya yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/portal/ana-sayfa", { replace: true });
      return;
    }
  }, [isAuthenticated, navigate]);

  // Fade-in animation on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = {
        username: email,
        password: password,
      };
      
      const response = await loginLecturer(formData);
      
      // AuthContext üzerinden login işlemini gerçekleştir
      await login(response);
      
      // Kullanıcı daha önce başka bir sayfadaysa oraya yönlendir
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath && redirectPath !== '/giris-yap') {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      } else {
        // Default olarak portal ana sayfasına yönlendir
        navigate("/portal/ana-sayfa");
      }
    } catch (error) {
      console.error("❌ Giriş hatası:", error);
      setError(error.message || "Giriş başarısız! E-posta veya şifre kontrol edin.");
    }
    
    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
          : "linear-gradient(135deg, #1a237e 0%, #283593 25%, #3949ab 50%, #5e35b1 75%, #7e57c2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 2,
        px: 2,
        position: "relative",
      }}
    >
      {/* Dark Mode Toggle */}
      <Box sx={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
        <Fade in={showContent} timeout={800}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                icon={<LightMode sx={{ fontSize: 16 }} />}
                checkedIcon={<DarkMode sx={{ fontSize: 16 }} />}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#4F46E5",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#4F46E5",
                  },
                }}
              />
            }
            label=""
            sx={{
              m: 0,
              "& .MuiFormControlLabel-label": { display: "none" },
            }}
          />
        </Fade>
      </Box>

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in={showContent} timeout={1000}>
          <Box>
            {/* Main Title - Kompakt */}
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: "1.1rem", sm: "1.3rem" },
                  background: darkMode
                    ? "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)"
                    : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 0.5,
                  letterSpacing: "-0.01em",
                  textAlign: "center",
                }}
              >
                Akademik Personel Yoklama
              </Typography>
            </Box>

            {/* Login Card - Kompakt */}
            <Grow in={showContent} timeout={1200}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 1.5, sm: 2 },  // Daha küçük padding
                  borderRadius: "16px",
                  background: darkMode
                    ? "rgba(30, 41, 59, 0.4)"
                    : "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(20px)",
                  border: darkMode
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: darkMode
                    ? "0 20px 40px -12px rgba(0, 0, 0, 0.5)"
                    : "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Header - Kompakt */}
                <Box sx={{ textAlign: "center", mb: 1.5 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      p: 1,
                      borderRadius: "10px",
                      background:
                        "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                      mb: 1,
                      boxShadow: "0 4px 15px rgba(79, 70, 229, 0.3)",
                    }}
                  >
                    <School sx={{ fontSize: 20, color: "white" }} />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      fontWeight: 600,
                      fontSize: { xs: "1rem", sm: "1.1rem" },
                      color: darkMode ? "#ffffff" : "#1e293b",
                      mb: 0.5,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Giriş Yap
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.85rem" },
                      color: darkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(30, 41, 59, 0.7)",
                      fontFamily: '"Inter", "Roboto", sans-serif',
                    }}
                  >
                    Hesabınıza giriş yapın
                  </Typography>
                </Box>

                {/* Form - Kompakt */}
                <form onSubmit={handleSubmit}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: darkMode
                          ? "rgba(255, 255, 255, 0.8)"
                          : "rgba(30, 41, 59, 0.8)",
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        fontWeight: 500,
                        fontSize: "13px",
                        mb: 0.5,
                        ml: 0.5,
                      }}
                    >
                      E-posta Adresi
                    </Typography>
                    <TextField
                      type="email"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="ornek@cbu.edu.tr"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email
                              sx={{
                                color: "#4F46E5",
                                fontSize: 20,
                                opacity: 0.7,
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          height: "48px",  // Daha küçük
                          background: darkMode
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(10px)",
                          border: darkMode
                            ? "1px solid rgba(255, 255, 255, 0.1)"
                            : "1px solid rgba(79, 70, 229, 0.15)",
                          transition: "all 0.2s ease-in-out",
                          "& fieldset": {
                            border: "none",
                          },
                          "&:hover": {
                            background: darkMode
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(255, 255, 255, 1)",
                            border: darkMode
                              ? "1px solid rgba(255, 255, 255, 0.2)"
                              : "1px solid rgba(79, 70, 229, 0.25)",
                            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.08)",
                          },
                          "&.Mui-focused": {
                            background: darkMode
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(255, 255, 255, 1)",
                            border: "2px solid #4F46E5",
                            boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          color: darkMode ? "#ffffff" : "#1e293b",
                          fontFamily: '"Inter", "Roboto", sans-serif',
                          fontWeight: 500,
                          fontSize: "15px",  // Daha küçük
                          padding: "14px 16px 14px 8px",  // Daha küçük padding
                          "&::placeholder": {
                            color: darkMode
                              ? "rgba(255, 255, 255, 0.5)"
                              : "rgba(30, 41, 59, 0.5)",
                            opacity: 1,
                          },
                        },
                        "& .MuiInputAdornment-root": {
                          marginLeft: "14px",
                          marginRight: "12px",
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: darkMode
                          ? "rgba(255, 255, 255, 0.8)"
                          : "rgba(30, 41, 59, 0.8)",
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        fontWeight: 500,
                        fontSize: "13px",
                        mb: 0.5,
                        ml: 0.5,
                      }}
                    >
                      Şifre
                    </Typography>
                    <TextField
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Şifrenizi girin"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock
                              sx={{
                                color: "#4F46E5",
                                fontSize: 20,
                                opacity: 0.7,
                              }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="medium"
                              sx={{
                                color: "#4F46E5",
                                opacity: 0.6,
                                "&:hover": {
                                  backgroundColor: "rgba(79, 70, 229, 0.08)",
                                  opacity: 1,
                                },
                              }}
                            >
                              {showPassword ? (
                                <VisibilityOff fontSize="small" />
                              ) : (
                                <Visibility fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          height: "48px",  // Daha küçük
                          background: darkMode
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(10px)",
                          border: darkMode
                            ? "1px solid rgba(255, 255, 255, 0.1)"
                            : "1px solid rgba(79, 70, 229, 0.15)",
                          transition: "all 0.2s ease-in-out",
                          "& fieldset": {
                            border: "none",
                          },
                          "&:hover": {
                            background: darkMode
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(255, 255, 255, 1)",
                            border: darkMode
                              ? "1px solid rgba(255, 255, 255, 0.2)"
                              : "1px solid rgba(79, 70, 229, 0.25)",
                            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.08)",
                          },
                          "&.Mui-focused": {
                            background: darkMode
                              ? "rgba(255, 255, 255, 0.1)"
                              : "rgba(255, 255, 255, 1)",
                            border: "2px solid #4F46E5",
                            boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          color: darkMode ? "#ffffff" : "#1e293b",
                          fontFamily: '"Inter", "Roboto", sans-serif',
                          fontWeight: 500,
                          fontSize: "15px",  // Daha küçük
                          padding: "14px 16px 14px 8px",  // Daha küçük padding
                          "&::placeholder": {
                            color: darkMode
                              ? "rgba(255, 255, 255, 0.5)"
                              : "rgba(30, 41, 59, 0.5)",
                            opacity: 1,
                          },
                        },
                        "& .MuiInputAdornment-root": {
                          marginLeft: "14px",
                          marginRight: "12px",
                        },
                        "& .MuiInputAdornment-positionEnd": {
                          marginRight: "14px",
                          marginLeft: "8px",
                        },
                      }}
                    />
                  </Box>

                  {/* Error Message */}
                  {error && (
                    <Fade in={!!error}>
                      <Alert
                        severity="error"
                        sx={{
                          mb: 2,
                          borderRadius: "12px",
                          background: darkMode
                            ? "rgba(239, 68, 68, 0.1)"
                            : "rgba(239, 68, 68, 0.05)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          "& .MuiAlert-message": {
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontSize: "13px",
                          },
                        }}
                      >
                        {error}
                      </Alert>
                    </Fade>
                  )}

                  {/* Login Button - Kompakt */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    startIcon={isLoading ? null : <Login />}
                    sx={{
                      mb: 2,
                      height: "48px",  // Daha küçük
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      fontWeight: 600,
                      fontSize: "15px",
                      boxShadow: "0 8px 25px rgba(79, 70, 229, 0.3)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 35px rgba(79, 70, 229, 0.4)",
                      },
                      "&.Mui-disabled": {
                        background: "rgba(79, 70, 229, 0.4)",
                        color: "rgba(255, 255, 255, 0.6)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                  </Button>
                </form>

                {/* Register Link */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: darkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(30, 41, 59, 0.7)",
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      fontSize: "13px",
                    }}
                  >
                    Hesabınız yok mu?{" "}
                    <Link
                      to="/kayit"
                      style={{
                        color: "#4F46E5",
                        textDecoration: "none",
                        fontWeight: 600,
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.textDecoration = "underline";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.textDecoration = "none";
                      }}
                    >
                      Kayıt Ol
                    </Link>
                  </Typography>
                </Box>
              </Paper>
            </Grow>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default GirisYap;
