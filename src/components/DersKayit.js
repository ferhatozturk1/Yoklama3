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
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

const DersKayit = ({ onBack, selectedSemester = "2025-2026-Güz" }) => {
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
    faculty: "",
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
      faculty: "",
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
    <Container maxWidth="lg" sx={{ mt: 1, pb: 2 }}>
      <Grid container spacing={2}>
        {/* Form Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "primary.main", fontWeight: 600, fontSize: '1rem' }}
              >
                {editingCourse ? "Ders Güncelle" : "Ders Bilgileri"}
              </Typography>
              <Button variant="outlined" onClick={onBack} size="small">
                Geri Dön
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Branş"
                  size="small"
                  value={courseData.branch}
                  onChange={(e) => handleInputChange("branch", e.target.value)}
                  placeholder="örn: Matematik"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ders Kodu"
                  size="small"
                  value={courseData.courseCode}
                  onChange={(e) =>
                    handleInputChange("courseCode", e.target.value)
                  }
                  placeholder="örn: MATH113"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ders Adı"
                  size="small"
                  value={courseData.courseName}
                  onChange={(e) =>
                    handleInputChange("courseName", e.target.value)
                  }
                  placeholder="örn: Matematik I"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
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

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="T+P (Teori + Pratik)"
                  size="small"
                  value={courseData.theoryPractice}
                  onChange={(e) =>
                    handleInputChange("theoryPractice", e.target.value)
                  }
                  placeholder="örn: 3+1"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="Kredi"
                    size="small"
                    type="number"
                    value={courseData.credits}
                    onChange={(e) => handleInputChange("credits", e.target.value)}
                    sx={{ width: '50%' }}
                  />
                  <TextField
                    label="ECTS"
                    size="small"
                    type="number"
                    value={courseData.ects}
                    onChange={(e) => handleInputChange("ects", e.target.value)}
                    sx={{ width: '50%' }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontSize: '0.875rem', mb: 0.5 }}>Z/S Durumu</FormLabel>
                  <RadioGroup
                    row
                    value={courseData.mandatoryElective}
                    onChange={(e) =>
                      handleInputChange("mandatoryElective", e.target.value)
                    }
                  >
                    <FormControlLabel
                      value="Z"
                      control={<Radio size="small" />}
                      label="Zorunlu"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                    />
                    <FormControlLabel
                      value="S"
                      control={<Radio size="small" />}
                      label="Seçmeli"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 2,
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClear}
                size="small"
              >
                Temizle
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                size="small"
              >
                {editingCourse ? "Güncelle" : "Kaydet"}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Saved Courses List */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 1.5, color: "primary.main", fontWeight: 600, fontSize: '1rem' }}
            >
              Kayıtlı Dersler ({savedCourses.length})
            </Typography>

            {savedCourses.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 2, fontSize: '0.875rem' }}
              >
                Henüz kayıtlı ders bulunmamaktadır
              </Typography>
            ) : (
              <Box sx={{ maxHeight: 400, overflow: "auto" }}>
                {savedCourses.map((course) => (
                  <Card
                    key={course.id}
                    sx={{ mb: 1, border: "1px solid #e0e0e0", borderRadius: 2 }}
                  >
                    <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "primary.main", fontSize: '0.875rem', lineHeight: 1.2 }}
                        >
                          {course.courseName}
                        </Typography>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(course)}
                            sx={{ p: 0.5 }}
                          >
                            <EditIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(course.id)}
                            color="error"
                            sx={{ p: 0.5 }}
                          >
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      </Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 0.5, fontSize: '0.75rem' }}
                      >
                        {course.courseCode} • {course.branch}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          flexWrap: "wrap",
                          mb: 0.5,
                        }}
                      >
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
                          sx={{ height: 20, fontSize: '0.6875rem' }}
                        />
                      </Box>

                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
                        {course.theoryPractice} • {course.credits} Kredi • {course.ects} ECTS
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
