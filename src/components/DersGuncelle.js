import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit as EditIcon, Update as UpdateIcon } from "@mui/icons-material";

const DersGuncelle = ({
  onBack,
  onEditCourse,
  selectedSemester = "2025-2026-Güz",
}) => {
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(selectedSemester);

  const termOptions = [
    "2025-2026 Bahar",
    "2025-2026 Güz",
    "2024-2025 Bahar",
    "2024-2025 Güz",
    "2023-2024 Bahar",
    "2023-2024 Güz",
  ];

  // Load courses
  useEffect(() => {
    const savedTeacherCourses = localStorage.getItem("teacherCourses");

    if (savedTeacherCourses) {
      setTeacherCourses(JSON.parse(savedTeacherCourses));
    }
  }, []);

  // Filter courses by selected term
  const filteredTeacherCourses = teacherCourses.filter(
    (course) => course.term === selectedTerm
  );

  const handleEditCourse = (course) => {
    // Navigate back to course registration with the course data for editing
    onEditCourse && onEditCourse(course);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, pb: 4 }}>
      {/* Simple Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          p: 2,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button variant="outlined" onClick={onBack} size="small">
            Geri Dön
          </Button>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#1a237e", lineHeight: -1 }}
          >
            Ders Güncelle
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Dönem Seçin</InputLabel>
          <Select
            value={selectedTerm}
            label="Dönem Seçin"
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            {termOptions.map((term) => (
              <MenuItem key={term} value={term}>
                {term}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Courses List */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            color: "primary.main",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <UpdateIcon />
          {selectedTerm} Dönemi Derslerim ({filteredTeacherCourses.length})
        </Typography>

        {filteredTeacherCourses.length === 0 ? (
          <Alert severity="info" sx={{ textAlign: "center" }}>
            {selectedTerm} dönemi için kayıtlı ders bulunmamaktadır.
            <br />
            Ders eklemek için "Ders ve Dönem İşlemleri" sayfasından "Ders Ekle"
            butonunu kullanabilirsiniz.
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {filteredTeacherCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: "primary.main",
                            mb: 0.5,
                            lineHeight: 1.3,
                            wordBreak: "break-word",
                          }}
                        >
                          {course.courseName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            lineHeight: 1.2,
                            mb: 1,
                          }}
                        >
                          {course.courseCode}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: "block",
                            lineHeight: 1.2,
                          }}
                        >
                          {course.branch}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        flexWrap: "wrap",
                        mb: 2,
                      }}
                    >
                      <Chip
                        label={course.courseLanguage}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.75rem" }}
                      />
                      <Chip
                        label={
                          course.mandatoryElective === "Z"
                            ? "Zorunlu"
                            : "Seçmeli"
                        }
                        size="small"
                        color={
                          course.mandatoryElective === "Z"
                            ? "primary"
                            : "secondary"
                        }
                        sx={{ fontSize: "0.75rem" }}
                      />
                    </Box>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.75rem",
                        lineHeight: 1.2,
                        display: "block",
                        mb: 2,
                      }}
                    >
                      {course.theoryPractice} • {course.credits} Kredi •{" "}
                      {course.ects} ECTS
                    </Typography>

                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditCourse(course)}
                      fullWidth
                      size="small"
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Düzenle
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default DersGuncelle;
