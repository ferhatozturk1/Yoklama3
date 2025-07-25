import React, { useState, useEffect } from 'react';
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
  IconButton,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowBack as ArrowBackIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const DersEkleBirak = ({ onBack, selectedSemester = '2025-2026-guz' }) => {
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [activeCourses, setActiveCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetails, setCourseDetails] = useState({
    section: '',
    classLevel: 1,
    days: [],
    times: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  // Load teacher's registered courses and active courses
  useEffect(() => {
    const savedTeacherCourses = localStorage.getItem('teacherCourses');
    const savedActiveCourses = localStorage.getItem('activeCourses');
    
    if (savedTeacherCourses) {
      setTeacherCourses(JSON.parse(savedTeacherCourses));
    }
    
    if (savedActiveCourses) {
      setActiveCourses(JSON.parse(savedActiveCourses));
    }
  }, []);

  // Save active courses to localStorage
  useEffect(() => {
    localStorage.setItem('activeCourses', JSON.stringify(activeCourses));
  }, [activeCourses]);

  // Filter courses by selected semester
  const availableCourses = teacherCourses.filter(course => course.term === selectedSemester);
  const currentActiveCourses = activeCourses.filter(course => course.term === selectedSemester);

  const handleCourseSelect = (event, value) => {
    setSelectedCourse(value);
    if (value) {
      setCourseDetails({
        section: '',
        classLevel: 1,
        days: [],
        times: ''
      });
    }
  };

  const handleAddCourse = () => {
    if (!selectedCourse) {
      setSnackbar({
        open: true,
        message: 'Lütfen bir ders seçin',
        severity: 'error'
      });
      return;
    }

    if (!courseDetails.section || courseDetails.days.length === 0 || !courseDetails.times) {
      setSnackbar({
        open: true,
        message: 'Lütfen tüm ders detaylarını doldurun',
        severity: 'error'
      });
      return;
    }

    // Check if course is already active
    const isAlreadyActive = activeCourses.some(course => 
      course.courseCode === selectedCourse.courseCode && 
      course.section === courseDetails.section &&
      course.term === selectedSemester
    );

    if (isAlreadyActive) {
      setSnackbar({
        open: true,
        message: 'Bu ders ve şube zaten aktif',
        severity: 'warning'
      });
      return;
    }

    const newActiveCourse = {
      ...selectedCourse,
      ...courseDetails,
      id: Date.now(),
      addedAt: new Date().toISOString()
    };

    setActiveCourses(prev => [...prev, newActiveCourse]);
    setSnackbar({
      open: true,
      message: 'Ders başarıyla eklendi',
      severity: 'success'
    });

    // Reset form
    setSelectedCourse(null);
    setCourseDetails({
      section: '',
      classLevel: 1,
      days: [],
      times: ''
    });
  };

  const handleRemoveCourse = (courseId) => {
    setActiveCourses(prev => prev.filter(course => course.id !== courseId));
    setSnackbar({
      open: true,
      message: 'Ders başarıyla kaldırıldı',
      severity: 'info'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, pb: 4 }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
          borderRadius: "32px",
          color: "white",
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconButton onClick={onBack} sx={{ color: "white", p: 0 }}>
                <ArrowBackIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  mb: 0.5
                }}
              >
                Ders Ekle/Bırak
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.85,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  lineHeight: 1.4,
                  fontWeight: 400,
                }}
              >
                {selectedSemester} dönemi için ders ekleme ve çıkarma işlemleri
              </Typography>
            </Box>
          </Box>
          
          {/* Sağ tarafta tarih/saat bilgisi */}
          <Box sx={{ 
            textAlign: 'right',
            display: { xs: 'none', sm: 'block' }
          }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1.1rem",
                mb: 0.5
              }}
            >
              {new Date().toLocaleTimeString('tr-TR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.8,
                fontSize: "0.875rem"
              }}
            >
              {new Date().toLocaleDateString('tr-TR', { 
                day: '2-digit',
                month: 'long',
                weekday: 'long'
              })}
            </Typography>
          </Box>
        </Box>
        

      </Paper>

      <Grid container spacing={4}>
        {/* Add Course Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 6 }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
              Ders Ekle
            </Typography>

            {availableCourses.length === 0 ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                {selectedSemester} dönemi için kayıtlı ders bulunmamaktadır. 
                Önce "Ders Kayıt" bölümünden ders tanımlamanız gerekmektedir.
              </Alert>
            ) : (
              <>
                <Autocomplete
                  options={availableCourses}
                  getOptionLabel={(option) => `${option.courseCode} - ${option.courseName}`}
                  value={selectedCourse}
                  onChange={handleCourseSelect}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ders Seçin"
                      fullWidth
                      margin="normal"
                    />
                  )}
                  sx={{ mb: 3 }}
                />

                {selectedCourse && (
                  <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 4 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Seçilen Ders Bilgileri:
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Branş: {selectedCourse.branch}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Dil: {selectedCourse.courseLanguage}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          T+P: {selectedCourse.theoryPractice}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Kredi: {selectedCourse.credits} • ECTS: {selectedCourse.ects}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {selectedCourse && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Şube"
                        value={courseDetails.section}
                        onChange={(e) => setCourseDetails(prev => ({ ...prev, section: e.target.value }))}
                        placeholder="örn: A1, B2"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Sınıf Seviyesi</InputLabel>
                        <Select
                          value={courseDetails.classLevel}
                          label="Sınıf Seviyesi"
                          onChange={(e) => setCourseDetails(prev => ({ ...prev, classLevel: e.target.value }))}
                        >
                          {[1, 2, 3, 4].map((level) => (
                            <MenuItem key={level} value={level}>
                              {level}. Sınıf
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        options={daysOfWeek}
                        value={courseDetails.days}
                        onChange={(event, newValue) => {
                          setCourseDetails(prev => ({ ...prev, days: newValue }));
                        }}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Günler"
                            placeholder="Ders günlerini seçin"
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Saatler"
                        value={courseDetails.times}
                        onChange={(e) => setCourseDetails(prev => ({ ...prev, times: e.target.value }))}
                        placeholder="örn: 08:40-09:30"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddCourse}
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Dersi Ekle
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </>
            )}
          </Paper>
        </Grid>

        {/* Active Courses Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 6 }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
              Aktif Dersler ({currentActiveCourses.length})
            </Typography>

            {currentActiveCourses.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                {selectedSemester} dönemi için aktif ders bulunmamaktadır
              </Typography>
            ) : (
              <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                {currentActiveCourses.map((course) => (
                  <Card key={course.id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                            {course.courseName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {course.courseCode} • Şube: {course.section}
                          </Typography>
                        </Box>
                        <IconButton 
                          size="small" 
                          onClick={() => handleRemoveCourse(course.id)} 
                          color="error"
                          sx={{ ml: 1 }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                        <Chip label={course.branch} size="small" variant="outlined" />
                        <Chip 
                          label={course.mandatoryElective === 'Z' ? 'Zorunlu' : 'Seçmeli'} 
                          size="small" 
                          color={course.mandatoryElective === 'Z' ? 'primary' : 'secondary'}
                        />
                        <Chip label={`${course.classLevel}. Sınıf`} size="small" />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <ScheduleIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {course.days.join(', ')} • {course.times}
                        </Typography>
                      </Box>

                      <Typography variant="caption" color="text.secondary">
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DersEkleBirak;