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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Update as UpdateIcon
} from '@mui/icons-material';

const DersGuncelle = ({ onBack, onEditCourse, selectedSemester = '2025-2026-guz' }) => {
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [activeCourses, setActiveCourses] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(selectedSemester);

  const termOptions = [
    '2023-2024 Güz',
    '2023-2024 Bahar',
    '2024-2025 Güz',
    '2024-2025 Bahar',
    '2025-2026 Güz',
    '2025-2026 Bahar'
  ];

  // Load courses
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

  // Filter courses by selected term
  const filteredTeacherCourses = teacherCourses.filter(course => course.term === selectedTerm);
  const filteredActiveCourses = activeCourses.filter(course => course.term === selectedTerm);

  const handleEditTeacherCourse = (course) => {
    // Navigate back to course registration with the course data for editing
    onEditCourse && onEditCourse(course);
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={onBack}
            sx={{ color: 'white', mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                lineHeight: 1.3,
                mb: 0.5
              }}
            >
              Ders Güncelle
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontSize: "0.875rem",
                lineHeight: 1.5,
              }}
            >
              Kayıtlı ders bilgilerini güncelleyin
            </Typography>
          </Box>
          
          {/* Term Selector */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel sx={{ color: 'white' }}>Dönem</InputLabel>
            <Select
              value={selectedTerm}
              label="Dönem"
              onChange={(e) => setSelectedTerm(e.target.value)}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.7)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '& .MuiSelect-icon': {
                  color: 'white',
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
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Teacher's Registered Courses */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
              Kayıtlı Dersler ({filteredTeacherCourses.length})
            </Typography>

            {filteredTeacherCourses.length === 0 ? (
              <Alert severity="info">
                {selectedTerm} dönemi için kayıtlı ders bulunmamaktadır.
              </Alert>
            ) : (
              <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                {filteredTeacherCourses.map((course) => (
                  <Card key={course.id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                            {course.courseName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {course.courseCode} • {course.branch}
                          </Typography>
                        </Box>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditTeacherCourse(course)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                        <Chip label={course.courseLanguage} size="small" variant="outlined" />
                        <Chip 
                          label={course.mandatoryElective === 'Z' ? 'Zorunlu' : 'Seçmeli'} 
                          size="small" 
                          color={course.mandatoryElective === 'Z' ? 'primary' : 'secondary'}
                        />
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

        {/* Active Courses */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'secondary.main', fontWeight: 600 }}>
              Aktif Dersler ({filteredActiveCourses.length})
            </Typography>

            {filteredActiveCourses.length === 0 ? (
              <Alert severity="info">
                {selectedTerm} dönemi için aktif ders bulunmamaktadır.
              </Alert>
            ) : (
              <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                {filteredActiveCourses.map((course) => (
                  <Card key={course.id} sx={{ mb: 2, border: '1px solid #e0e0e0', bgcolor: '#f8f9fa' }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'secondary.main', mb: 0.5 }}>
                            {course.courseName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {course.courseCode} • Şube: {course.section}
                          </Typography>
                        </Box>
                        <Chip label="Aktif" size="small" color="success" />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                        <Chip label={course.branch} size="small" variant="outlined" />
                        <Chip label={`${course.classLevel}. Sınıf`} size="small" />
                      </Box>

                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Program: {course.days?.join(', ')} • {course.times}
                      </Typography>

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

      {/* Info Box */}
      <Paper elevation={1} sx={{ p: 3, mt: 4, bgcolor: '#f5f5f5', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <UpdateIcon color="info" />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Güncelleme Bilgisi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Kayıtlı dersleri güncellemek için düzenle butonuna tıklayın<br/>
              • Aktif dersler otomatik olarak kayıtlı ders bilgilerini kullanır<br/>
              • Ders bilgilerini güncelledikten sonra aktif derslerde de değişiklikler görünür
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default DersGuncelle;
