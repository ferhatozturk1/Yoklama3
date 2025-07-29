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
    <Container maxWidth="lg" sx={{ 
      mt: { xs: 1, sm: 1.5, md: 2 }, 
      pb: { xs: 2, sm: 3, md: 4 },
      px: { xs: 1, sm: 2, md: 3 }
    }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 2, sm: 3, md: 4 },
          background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
          borderRadius: { xs: "16px", sm: "24px", md: "32px" },
          color: "white",
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Mobile Layout */}
        <Box sx={{ 
          display: { xs: 'block', md: 'none' },
          position: 'relative',
          zIndex: 1
        }}>
          {/* Top Row - Back button and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton onClick={onBack} sx={{ color: "white", p: 1 }}>
              <ArrowBackIcon sx={{ fontSize: 24 }} />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  mb: 0.5
                }}
              >
                Ders Güncelle
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.85,
                  fontSize: "0.75rem",
                  lineHeight: 1.4,
                  fontWeight: 400,
                }}
              >
                Kayıtlı ders bilgilerini güncelleyin
              </Typography>
            </Box>
          </Box>
          
          {/* Bottom Row - Term Selector */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormControl size="small" sx={{ minWidth: '100%', maxWidth: 280 }}>
              <InputLabel sx={{ color: 'white', fontSize: '0.875rem' }}>Dönem</InputLabel>
              <Select
                value={selectedTerm}
                label="Dönem"
                onChange={(e) => setSelectedTerm(e.target.value)}
                sx={{
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    borderRadius: '12px'
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
                  <MenuItem key={term} value={term} sx={{ fontSize: '0.875rem' }}>
                    {term}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Desktop Layout */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={onBack} sx={{ color: "white", p: 1.5 }}>
              <ArrowBackIcon sx={{ fontSize: 28 }} />
            </IconButton>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { sm: "1.75rem", md: "2rem" },
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  mb: 0.5
                }}
              >
                Ders Güncelle
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.85,
                  fontSize: "1rem",
                  lineHeight: 1.4,
                  fontWeight: 400,
                }}
              >
                Kayıtlı ders bilgilerini güncelleyin
              </Typography>
            </Box>
          </Box>
          
          {/* Term Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel sx={{ color: 'white' }}>Dönem</InputLabel>
              <Select
                value={selectedTerm}
                label="Dönem"
                onChange={(e) => setSelectedTerm(e.target.value)}
                sx={{
                  color: 'white',
                  borderRadius: '16px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    borderRadius: '16px'
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
        </Box>
      </Paper>

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {/* Teacher's Registered Courses */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: { xs: 3, sm: 4, md: 6 } }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: { xs: 2, sm: 2.5, md: 3 }, 
                color: 'primary.main', 
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
              }}
            >
              Kayıtlı Dersler ({filteredTeacherCourses.length})
            </Typography>

            {filteredTeacherCourses.length === 0 ? (
              <Alert severity="info">
                {selectedTerm} dönemi için kayıtlı ders bulunmamaktadır.
              </Alert>
            ) : (
              <Box sx={{ maxHeight: { xs: 400, sm: 500, md: 600 }, overflow: 'auto' }}>
                {filteredTeacherCourses.map((course) => (
                  <Card key={course.id} sx={{ 
                    mb: { xs: 1.5, sm: 2 }, 
                    border: '1px solid #e0e0e0',
                    borderRadius: { xs: 2, sm: 3 }
                  }}>
                    <CardContent sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      '&:last-child': { pb: { xs: 1.5, sm: 2 } } 
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start', 
                        mb: { xs: 1.5, sm: 2 },
                        gap: 1
                      }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 600, 
                              color: 'primary.main', 
                              mb: 0.5,
                              fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                              lineHeight: 1.3,
                              wordBreak: 'break-word'
                            }}
                          >
                            {course.courseName}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                              display: 'block',
                              lineHeight: 1.2
                            }}
                          >
                            {course.courseCode} • {course.branch}
                          </Typography>
                        </Box>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditTeacherCourse(course)}
                          color="primary"
                          sx={{ 
                            flexShrink: 0,
                            p: { xs: 0.5, sm: 1 }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        gap: { xs: 0.5, sm: 0.75 }, 
                        flexWrap: 'wrap', 
                        mb: { xs: 1.5, sm: 2 }
                      }}>
                        <Chip 
                          label={course.courseLanguage} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                            height: { xs: 24, sm: 28 }
                          }}
                        />
                        <Chip 
                          label={course.mandatoryElective === 'Z' ? 'Zorunlu' : 'Seçmeli'} 
                          size="small" 
                          color={course.mandatoryElective === 'Z' ? 'primary' : 'secondary'}
                          sx={{ 
                            fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                            height: { xs: 24, sm: 28 }
                          }}
                        />
                      </Box>

                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                          lineHeight: 1.2,
                          display: 'block'
                        }}
                      >
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
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: { xs: 3, sm: 4, md: 6 } }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: { xs: 2, sm: 2.5, md: 3 }, 
                color: 'secondary.main', 
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
              }}
            >
              Aktif Dersler ({filteredActiveCourses.length})
            </Typography>

            {filteredActiveCourses.length === 0 ? (
              <Alert severity="info">
                {selectedTerm} dönemi için aktif ders bulunmamaktadır.
              </Alert>
            ) : (
              <Box sx={{ maxHeight: { xs: 400, sm: 500, md: 600 }, overflow: 'auto' }}>
                {filteredActiveCourses.map((course) => (
                  <Card key={course.id} sx={{ 
                    mb: { xs: 1.5, sm: 2 }, 
                    border: '1px solid #e0e0e0', 
                    bgcolor: '#f8f9fa',
                    borderRadius: { xs: 2, sm: 3 }
                  }}>
                    <CardContent sx={{ 
                      p: { xs: 1.5, sm: 2 }, 
                      '&:last-child': { pb: { xs: 1.5, sm: 2 } } 
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start', 
                        mb: { xs: 1.5, sm: 2 },
                        gap: 1
                      }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 600, 
                              color: 'secondary.main', 
                              mb: 0.5,
                              fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                              lineHeight: 1.3,
                              wordBreak: 'break-word'
                            }}
                          >
                            {course.courseName}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                              display: 'block',
                              lineHeight: 1.2
                            }}
                          >
                            {course.courseCode} • Şube: {course.section}
                          </Typography>
                        </Box>
                        <Chip 
                          label="Aktif" 
                          size="small" 
                          color="success"
                          sx={{ 
                            fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                            height: { xs: 24, sm: 28 },
                            flexShrink: 0
                          }}
                        />
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        gap: { xs: 0.5, sm: 0.75 }, 
                        flexWrap: 'wrap', 
                        mb: { xs: 1.5, sm: 2 }
                      }}>
                        <Chip 
                          label={course.branch} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                            height: { xs: 24, sm: 28 }
                          }}
                        />
                        <Chip 
                          label={`${course.classLevel}. Sınıf`} 
                          size="small"
                          sx={{ 
                            fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                            height: { xs: 24, sm: 28 }
                          }}
                        />
                      </Box>

                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ 
                          display: 'block', 
                          mb: 1,
                          fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                          lineHeight: 1.2
                        }}
                      >
                        Program: {course.days?.join(', ')} • {course.times}
                      </Typography>

                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          fontSize: { xs: '0.6875rem', sm: '0.75rem' },
                          lineHeight: 1.2,
                          display: 'block'
                        }}
                      >
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
      <Paper elevation={1} sx={{ 
        p: { xs: 2, sm: 2.5, md: 3 }, 
        mt: { xs: 2, sm: 3, md: 4 }, 
        bgcolor: '#f5f5f5', 
        borderRadius: { xs: 3, sm: 4, md: 6 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          gap: { xs: 1.5, sm: 2 },
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <UpdateIcon 
            color="info" 
            sx={{ 
              fontSize: { xs: 20, sm: 24 },
              alignSelf: { xs: 'flex-start', sm: 'center' }
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 600, 
                mb: 0.5,
                fontSize: { xs: '0.875rem', sm: '0.9375rem' }
              }}
            >
              Güncelleme Bilgisi
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                lineHeight: 1.4
              }}
            >
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
