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
  Grid,
  InputAdornment,
  IconButton,
  MenuItem,
  Fade,
  Grow,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  School,
  Person,
  Email,
  Lock,
  Subject,
  ArrowBack,
  PersonAdd,
  Visibility,
  VisibilityOff,
  SupervisorAccount,
  Phone,
  Badge,
  DarkMode,
  LightMode,
} from "@mui/icons-material";

const OgretmenKayit = () => {
  const [form, setForm] = useState({
    ad: "",
    soyad: "",
    email: "",
    sifre: "",
    sifreTekrar: "",
    brans: "",
    sicilNo: "",
    telefon: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  // Fade-in animation on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const branslar = [
    "Matematik",
    "Fizik",
    "Kimya",
    "Biyoloji",
    "Türkçe",
    "Tarih",
    "Coğrafya",
    "Felsefe",
    "İngilizce",
    "Almanca",
    "Fransızca",
    "Beden Eğitimi",
    "Müzik",
    "Resim",
    "Bilgisayar",
    "Diğer",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Validasyon
    if (
      !form.ad ||
      !form.soyad ||
      !form.email ||
      !form.sifre ||
      !form.sifreTekrar ||
      !form.brans ||
      !form.sicilNo
    ) {
      setError("Zorunlu alanları doldurun!");
      setIsLoading(false);
      return;
    }

    // E-posta edu.tr doğrulaması
    if (!form.email.endsWith(".edu.tr")) {
      setError(
        "Sadece .edu.tr uzantılı kurumsal e-posta adresleri kabul edilir!"
      );
      setIsLoading(false);
      return;
    }

    if (form.sifre !== form.sifreTekrar) {
      setError("Şifreler eşleşmiyor!");
      setIsLoading(false);
      return;
    }

    if (form.sifre.length < 4) {
      setError("Şifre en az 4 karakter olmalıdır!");
      setIsLoading(false);
      return;
    }

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Demo: Kayıt başarılı
    setSuccess("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
    setIsLoading(false);
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
          : "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        backgroundImage: darkMode
          ? 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          : 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
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
            : "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.2) 0%, transparent 50%)",
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

      {/* Back Button */}
      <Box
        sx={{
          position: "absolute",
          top: 24,
          left: 24,
          zIndex: 10,
        }}
      >
        <Fade in={showContent} timeout={800}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/")}
            sx={{
              color: darkMode
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(255, 255, 255, 0.9)",
              fontWeight: 600,
              fontFamily: '"Inter", "Roboto", sans-serif',
              "&:hover": {
                backgroundColor: darkMode
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Giriş Sayfasına Dön
          </Button>
        </Fade>
      </Box>

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in={showContent} timeout={1000}>
          <Box>
            {/* Main Title */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
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
                }}
              >
                Akademik Personel
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  fontWeight: 400,
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  color: darkMode
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgba(255, 255, 255, 0.9)",
                  letterSpacing: "0.02em",
                }}
              >
                Kayıt Sistemi
              </Typography>
            </Box>

                {/* Registration Card */}
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
                    <Box sx={{ textAlign: "center", mb: 4 }}>
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
                    <PersonAdd sx={{ fontSize: 32, color: "white" }} />
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      fontWeight: 700,
                      fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
                      color: darkMode ? "#ffffff" : "#1e293b",
                      mb: 1,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Kayıt Ol
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: darkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(30, 41, 59, 0.7)",
                      fontFamily: '"Inter", "Roboto", sans-serif',
                    }}
                  >
                    Akademik personel hesabınızı oluşturmak için bilgilerinizi
                    girin
                  </Typography>
                </Box>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Ad */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Ad"
                        name="ad"
                        fullWidth
                        value={form.ad}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ ml: 0.5 }}>
                              <Person
                                sx={{
                                  color: "#4F46E5",
                                  fontSize: 20,
                                  opacity: 0.8,
                                }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "16px",
                            height: "56px",
                            background: darkMode
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(20px)",
                            border: darkMode
                              ? "1px solid rgba(255, 255, 255, 0.1)"
                              : "1px solid rgba(79, 70, 229, 0.1)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "& fieldset": {
                              border: "none",
                            },
                            "&:hover": {
                              background: darkMode
                                ? "rgba(255, 255, 255, 0.12)"
                                : "rgba(255, 255, 255, 1)",
                              border: darkMode
                                ? "1px solid rgba(255, 255, 255, 0.2)"
                                : "1px solid rgba(79, 70, 229, 0.2)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 8px 25px rgba(79, 70, 229, 0.1)",
                            },
                            "&.Mui-focused": {
                              background: darkMode
                                ? "rgba(255, 255, 255, 0.15)"
                                : "rgba(255, 255, 255, 1)",
                              border: "2px solid #4F46E5",
                              transform: "translateY(-2px)",
                              boxShadow: "0 12px 30px rgba(79, 70, 229, 0.2)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: darkMode
                              ? "rgba(255, 255, 255, 0.8)"
                              : "rgba(30, 41, 59, 0.8)",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            "&.Mui-focused": {
                              color: "#4F46E5",
                              fontWeight: 600,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: darkMode ? "#ffffff" : "#1e293b",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            fontSize: "16px",
                            padding: "16px 14px 16px 8px",
                          },
                          "& .MuiInputAdornment-root": {
                            marginRight: "12px",
                          },
                        }}
                      />
                    </Grid>

                    {/* Soyad */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Soyad"
                        name="soyad"
                        fullWidth
                        value={form.soyad}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ ml: 0.5 }}>
                              <Person
                                sx={{
                                  color: "#4F46E5",
                                  fontSize: 20,
                                  opacity: 0.8,
                                }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "16px",
                            height: "56px",
                            background: darkMode
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(20px)",
                            border: darkMode
                              ? "1px solid rgba(255, 255, 255, 0.1)"
                              : "1px solid rgba(79, 70, 229, 0.1)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "& fieldset": {
                              border: "none",
                            },
                            "&:hover": {
                              background: darkMode
                                ? "rgba(255, 255, 255, 0.12)"
                                : "rgba(255, 255, 255, 1)",
                              border: darkMode
                                ? "1px solid rgba(255, 255, 255, 0.2)"
                                : "1px solid rgba(79, 70, 229, 0.2)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 8px 25px rgba(79, 70, 229, 0.1)",
                            },
                            "&.Mui-focused": {
                              background: darkMode
                                ? "rgba(255, 255, 255, 0.15)"
                                : "rgba(255, 255, 255, 1)",
                              border: "2px solid #4F46E5",
                              transform: "translateY(-2px)",
                              boxShadow: "0 12px 30px rgba(79, 70, 229, 0.2)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: darkMode
                              ? "rgba(255, 255, 255, 0.8)"
                              : "rgba(30, 41, 59, 0.8)",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            "&.Mui-focused": {
                              color: "#4F46E5",
                              fontWeight: 600,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: darkMode ? "#ffffff" : "#1e293b",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            fontSize: "16px",
                            padding: "16px 14px 16px 8px",
                          },
                          "& .MuiInputAdornment-root": {
                            marginRight: "12px",
                          },
                        }}
                      />
                    </Grid>

                    {/* Sicil Numarası */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Sicil Numarası"
                        name="sicilNo"
                        fullWidth
                        value={form.sicilNo}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ ml: 0.5 }}>
                              <Badge
                                sx={{
                                  color: "#4F46E5",
                                  fontSize: 20,
                                  opacity: 0.8,
                                }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "16px",
                            height: "56px",
                            background: darkMode
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(20px)",
                            border: darkMode
                              ? "1px solid rgba(255, 255, 255, 0.1)"
                              : "1px solid rgba(79, 70, 229, 0.1)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "& fieldset": {
                              border: "none",
                            },
                            "&:hover": {
                              background: darkMode
                                ? "rgba(255, 255, 255, 0.12)"
                                : "rgba(255, 255, 255, 1)",
                              border: darkMode
                                ? "1px solid rgba(255, 255, 255, 0.2)"
                                : "1px solid rgba(79, 70, 229, 0.2)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 8px 25px rgba(79, 70, 229, 0.1)",
                            },
                            "&.Mui-focused": {
                              background: darkMode
                                ? "rgba(255, 255, 255, 0.15)"
                                : "rgba(255, 255, 255, 1)",
                              border: "2px solid #4F46E5",
                              transform: "translateY(-2px)",
                              boxShadow: "0 12px 30px rgba(79, 70, 229, 0.2)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: darkMode
                              ? "rgba(255, 255, 255, 0.8)"
                              : "rgba(30, 41, 59, 0.8)",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            "&.Mui-focused": {
                              color: "#4F46E5",
                              fontWeight: 600,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: darkMode ? "#ffffff" : "#1e293b",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            fontSize: "16px",
                            padding: "16px 14px 16px 8px",
                          },
                          "& .MuiInputAdornment-root": {
                            marginRight: "12px",
                          },
                        }}
                      />
                    </Grid>

                    {/* Branş */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Branş"
                        name="brans"
                        select
                        fullWidth
                        value={form.brans}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ ml: 0.5 }}>
                              <Subject
                                sx={{
                                  color: "#4F46E5",
                                  fontSize: 20,
                                  opacity: 0.8,
                                }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "16px",
                            height: "56px",
                            background: darkMode
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(20px)",
                            border: darkMode
                              ? "1px solid rgba(255, 255, 255, 0.1)"
                              : "1px solid rgba(79, 70, 229, 0.1)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "& fieldset": {
                              border: "none",
                            },
                            "&:hover": {
                              background: darkMode
                                ? "rgba(255, 255, 255, 0.12)"
                                : "rgba(255, 255, 255, 1)",
                              border: darkMode
                                ? "1px solid rgba(255, 255, 255, 0.2)"
                                : "1px solid rgba(79, 70, 229, 0.2)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 8px 25px rgba(79, 70, 229, 0.1)",
                            },
                            "&.Mui-focused": {
                              background: darkMode
                                ? "rgba(255, 255, 255, 0.15)"
                                : "rgba(255, 255, 255, 1)",
                              border: "2px solid #4F46E5",
                              transform: "translateY(-2px)",
                              boxShadow: "0 12px 30px rgba(79, 70, 229, 0.2)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: darkMode
                              ? "rgba(255, 255, 255, 0.8)"
                              : "rgba(30, 41, 59, 0.8)",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            "&.Mui-focused": {
                              color: "#4F46E5",
                              fontWeight: 600,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: darkMode ? "#ffffff" : "#1e293b",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            fontSize: "16px",
                            padding: "16px 14px 16px 8px",
                          },
                          "& .MuiInputAdornment-root": {
                            marginRight: "12px",
                          },
                        }}
                      >
                        {branslar.map((brans) => (
                          <MenuItem key={brans} value={brans}>
                            {brans}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    {/* E-posta */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="E-posta Adresi"
                        name="email"
                        type="email"
                        fullWidth
                        value={form.email}
                        onChange={handleChange}
                        required
                        helperText="Sadece .edu.tr uzantılı kurumsal e-posta adresleri kabul edilir"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ ml: 0.5 }}>
                              <Email
                                sx={{
                                  color: "#4F46E5",
                                  fontSize: 20,
                                  opacity: 0.8,
                                }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "16px",
                            height: "56px",
                            background: darkMode
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(20px)",
                            border: darkMode
                              ? "1px solid rgba(255, 255, 255, 0.1)"
                              : "1px solid rgba(79, 70, 229, 0.1)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "& fieldset": {
                              border: "none",
                            },
                            "&:hover": {
                              background: darkMode
                                ? "rgba(255, 255, 255, 0.12)"
                                : "rgba(255, 255, 255, 1)",
                              border: darkMode
                                ? "1px solid rgba(255, 255, 255, 0.2)"
                                : "1px solid rgba(79, 70, 229, 0.2)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 8px 25px rgba(79, 70, 229, 0.1)",
                            },
                            "&.Mui-focused": {
                              background: darkMode
                                ? "rgba(255, 255, 255, 0.15)"
                                : "rgba(255, 255, 255, 1)",
                              border: "2px solid #4F46E5",
                              transform: "translateY(-2px)",
                              boxShadow: "0 12px 30px rgba(79, 70, 229, 0.2)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: darkMode
                              ? "rgba(255, 255, 255, 0.8)"
                              : "rgba(30, 41, 59, 0.8)",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            "&.Mui-focused": {
                              color: "#4F46E5",
                              fontWeight: 600,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: darkMode ? "#ffffff" : "#1e293b",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            fontSize: "16px",
                            padding: "16px 14px 16px 8px",
                          },
                          "& .MuiInputAdornment-root": {
                            marginRight: "12px",
                          },
                          "& .MuiFormHelperText-root": {
                            color: darkMode
                              ? "rgba(255, 255, 255, 0.6)"
                              : "rgba(30, 41, 59, 0.6)",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontSize: "12px",
                          },
                        }}
                      />
                    </Grid>

                    {/* Telefon */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Telefon (Opsiyonel)"
                        name="telefon"
                        fullWidth
                        placeholder="0555 123 45 67"
                        value={form.telefon}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ ml: 0.5 }}>
                              <Phone
                                sx={{
                                  color: "#4F46E5",
                                  fontSize: 20,
                                  opacity: 0.8,
                                }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "16px",
                            height: "56px",
                            background: darkMode
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(20px)",
                            border: darkMode
                              ? "1px solid rgba(255, 255, 255, 0.1)"
                              : "1px solid rgba(79, 70, 229, 0.1)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "& fieldset": {
                              border: "none",
                            },
                            "&:hover": {
                              background: darkMode
                                ? "rgba(255, 255, 255, 0.12)"
                                : "rgba(255, 255, 255, 1)",
                              border: darkMode
                                ? "1px solid rgba(255, 255, 255, 0.2)"
                                : "1px solid rgba(79, 70, 229, 0.2)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 8px 25px rgba(79, 70, 229, 0.1)",
                            },
                            "&.Mui-focused": {
                              background: darkMode
                                ? "rgba(255, 255, 255, 0.15)"
                                : "rgba(255, 255, 255, 1)",
                              border: "2px solid #4F46E5",
                              transform: "translateY(-2px)",
                              boxShadow: "0 12px 30px rgba(79, 70, 229, 0.2)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: darkMode
                              ? "rgba(255, 255, 255, 0.8)"
                              : "rgba(30, 41, 59, 0.8)",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            "&.Mui-focused": {
                              color: "#4F46E5",
                              fontWeight: 600,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: darkMode ? "#ffffff" : "#1e293b",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            fontSize: "16px",
                            padding: "16px 14px 16px 8px",
                          },
                          "& .MuiInputAdornment-root": {
                            marginRight: "12px",
                          },
                        }}
                      />
                    </Grid>

                    {/* Şifre */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Şifre"
                        name="sifre"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        value={form.sifre}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ ml: 0.5 }}>
                              <Lock
                                sx={{
                                  color: "#4F46E5",
                                  fontSize: 20,
                                  opacity: 0.8,
                                }}
                              />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end" sx={{ mr: 1 }}>
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                size="medium"
                                sx={{
                                  color: "#4F46E5",
                                  opacity: 0.7,
                                  "&:hover": {
                                    backgroundColor: "rgba(79, 70, 229, 0.1)",
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
                            borderRadius: "16px",
                            height: "56px",
                            background: darkMode
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(20px)",
                            border: darkMode
                              ? "1px solid rgba(255, 255, 255, 0.1)"
                              : "1px solid rgba(79, 70, 229, 0.1)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "& fieldset": {
                              border: "none",
                            },
                            "&:hover": {
                              background: darkMode
                                ? "rgba(255, 255, 255, 0.12)"
                                : "rgba(255, 255, 255, 1)",
                              border: darkMode
                                ? "1px solid rgba(255, 255, 255, 0.2)"
                                : "1px solid rgba(79, 70, 229, 0.2)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 8px 25px rgba(79, 70, 229, 0.1)",
                            },
                            "&.Mui-focused": {
                              background: darkMode
                                ? "rgba(255, 255, 255, 0.15)"
                                : "rgba(255, 255, 255, 1)",
                              border: "2px solid #4F46E5",
                              transform: "translateY(-2px)",
                              boxShadow: "0 12px 30px rgba(79, 70, 229, 0.2)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: darkMode
                              ? "rgba(255, 255, 255, 0.8)"
                              : "rgba(30, 41, 59, 0.8)",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            "&.Mui-focused": {
                              color: "#4F46E5",
                              fontWeight: 600,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: darkMode ? "#ffffff" : "#1e293b",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            fontSize: "16px",
                            padding: "16px 8px 16px 8px",
                          },
                          "& .MuiInputAdornment-positionStart": {
                            marginRight: "12px",
                          },
                          "& .MuiInputAdornment-positionEnd": {
                            marginLeft: "8px",
                          },
                        }}
                      />
                    </Grid>

                    {/* Şifre Tekrar */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Şifre Tekrar"
                        name="sifreTekrar"
                        type={showPasswordConfirm ? "text" : "password"}
                        fullWidth
                        value={form.sifreTekrar}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ ml: 0.5 }}>
                              <Lock
                                sx={{
                                  color: "#4F46E5",
                                  fontSize: 20,
                                  opacity: 0.8,
                                }}
                              />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end" sx={{ mr: 1 }}>
                              <IconButton
                                onClick={() =>
                                  setShowPasswordConfirm(!showPasswordConfirm)
                                }
                                edge="end"
                                size="medium"
                                sx={{
                                  color: "#4F46E5",
                                  opacity: 0.7,
                                  "&:hover": {
                                    backgroundColor: "rgba(79, 70, 229, 0.1)",
                                    opacity: 1,
                                  },
                                }}
                              >
                                {showPasswordConfirm ? (
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
                            borderRadius: "16px",
                            height: "56px",
                            background: darkMode
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(20px)",
                            border: darkMode
                              ? "1px solid rgba(255, 255, 255, 0.1)"
                              : "1px solid rgba(79, 70, 229, 0.1)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "& fieldset": {
                              border: "none",
                            },
                            "&:hover": {
                              background: darkMode
                                ? "rgba(255, 255, 255, 0.12)"
                                : "rgba(255, 255, 255, 1)",
                              border: darkMode
                                ? "1px solid rgba(255, 255, 255, 0.2)"
                                : "1px solid rgba(79, 70, 229, 0.2)",
                              transform: "translateY(-1px)",
                              boxShadow: "0 8px 25px rgba(79, 70, 229, 0.1)",
                            },
                            "&.Mui-focused": {
                              background: darkMode
                                ? "rgba(255, 255, 255, 0.15)"
                                : "rgba(255, 255, 255, 1)",
                              border: "2px solid #4F46E5",
                              transform: "translateY(-2px)",
                              boxShadow: "0 12px 30px rgba(79, 70, 229, 0.2)",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: darkMode
                              ? "rgba(255, 255, 255, 0.8)"
                              : "rgba(30, 41, 59, 0.8)",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            "&.Mui-focused": {
                              color: "#4F46E5",
                              fontWeight: 600,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: darkMode ? "#ffffff" : "#1e293b",
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                            fontSize: "16px",
                            padding: "16px 8px 16px 8px",
                          },
                          "& .MuiInputAdornment-positionStart": {
                            marginRight: "12px",
                          },
                          "& .MuiInputAdornment-positionEnd": {
                            marginLeft: "8px",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                    </Box>
                  </Paper>
                </Grow>

                  {/* Error and Success Messages */}
                  {error && (
                    <Fade in={!!error}>
                      <Alert
                        severity="error"
                        sx={{
                          mt: 3,
                          borderRadius: "16px",
                          background: darkMode
                            ? "rgba(239, 68, 68, 0.1)"
                            : "rgba(239, 68, 68, 0.05)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          "& .MuiAlert-message": {
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                          },
                        }}
                      >
                        {error}
                      </Alert>
                    </Fade>
                  )}

                  {success && (
                    <Fade in={!!success}>
                      <Alert
                        severity="success"
                        sx={{
                          mt: 3,
                          borderRadius: "16px",
                          background: darkMode
                            ? "rgba(34, 197, 94, 0.1)"
                            : "rgba(34, 197, 94, 0.05)",
                          border: "1px solid rgba(34, 197, 94, 0.2)",
                          "& .MuiAlert-message": {
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            fontWeight: 500,
                          },
                        }}
                      >
                        {success}
                      </Alert>
                    </Fade>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading}
                    startIcon={
                      isLoading ? null : <PersonAdd sx={{ fontSize: 20 }} />
                    }
                    sx={{
                      mt: 4,
                      height: "56px",
                      fontWeight: 600,
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      fontSize: "16px",
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
                    {isLoading
                      ? "Kayıt yapılıyor..."
                      : "Akademik Personel Olarak Kayıt Ol"}
                  </Button>
                </form>

                {/* Login Link */}
                <Box sx={{ textAlign: "center", mt: 4 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: darkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(30, 41, 59, 0.7)",
                      fontFamily: '"Inter", "Roboto", sans-serif',
                    }}
                  >
                    Zaten hesabınız var mı?{" "}
                    <Link
                      to="/"
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
                      Giriş Yap
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

export default OgretmenKayit;
