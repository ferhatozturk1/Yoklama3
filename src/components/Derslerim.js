import React, { useState } from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  CardActions,
} from "@mui/material";
import { Edit, School, LocationOn, Groups } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import DersDetay from "./DersDetay";

const Derslerim = () => {
  // View state - 'list' veya 'detail'
  const [currentView, setCurrentView] = useState("list");
  const [selectedDers, setSelectedDers] = useState(null);

  const [dersler] = useState([
    {
      id: 1,
      name: "Matematik",
      code: "MAT113/3",
      section: "A1",
      sectionFull: "YP-A1",
      building: "A Blok",
      room: "A101",
      class: "10-A",
      instructor: "Dr. Ayşe Kaya",
      schedule: {
        pazartesi: [{ startTime: "08:40", endTime: "09:30", room: "A101" }],
        çarşamba: [{ startTime: "14:00", endTime: "14:50", room: "A101" }],
        cuma: [{ startTime: "10:00", endTime: "10:50", room: "A101" }],
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 32,
      attendanceStatus: "not_taken",
      lastAttendance: null,
      attendanceRate: 0,
      files: [],
    },
    {
      id: 2,
      name: "İngilizce",
      code: "ENG101/8",
      section: "D101",
      sectionFull: "YP-D101",
      building: "D Blok",
      room: "D101",
      class: "10-B",
      instructor: "Dr. Ayşe Kaya",
      schedule: {
        salı: [{ startTime: "09:50", endTime: "10:40", room: "D101" }],
        perşembe: [{ startTime: "11:00", endTime: "11:50", room: "D101" }],
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 28,
      attendanceStatus: "not_taken",
      lastAttendance: null,
      attendanceRate: 0,
      files: [],
    },
    {
      id: 3,
      name: "Bilgisayar Mühendisliği",
      code: "BMC3",
      section: "1",
      sectionFull: "Lab-1",
      building: "B Blok",
      room: "B205",
      class: "11-A",
      instructor: "Dr. Ayşe Kaya",
      schedule: {
        perşembe: [{ startTime: "11:00", endTime: "11:50", room: "B205" }],
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 24,
      attendanceStatus: "not_taken",
      lastAttendance: null,
      attendanceRate: 0,
      files: [],
    },
  ]);

  // Event handlers
  const handleDersClick = (ders) => {
    setSelectedDers(ders);
    setCurrentView("detail");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedDers(null);
  };

  const getDaysText = (schedule) => {
    return Object.keys(schedule).join(", ");
  };

  // Detay görünümü için DersDetay bileşenini kullan
  if (currentView === "detail" && selectedDers) {
    return <DersDetay ders={selectedDers} onBack={handleBackToList} />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#1a237e", mb: 4 }}
      >
        📚 Derslerim
      </Typography>

      <Grid container spacing={3}>
        {dersler.map((ders) => (
          <Grid item xs={12} sm={6} md={4} key={ders.id}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                },
                borderRadius: 2,
              }}
              onClick={() => handleDersClick(ders)}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                {/* Ders Kodu */}
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "#1a237e", mb: 1 }}
                >
                  {ders.code}
                </Typography>

                {/* Section */}
                <Typography variant="h6" sx={{ color: "#666", mb: 1 }}>
                  Section - {ders.section}
                </Typography>
                <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
                  {ders.sectionFull}
                </Typography>

                {/* Katılım Oranı */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1, color: "#666" }}>
                    Henüz yoklama alınmadı
                  </Typography>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      border: "4px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      bgcolor: "#f8f9fa",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#999" }}
                    >
                      %0
                    </Typography>
                  </Box>
                </Box>

                {/* Ders Bilgileri - Basit Format */}
                <Box sx={{ textAlign: "left", mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Ders:</strong> {ders.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Günler:</strong> {getDaysText(ders.schedule)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Öğrenci Sayısı:</strong> {ders.studentCount}
                  </Typography>
                </Box>

                {/* Dersi Düzenle Butonu */}
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  fullWidth
                  sx={{
                    borderColor: "#1a237e",
                    color: "#1a237e",
                    "&:hover": {
                      borderColor: "#1a237e",
                      bgcolor: "rgba(26, 35, 126, 0.04)",
                    },
                  }}
                >
                  Dersi Düzenle
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Derslerim;
