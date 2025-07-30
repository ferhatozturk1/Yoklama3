import React, { useState, useEffect } from "react";
import { courseList } from "../data/courseSchedule";
import {
  Box,
  Typography,
  Paper,
  Container,
  ListItemButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  Update as UpdateIcon,
  School as SchoolIcon,
} from "@mui/icons-material";

const DersVeDönemIslemleri = ({
  onNavigate,
  selectedSemester,
  onSemesterChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedTerm, setSelectedTerm] = useState(
    selectedSemester || "2025-2026 Güz"
  );
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check if current date is a national holiday
  const getNationalHoliday = (date) => {
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const day = date.getDate();

    const holidays = {
      "1-1": "Yılbaşı",
      "4-23": "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
      "5-1": "1 Mayıs Emek ve Dayanışma Günü",
      "5-19": "19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramı",
      "8-30": "30 Ağustos Zafer Bayramı",
      "10-29": "29 Ekim Cumhuriyet Bayramı",
      "11-10": "10 Kasım Atatürk'ü Anma Günü",
    };

    const key = `${month}-${day}`;
    return holidays[key] || null;
  };

  const currentHoliday = getNationalHoliday(currentTime);

  // Available terms
  const termOptions = [
    "2023-2024 Güz",
    "2023-2024 Bahar",
    "2024-2025 Güz",
    "2024-2025 Bahar",
    "2025-2026 Güz",
    "2025-2026 Bahar",
  ];

  const handleTermChange = (event) => {
    const newTerm = event.target.value;
    setSelectedTerm(newTerm);
    if (onSemesterChange) {
      onSemesterChange(newTerm);
    }
  };

  // Güncel dönem kontrolü - sadece 2025-2026 dönemi aktif
  const isCurrentTerm = (term) => {
    return term.includes("2025-2026");
  };

  // Eski dönem seçildiğinde bazı işlemleri engelle
  const isTermActive = isCurrentTerm(selectedTerm);

  const menuItems = [
    {
      id: "ders-kayit",
      title: "Ders Ekle",
      description: isTermActive
        ? "Yeni ders tanımlama ve kayıt işlemleri"
        : "Bu işlem sadece aktif dönem için kullanılabilir",
      icon: <AddCircleIcon color={isTermActive ? "primary" : "disabled"} />,
      action: () => isTermActive && onNavigate("ders-kayit"),
      disabled: !isTermActive,
    },
    {
      id: "ders-guncelle",
      title: "Ders Güncelle",
      description: isTermActive
        ? "Kayıtlı ders bilgilerini güncelleme"
        : "Bu işlem sadece aktif dönem için kullanılabilir",
      icon: <UpdateIcon color={isTermActive ? "success" : "disabled"} />,
      action: () => isTermActive && onNavigate("ders-guncelle"),
      disabled: !isTermActive,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 1, pb: 1 }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: isMobile ? 1 : 2,
          mb: isMobile ? 1.5 : 2,
          background: "linear-gradient(135deg, #1B2E6D 0%, #4A90E2 100%)",
          borderRadius: "8px",
          color: "white",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
        }}
      >
        {/* Mobile Horizontal Layout */}
        {isMobile ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {/* Left: Avatar + Name */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flex: "1 1 auto",
                minWidth: 0, // Allow shrinking
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                }}
              >
                <SchoolIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Box
                sx={{
                  minWidth: 0, // Allow text truncation
                  flex: 1,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.85rem",
                    lineHeight: 1.2,
                    mb: 0.25,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Ders ve Dönem İşlemleri
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    opacity: 0.85,
                    lineHeight: 1.1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Ders tanımlama ve güncelleme
                </Typography>
              </Box>
            </Box>

            {/* Right: Time + Date */}
            <Box
              sx={{
                textAlign: "right",
                flexShrink: 0,
                bgcolor: "rgba(255,255,255,0.1)",
                px: 1.5,
                py: 1,
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: currentHoliday ? "0.75rem" : "0.9rem",
                  lineHeight: 1.1,
                  mb: 0.25,
                  textAlign: "center",
                }}
              >
                {currentHoliday ||
                  currentTime.toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  opacity: 0.85,
                  lineHeight: 1.1,
                }}
              >
                {currentTime.toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "short",
                })}
              </Typography>
            </Box>
          </Box>
        ) : (
          /* Desktop Layout */
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  width: 48,
                  height: 48,
                }}
              >
                <SchoolIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: "1.1rem",
                    lineHeight: 1.2,
                  }}
                >
                  Ders ve Dönem İşlemleri
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.9,
                    fontSize: "0.85rem",
                    lineHeight: 1.2,
                  }}
                >
                  Ders tanımlama, kayıt ve güncelleme işlemleri
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                textAlign: "center",
                bgcolor: "rgba(255,255,255,0.1)",
                px: 3,
                py: 1.5,
                borderRadius: "8px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  mb: 0.5,
                  fontSize: currentHoliday ? "0.95rem" : "1.1rem",
                  lineHeight: 1.2,
                  textAlign: "center",
                }}
              >
                {currentHoliday || currentTime.toLocaleTimeString("tr-TR")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  fontSize: "0.85rem",
                  lineHeight: 1.2,
                }}
              >
                {currentTime.toLocaleDateString("tr-TR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Term Selection */}
      <Paper
        elevation={2}
        sx={{
          p: 1.5,
          mb: 1.5,
          borderRadius: "12px",
          background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)",
          border: "1px solid rgba(26, 35, 126, 0.08)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <Box
            sx={{
              backgroundColor: "rgba(26, 35, 126, 0.1)",
              borderRadius: "8px",
              p: 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SchoolIcon sx={{ fontSize: 18, color: "primary.main" }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Aktif Dönem Seçimi
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Dönem</InputLabel>
              <Select
                value={selectedTerm}
                label="Dönem"
                onChange={handleTermChange}
                sx={{
                  borderRadius: "16px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                  },
                }}
              >
                {termOptions.map((term) => (
                  <MenuItem key={term} value={term}>
                    {term}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 1.5,
            p: 1,
            backgroundColor: isTermActive
              ? "rgba(26, 35, 126, 0.05)"
              : "rgba(255, 152, 0, 0.05)",
            borderRadius: "8px",
            border: isTermActive
              ? "1px solid rgba(26, 35, 126, 0.1)"
              : "1px solid rgba(255, 152, 0, 0.2)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: isTermActive ? "text.secondary" : "warning.main",
              fontWeight: 500,
              fontSize: "0.8rem",
              lineHeight: 1.3,
            }}
          >
            Seçili dönem:{" "}
            <strong style={{ color: isTermActive ? "#1a237e" : "#f57c00" }}>
              {selectedTerm}
            </strong>
            {isTermActive
              ? " - Tüm ders işlemleri bu dönem için gerçekleştirilecektir."
              : " - Bu dönem için ders işlemleri yapılamaz. Ders kayıt ve güncelleme işlemleri sadece aktif dönemde (2025-2026) kullanılabilir."}
          </Typography>
        </Box>
      </Paper>

      {/* Menu Items */}
      <Grid container spacing={1.5}>
        {menuItems.map((item) => (
          <Grid item xs={12} md={6} key={item.id}>
            <Paper
              elevation={2}
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                background: item.disabled
                  ? "linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)"
                  : "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
                border: item.disabled
                  ? "1px solid rgba(0, 0, 0, 0.12)"
                  : "1px solid rgba(26, 35, 126, 0.08)",
                transition: "all 0.3s ease-in-out",
                height: "100%",
                opacity: item.disabled ? 0.6 : 1,
                cursor: item.disabled ? "not-allowed" : "pointer",
                "&:hover": item.disabled
                  ? {}
                  : {
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 15px rgba(26, 35, 126, 0.15)",
                      borderColor: "rgba(26, 35, 126, 0.2)",
                    },
              }}
            >
              <ListItemButton
                onClick={item.action}
                disabled={item.disabled}
                sx={{
                  py: 2,
                  px: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
                  height: "100%",
                  textAlign: "center",
                  cursor: item.disabled ? "not-allowed" : "pointer",
                  "&:hover": {
                    backgroundColor: item.disabled
                      ? "transparent"
                      : "rgba(26, 35, 126, 0.04)",
                  },
                  "&.Mui-disabled": {
                    opacity: 1,
                  },
                }}
              >
                <Box
                  sx={{
                    backgroundColor: item.disabled
                      ? "rgba(158, 158, 158, 0.1)"
                      : item.id === "ders-kayit"
                      ? "rgba(33, 150, 243, 0.1)"
                      : "rgba(76, 175, 80, 0.1)",
                    borderRadius: "12px",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 48,
                    height: 48,
                    mb: 1,
                  }}
                >
                  {React.cloneElement(item.icon, {
                    sx: { fontSize: 24 },
                  })}
                </Box>

                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: item.disabled ? "text.disabled" : "primary.main",
                      mb: 0.5,
                      fontSize: "1rem",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: item.disabled ? "text.disabled" : "text.secondary",
                      lineHeight: 1.3,
                      fontSize: "0.8rem",
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </ListItemButton>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DersVeDönemIslemleri;
