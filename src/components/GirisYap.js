import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Tooltip,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import {
  School,
  Login,
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ContentCopy,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES } from "../utils/routes";

const GirisYap = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [selectedTestUser, setSelectedTestUser] = useState(0);
  
  const navigate = useNavigate();
  const { login, loading, error, clearError, isAuthenticated, user } = useAuth();

  // Kullanıcı zaten giriş yapmışsa portal'a yönlendir
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(ROUTES.ANA_SAYFA);
    }
  }, [isAuthenticated, navigate]);

  // Fade-in animation on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Error temizleme
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!email || !password) {
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate(ROUTES.ANA_SAYFA);
      }
    } catch (error) {
      // Error AuthContext tarafından handle ediliyor
      console.error('Login error:', error);
    }
  };

  // Test kullanıcıları
  const testUsers = [
    {
      name: "Prof. Dr. Göktürk Üçoluk",
      email: "ucoluk@ceng.metu.edu.tr",
      password: "ucoluk.1234"
    },
    {
      name: "Prof. Dr. İsmail Şengör Altıngövde",
      email: "altingovde@ceng.metu.edu.tr",
      password: "altingovde.1234"
    },
    {
      name: "Dr. Onur Tolga Şehitoğlu",
      email: "onur@ceng.metu.edu.tr",
      password: "onur.1234"
    },
    {
      name: "Prof. Dr. İsmail Hakkı Toroslu",
      email: "toroslu@ceng.metu.edu.tr",
      password: "toroslu.1234"
    }
  ];

  const copyDemoCredentials = () => {
    const currentUser = testUsers[selectedTestUser];
    setEmail(currentUser.email);
    setPassword(currentUser.password);
  };

  const nextTestUser = () => {
    setSelectedTestUser((prev) => (prev + 1) % testUsers.length);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
          : "linear-gradient(135deg, #1a237e 0%, #283593 25%, #3949ab 50%, #5e35b1 75%, #7e57c2 100%)",
        backgroundImage: darkMode
          ? 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          : 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.08"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        px: 2,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode
            ? "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)"
            : "radial-gradient(ellipse at top left, rgba(79, 70, 229, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(124, 58, 237, 0.15) 0%, transparent 50%), radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode
            ? "none"
            : "linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%), linear-gradient(-45deg, rgba(255, 255, 255, 0.03) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      {/* Dark Mode Toggle */}
      <Box
        sx={{
          position: "absolute",
          top: 24,
          right: 24,
          zIndex: 10,
        }}
      >
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
            {/* Main Title */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: "1.6rem", sm: "2.2rem", md: "2.8rem" },
                  background: darkMode
                    ? "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)"
                    : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: darkMode
                    ? "0 4px 20px rgba(255, 255, 255, 0.1)"
                    : "0 4px 20px rgba(0, 0, 0, 0.1)",
                  mb: 1,
                  letterSpacing: "-0.02em",
                  textAlign: "center",
                }}
              >
                Akademik Personel
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  fontWeight: 400,
                  fontSize: { xs: "1rem", sm: "1.3rem" },
                  color: darkMode
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(255, 255, 255, 0.9)",
                  letterSpacing: "0.02em",
                  textAlign: "center",
                }}
              >
                Yoklama Sistemi
              </Typography>
            </Box>

            {/* Login Card */}
            <Grow in={showContent} timeout={1200}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, sm: 3.5, md: 4 },
                  borderRadius: "24px",
                  background: darkMode
                    ? "rgba(30, 41, 59, 0.4)"
                    : "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(20px)",
                  border: darkMode
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: darkMode
                    ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                    : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "1px",
                    background: darkMode
                      ? "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)"
                      : "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
                  },
                }}
              >
                {/* Header */}
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      p: 3,
                      borderRadius: "20px",
                      background:
                        "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                      mb: 3,
                      boxShadow: "0 10px 30px rgba(79, 70, 229, 0.3)",
                    }}
                  >
                    <School sx={{ fontSize: 32, color: "white" }} />
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      fontWeight: 700,
                      fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2rem" },
                      color: darkMode ? "#ffffff" : "#1e293b",
                      mb: 1,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Giriş Yap
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      color: darkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(30, 41, 59, 0.7)",
                      fontFamily: '"Inter", "Roboto", sans-serif',
                    }}
                  >
                    Hesabınıza giriş yaparak devam edin
                  </Typography>
                </Box>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: darkMode
                          ? "rgba(255, 255, 255, 0.8)"
                          : "rgba(30, 41, 59, 0.8)",
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        fontWeight: 500,
                        fontSize: "14px",
                        mb: 1,
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
                          height: "56px",
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
                          fontSize: "16px",
                          padding: "16px 16px 16px 8px",
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

                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: darkMode
                          ? "rgba(255, 255, 255, 0.8)"
                          : "rgba(30, 41, 59, 0.8)",
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        fontWeight: 500,
                        fontSize: "14px",
                        mb: 1,
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
                          height: "56px",
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
                          fontSize: "16px",
                          padding: "16px 8px 16px 8px",
                          "&::placeholder": {
                            color: darkMode
                              ? "rgba(255, 255, 255, 0.5)"
                              : "rgba(30, 41, 59, 0.5)",
                            opacity: 1,
                          },
                        },
                        "& .MuiInputAdornment-positionStart": {
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

                  {error && (
                    <Fade in={!!error}>
                      <Alert
                        severity="error"
                        sx={{
                          mb: 3,
                          borderRadius: "12px",
                          background: darkMode
                            ? "rgba(239, 68, 68, 0.1)"
                            : "rgba(239, 68, 68, 0.05)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          "& .MuiAlert-message": {
                            fontFamily: '"Inter", "Roboto", sans-serif',
                          },
                        }}
                      >
                        {error}
                      </Alert>
                    </Fade>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading || !email || !password}
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Login sx={{ fontSize: 20 }} />
                      )
                    }
                    sx={{
                      height: { xs: "50px", sm: "56px" },
                      fontWeight: 600,
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      fontSize: { xs: "14px", sm: "16px" },
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                      boxShadow: "0 12px 35px rgba(79, 70, 229, 0.3)",
                      textTransform: "none",
                      letterSpacing: "0.5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                      mb: 4,
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)",
                        transform: "translateY(-3px)",
                        boxShadow: "0 18px 40px rgba(79, 70, 229, 0.4)",
                      },
                      "&:active": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 8px 20px rgba(79, 70, 229, 0.3)",
                      },
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&.Mui-disabled": {
                        background: "rgba(79, 70, 229, 0.4)",
                        color: "rgba(255, 255, 255, 0.6)",
                        transform: "none",
                        boxShadow: "0 8px 20px rgba(79, 70, 229, 0.2)",
                      },
                    }}
                  >
                    {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                  </Button>
                </form>

                {/* Demo Credentials Card */}
                <Box
                  sx={{
                    background: darkMode
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.02)",
                    border: darkMode
                      ? "1px solid rgba(255, 255, 255, 0.08)"
                      : "1px solid rgba(0, 0, 0, 0.05)",
                    borderRadius: "12px",
                    p: 2.5,
                    mb: 4,
                    position: "relative",
                    overflow: "hidden",
                    opacity: 0.8,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      opacity: 1,
                      background: darkMode
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: darkMode
                          ? "rgba(255, 255, 255, 0.6)"
                          : "rgba(30, 41, 59, 0.6)",
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      📝 Test Kullanıcıları ({selectedTestUser + 1}/{testUsers.length})
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="Sonraki kullanıcı" arrow>
                        <IconButton
                          onClick={nextTestUser}
                          size="small"
                          sx={{
                            color: darkMode
                              ? "rgba(255, 255, 255, 0.5)"
                              : "rgba(30, 41, 59, 0.5)",
                            "&:hover": {
                              color: darkMode
                                ? "rgba(255, 255, 255, 0.8)"
                                : "rgba(30, 41, 59, 0.8)",
                              backgroundColor: darkMode
                                ? "rgba(255, 255, 255, 0.05)"
                                : "rgba(0, 0, 0, 0.05)",
                            },
                          }}
                        >
                          🔄
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Bilgileri kopyala" arrow>
                        <IconButton
                          onClick={copyDemoCredentials}
                          size="small"
                          sx={{
                            color: darkMode
                              ? "rgba(255, 255, 255, 0.5)"
                              : "rgba(30, 41, 59, 0.5)",
                            "&:hover": {
                              color: darkMode
                                ? "rgba(255, 255, 255, 0.8)"
                                : "rgba(30, 41, 59, 0.8)",
                              backgroundColor: darkMode
                                ? "rgba(255, 255, 255, 0.05)"
                                : "rgba(0, 0, 0, 0.05)",
                            },
                          }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: darkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(30, 41, 59, 0.7)",
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      fontSize: "13px",
                      lineHeight: 1.5,
                      mb: 1,
                    }}
                  >
                    <strong>Ad:</strong> {testUsers[selectedTestUser].name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: darkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(30, 41, 59, 0.7)",
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      fontSize: "13px",
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>E-posta:</strong> {testUsers[selectedTestUser].email}
                    <br />
                    <strong>Şifre:</strong> {testUsers[selectedTestUser].password}
                  </Typography>
                </Box>

                {/* Register Link */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: darkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(30, 41, 59, 0.7)",
                      fontFamily: '"Inter", "Roboto", sans-serif',
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
