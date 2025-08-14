import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { fetchLecturerLectures } from "../api/schedule";
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
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
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
  const [lecturerCourses, setLecturerCourses] = useState([]); // Hocanın mevcut dersleri
  const [loading, setLoading] = useState(false);
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

  // Load lecturer's existing courses from API
  useEffect(() => {
    const loadLecturerCourses = async () => {
      if (!user?.lecturer_id || !accessToken) return;
      
      try {
        setLoading(true);
        console.log('🔄 Loading lecturer courses for DersKayit...');
        const data = await fetchLecturerLectures(user.lecturer_id, accessToken);
        
        // Normalize the courses data
        let normalizedCourses = [];
        if (data?.sections && Array.isArray(data.sections)) {
          normalizedCourses = data.sections.map(section => ({
            id: section.lecture.id,
            name: section.lecture.explicit_name || section.lecture.name,
            code: section.lecture.code,
            section_number: section.section_number,
            section_id: section.id,
            // Backend format için ek bilgiler
            lecture_name: section.lecture.explicit_name || section.lecture.name,
            lecture_code: section.lecture.code,
          }));
        }
        
        setLecturerCourses(normalizedCourses);
        console.log('✅ Lecturer courses loaded:', normalizedCourses);
      } catch (error) {
        console.error('❌ Error loading lecturer courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLecturerCourses();
  }, [user?.lecturer_id, accessToken]);

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

  const handleSave = async () => {
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

    try {
      setLoading(true);

      // Backend API formatına uygun veri hazırla
      const backendCourseData = {
        name: courseData.courseName,
        code: courseData.courseCode,
        explicit_name: courseData.courseName,
        language: courseData.courseLanguage,
        theory_practice: courseData.theoryPractice,
        mandatory_elective: courseData.mandatoryElective === "Z" ? "mandatory" : "elective",
        credits: parseInt(courseData.credits),
        ects: parseInt(courseData.ects),
        term: courseData.term,
        branch: courseData.branch,
        faculty: courseData.faculty
      };

      console.log('📤 Backend course data to be sent:', backendCourseData);

      // Şimdilik localStorage'a kaydet (backend entegrasyonu sonra eklenebilir)
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
          message: "Ders başarıyla güncellendi! Ders Programı sayfasına yönlendiriliyorsunuz...",
          severity: "success",
        });
      } else {
        // Add new course
        setSavedCourses((prev) => [...prev, courseWithId]);
        setSnackbar({
          open: true,
          message: "Ders başarıyla kaydedildi! Ders Programı sayfasına yönlendiriliyorsunuz...",
          severity: "success",
        });
      }

      handleClear();

      // 2 saniye sonra yönlendir
      setTimeout(() => {
        navigate('/portal/ders-ve-donem-islemleri'); // Ders programı sayfasına git
      }, 2000);

    } catch (error) {
      console.error('❌ Error saving course:', error);
      setSnackbar({
        open: true,
        message: "Ders kaydedilirken hata oluştu: " + error.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
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
              <Button 
                variant="contained" 
                onClick={onBack} 
                size="medium"
                sx={{
                  bgcolor: "#1a237e",
                  color: "white",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(26, 35, 126, 0.3)",
                  "&:hover": {
                    bgcolor: "#0d1b5e",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(26, 35, 126, 0.4)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                ← Geri Dön
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
                disabled={loading}
              >
                {loading ? "Kaydediliyor..." : (editingCourse ? "Güncelle" : "Kaydet")}
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
              Kayıtlı Dersler ({(savedCourses.length + lecturerCourses.length)})
            </Typography>

            {(savedCourses.length === 0 && lecturerCourses.length === 0) ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 2, fontSize: '0.875rem' }}
              >
                {loading ? "Dersler yükleniyor..." : "Henüz kayıtlı ders bulunmamaktadır"}
              </Typography>
            ) : (
              <Box sx={{ maxHeight: 400, overflow: "auto" }}>
                {/* Hocanın mevcut dersleri */}
                {lecturerCourses.map((course) => (
                  <Card
                    key={`lecturer-${course.id}`}
                    sx={{ mb: 1, border: "1px solid #4caf50", borderRadius: 2, backgroundColor: "#f1f8e9" }}
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
                          sx={{ fontWeight: 600, color: "#2e7d32", fontSize: '0.875rem', lineHeight: 1.2 }}
                        >
                          {course.code} - {course.name}
                        </Typography>
                        <Chip
                          label="Mevcut Ders"
                          size="small"
                          sx={{
                            backgroundColor: "#4caf50",
                            color: "white",
                            fontSize: "0.7rem",
                            height: 20,
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: '0.75rem', lineHeight: 1.3 }}
                      >
                        Şube: {course.section_number}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
                
                {/* LocalStorage'dan kayıtlı dersler */}
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
