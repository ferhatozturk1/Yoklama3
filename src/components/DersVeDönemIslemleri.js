import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  Update as UpdateIcon,
  School as SchoolIcon,
  LocationOn,
  Groups,
  CalendarToday,
  CheckCircle,
  Edit,
} from "@mui/icons-material";

const DersVeDönemIslemleri = ({ onNavigate }) => {
  // API Context'leri
  const { user } = useAuth();
  const { lecturerSections, lectures, loading, fetchLecturerSections, fetchLectures } = useData();

  const [selectedTerm, setSelectedTerm] = useState("2025-2026 Güz");

  // Öğretmenin verilerini yükle
  useEffect(() => {
    if (user?.id) {
      if (lecturerSections.length === 0) {
        fetchLecturerSections();
      }
      if (lectures.length === 0 && user.department_id) {
        fetchLectures(user.department_id);
      }
    }
  }, [user?.id]);

  // Available terms
  const termOptions = [
    "2025-2026 Bahar",
    "2025-2026 Güz",
    "2024-2025 Bahar",
    "2024-2025 Güz",
    "2023-2024 Bahar",
    "2023-2024 Güz",
  ];

  const handleTermChange = (event) => {
    setSelectedTerm(event.target.value);
  };

  // Güncel dönem kontrolü - sadece 2025-2026 dönemi aktif
  const isCurrentTerm = (term) => {
    return term.includes("2025-2026");
  };

  const isTermActive = isCurrentTerm(selectedTerm);

  // API'den gelen gerçek ders verileri
  const getCourseData = () => {
    if (!lecturerSections || lecturerSections.length === 0) {
      return [];
    }

    return lecturerSections.map((section) => {
      // Schedule formatını oluştur
      const schedule = {};
      const dayMapping = {
        "Monday": "Pazartesi",
        "Tuesday": "Salı",
        "Wednesday": "Çarşamba",
        "Thursday": "Perşembe",
        "Friday": "Cuma"
      };

      if (section.hours && section.hours.length > 0) {
        section.hours.forEach((hour) => {
          const dayName = dayMapping[hour.day];
          if (dayName) {
            if (!schedule[dayName]) {
              schedule[dayName] = [];
            }
            schedule[dayName].push({
              startTime: hour.time_start?.substring(0, 5) || "00:00",
              endTime: hour.time_end?.substring(0, 5) || "00:00",
              room: hour.classroom?.name || "Sınıf Belirtilmemiş"
            });
          }
        });
      }

      return {
        id: section.id,
        name: section.lecture?.explicit_name || section.lecture?.name || "Ders Adı",
        code: `${section.lecture?.name || ""} ${section.lecture?.code || ""}`.trim(),
        section: section.section_number || "1",
        building: "Orta Doğu Teknik Üniversitesi",
        room: section.hours?.[0]?.classroom?.name || "Sınıf Belirtilmemiş",
        schedule: schedule,
        studentCount: Math.floor(Math.random() * 40) + 20, // 20-60 arası random
        attendanceStatus: Math.random() > 0.3 ? "completed" : "pending",
        attendanceRate: Math.floor(Math.random() * 20) + 80, // 80-100 arası
      };
    });
  };

  const courses = getCourseData();

  const getDaysText = (schedule) => {
    return Object.keys(schedule).join(", ");
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getAttendanceStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Tamamlandı";
      case "pending":
        return "Beklemede";
      default:
        return "Bilinmiyor";
    }
  };

  if (loading.lecturerSections) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1a237e",
            mb: 1,
            fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
          }}
        >
          Ders ve Dönem İşlemleri
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            fontFamily: '"Inter", "Roboto", system-ui, sans-serif',
          }}
        >
          Derslerinizi yönetin, program düzenleyin ve dönem işlemlerini gerçekleştirin
        </Typography>
      </Box>

      {/* Term Selection */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Dönem Seçin</InputLabel>
              <Select
                value={selectedTerm}
                onChange={handleTermChange}
                label="Dönem Seçin"
              >
                {termOptions.map((term) => (
                  <MenuItem key={term} value={term}>
                    {term}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={isTermActive ? "Aktif Dönem" : "Geçmiş Dönem"}
                color={isTermActive ? "success" : "default"}
                variant={isTermActive ? "filled" : "outlined"}
              />
              {!isTermActive && (
                <Typography variant="body2" color="text.secondary">
                  Bu dönem için işlem yapılamaz
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Quick Actions */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography
          variant="h6"
          sx={{ mb: 3, fontWeight: 600, color: "#1a237e" }}
        >
          Hızlı İşlemler
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={() => onNavigate && onNavigate("ders-kayit")}
              disabled={!isTermActive}
              sx={{
                py: 1.5,
                background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)",
                },
              }}
            >
              Ders Kayıt
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => onNavigate && onNavigate("ders-ekle-birak")}
              disabled={!isTermActive}
              sx={{ py: 1.5 }}
            >
              Ders Ekle/Bırak
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<UpdateIcon />}
              onClick={() => onNavigate && onNavigate("ders-guncelle")}
              disabled={!isTermActive}
              sx={{ py: 1.5 }}
            >
              Ders Güncelle
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<SchoolIcon />}
              disabled={!isTermActive}
              sx={{ py: 1.5 }}
            >
              Dönem Raporu
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Course List */}
      <Paper elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <SchoolIcon sx={{ color: "#1a237e" }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, fontSize: "1rem" }}
            >
              Derslerim ({courses.length})
            </Typography>
          </Box>
        </Box>

        {courses.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <SchoolIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Henüz ders kaydınız bulunmuyor
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Yeni dönem için ders kayıt işlemlerinizi gerçekleştirebilirsiniz
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={() => onNavigate && onNavigate("ders-kayit")}
              disabled={!isTermActive}
            >
              Ders Kayıt İşlemleri
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Ders Bilgileri</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Program</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Öğrenci</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Yoklama</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((ders) => (
                  <TableRow
                    key={ders.id}
                    sx={{
                      "&:hover": { backgroundColor: "#f9f9f9" },
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          {ders.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          {ders.code} - Şube {ders.section}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">
                            {ders.room}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          {getDaysText(ders.schedule)}
                        </Typography>
                        {Object.entries(ders.schedule).map(([day, times]) => (
                          <Typography
                            key={day}
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            {day}: {times.map(t => `${t.startTime}-${t.endTime}`).join(", ")}
                          </Typography>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Groups sx={{ fontSize: 20, color: "text.secondary" }} />
                        <Typography variant="body2">{ders.studentCount}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Chip
                          label={getAttendanceStatusText(ders.attendanceStatus)}
                          color={getAttendanceStatusColor(ders.attendanceStatus)}
                          size="small"
                          sx={{ mb: 0.5 }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                          Katılım: %{ders.attendanceRate}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Edit />}
                          disabled={!isTermActive}
                        >
                          Düzenle
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default DersVeDönemIslemleri;