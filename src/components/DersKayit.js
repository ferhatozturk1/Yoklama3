import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Container,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Alert,
  Snackbar,
  Card,
  CardContent,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Save as SaveIcon,
  Clear as ClearIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

const DersKayit = ({ onBack, selectedSemester = "2025-2026-guz" }) => {
  const location = useLocation();
  const [courseData, setCourseData] = useState({
    term: selectedSemester,
    branch: "",
    courseCode: "",
    courseName: "",
    courseLanguage: "Türkçe",
    theoryPractice: "",
    mandatoryElective: "Z",
    credits: "",
    ects: "",
    faculty: "Öğr. Gör. Mehmet Nuri Öğüt",
  });

  const [savedCourses, setSavedCourses] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editingCourse, setEditingCourse] = useState(null);

  // Load saved courses from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("teacherCourses");
    if (saved) {
      setSavedCourses(JSON.parse(saved));
    }

    // Check if we're editing a course (coming from DersGuncelle)
    if (location.state?.editingCourse) {
      const courseToEdit = location.state.editingCourse;
      setCourseData(courseToEdit);
      setEditingCourse(courseToEdit);
    }
  }, [location.state]);

  // Save courses to localStorage whenever savedCourses changes
  useEffect(() => {
    localStorage.setItem("teacherCourses", JSON.stringify(savedCourses));
  }, [savedCourses]);

  const termOptions = [
    "2023-2024 Güz",
    "2023-2024 Bahar",
    "2024-2025 Güz",
    "2024-2025 Bahar",
    "2025-2026 Güz",
    "2025-2026 Bahar",
  ];

  const branchOptions = [
    "Matematik",
    "Bilgisayar Mühendisliği",
    "Elektrik Mühendisliği",
    "Makine Mühendisliği",
    "İngilizce",
    "Fizik",
    "Kimya",
    "Biyoloji",
  ];

  const languageOptions = ["Türkçe", "İngilizce", "Almanca", "Fransızca"];

  const handleInputChange = (field, value) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Validation
    const requiredFields = [
      "term",
      "branch",
      "courseCode",
      "courseName",
      "theoryPractice",
      "credits",
      "ects",
    ];
    const missingFields = requiredFields.filter((field) => !courseData[field]);

    if (missingFields.length > 0) {
      setSnackbar({
        open: true,
        message: "Lütfen tüm zorunlu alanları doldurun",
        severity: "error",
      });
      return;
    }

    const courseWithId = {
      ...courseData,
      id: editingCourse ? editingCourse.id : Date.now(),
      createdAt: editingCourse
        ? editingCourse.createdAt
        : new Date().toISOString(),
    };

    if (editingCourse) {
      // Update existing course
      setSavedCourses((prev) =>
        prev.map((course) =>
          course.id === editingCourse.id ? courseWithId : course
        )
      );
      setEditingCourse(null);
      setSnackbar({
        open: true,
        message: "Ders başarıyla güncellendi",
        severity: "success",
      });
    } else {
      // Add new course
      setSavedCourses((prev) => [...prev, courseWithId]);
      setSnackbar({
        open: true,
        message: "Ders başarıyla kaydedildi",
        severity: "success",
      });
    }

    handleClear();
  };

  const handleClear = () => {
    setCourseData({
      term: selectedSemester,
      branch: "",
      courseCode: "",
      courseName: "",
      courseLanguage: "Türkçe",
      theoryPractice: "",
      mandatoryElective: "Z",
      credits: "",
      ects: "",
      faculty: "Öğr. Gör. Mehmet Nuri Öğüt",
    });
    setEditingCourse(null);
  };

  const handleEdit = (course) => {
    setCourseData(course);
    setEditingCourse(course);
  };

  const handleDelete = (courseId) => {
    setSavedCourses((prev) => prev.filter((course) => course.id !== courseId));
    setSnackbar({
      open: true,
      message: "Ders başarıyla silindi",
      severity: "info",
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, pb: 4 }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
          borderRadius: 3,
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={onBack} sx={{ color: "white", mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                lineHeight: 1.3,
                mb: 0.5,
              }}
            >
              {editingCourse ? "Ders Güncelle" : "Ders Kayıt"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontSize: "0.875rem",
                lineHeight: 1.5,
              }}
            >
              {editingCourse
                ? "Mevcut ders bilgilerini güncelleyin"
                : "Yeni ders tanımlayın ve kaydedin"}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Form Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
            >
              Ders Bilgileri
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Dönem</InputLabel>
                  <Select
                    value={courseData.term}
                    label="Dönem"
                    onChange={(e) => handleInputChange("term", e.target.value)}
                  >
                    {termOptions.map((term) => (
                      <MenuItem key={term} value={term}>
                        {term}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Branş</InputLabel>
                  <Select
                    value={courseData.branch}
                    label="Branş"
                    onChange={(e) =>
                      handleInputChange("branch", e.target.value)
                    }
                  >
                    {branchOptions.map((branch) => (
                      <MenuItem key={branch} value={branch}>
                        {branch}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ders Kodu"
                  value={courseData.courseCode}
                  onChange={(e) =>
                    handleInputChange("courseCode", e.target.value)
                  }
                  placeholder="örn: MATH113"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ders Adı"
                  value={courseData.courseName}
                  onChange={(e) =>
                    handleInputChange("courseName", e.target.value)
                  }
                  placeholder="örn: Matematik I"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Ders Dili</InputLabel>
                  <Select
                    value={courseData.courseLanguage}
                    label="Ders Dili"
                    onChange={(e) =>
                      handleInputChange("courseLanguage", e.target.value)
                    }
                  >
                    {languageOptions.map((language) => (
                      <MenuItem key={language} value={language}>
                        {language}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="T+P (Teori + Pratik)"
                  value={courseData.theoryPractice}
                  onChange={(e) =>
                    handleInputChange("theoryPractice", e.target.value)
                  }
                  placeholder="örn: 3+1"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Kredi"
                  type="number"
                  value={courseData.credits}
                  onChange={(e) => handleInputChange("credits", e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="ECTS"
                  type="number"
                  value={courseData.ects}
                  onChange={(e) => handleInputChange("ects", e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Z/S Durumu</FormLabel>
                  <RadioGroup
                    row
                    value={courseData.mandatoryElective}
                    onChange={(e) =>
                      handleInputChange("mandatoryElective", e.target.value)
                    }
                  >
                    <FormControlLabel
                      value="Z"
                      control={<Radio />}
                      label="Zorunlu"
                    />
                    <FormControlLabel
                      value="S"
                      control={<Radio />}
                      label="Seçmeli"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Öğretim Üyesi"
                  value={courseData.faculty}
                  onChange={(e) => handleInputChange("faculty", e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 4,
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClear}
              >
                Temizle
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                {editingCourse ? "Güncelle" : "Kaydet"}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Saved Courses List */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}
            >
              Kayıtlı Dersler ({savedCourses.length})
            </Typography>

            {savedCourses.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                Henüz kayıtlı ders bulunmamaktadır
              </Typography>
            ) : (
              <Box sx={{ maxHeight: 600, overflow: "auto" }}>
                {savedCourses.map((course) => (
                  <Card
                    key={course.id}
                    sx={{ mb: 2, border: "1px solid #e0e0e0" }}
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "primary.main" }}
                        >
                          {course.courseName}
                        </Typography>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(course)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(course.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 1 }}
                      >
                        {course.courseCode} • {course.term}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          flexWrap: "wrap",
                          mb: 1,
                        }}
                      >
                        <Chip
                          label={course.branch}
                          size="small"
                          variant="outlined"
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
                        />
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        {course.theoryPractice} • {course.credits} Kredi •{" "}
                        {course.ects} ECTS
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DersKayit;
