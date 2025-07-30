import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  TextField,
  Autocomplete,
  FormLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Divider
} from "@mui/material";
import { 
  Edit, 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Schedule as ScheduleIcon,
  LocationOn,
  Groups,
  CalendarToday
} from "@mui/icons-material";

import DersDetay from "./DersDetay";

const Derslerim = () => {
  // View state - 'list' veya 'detail'
  const [currentView, setCurrentView] = useState("list");
  const [selectedDers, setSelectedDers] = useState(null);

  // Schedule management state
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [scheduleEntries, setScheduleEntries] = useState([]);
  const [currentScheduleEntry, setCurrentScheduleEntry] = useState({
    day: '',
    startTime: '',
    endTime: '',
    room: ''
  });

  // Days of the week
  const daysOfWeek = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

  // Time options
  const timeOptions = [
    "08:40", "09:30", "09:50", "10:40", "11:00", "11:50",
    "13:40", "14:30", "14:40", "15:30", "15:40", "16:30", "16:40", "17:30"
  ];

  // Real courses from current university schedule (2025-2026)
  const staticCourses = [
    {
      id: 1,
      name: "Matematik",
      code: "MRK 1116",
      section: "A1",
      sectionFull: "MRK-A1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Amfi-6",
      schedule: {
        çarşamba: [{ startTime: "08:40", endTime: "11:30", room: "Amfi-6" }],
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 45,
      attendanceStatus: "completed",
      lastAttendance: "2025-07-30",
      attendanceRate: 88,
      files: [],
    },
    {
      id: 2,
      name: "Matematik",
      code: "IYS 1101",
      section: "B1",
      sectionFull: "IYS-B1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Amfi-...",
      schedule: {
        salı: [{ startTime: "08:40", endTime: "10:30", room: "Amfi" }],
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 38,
      attendanceStatus: "completed",
      lastAttendance: "2025-07-29",
      attendanceRate: 92,
      files: [],
    },
    {
      id: 3,
      name: "Mesleki Matematik",
      code: "EKT 1117",
      section: "C1",
      sectionFull: "EKT-C1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Amfi-6",
      schedule: {
        çarşamba: [{ startTime: "11:45", endTime: "12:30", room: "Amfi-6" }],
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 32,
      attendanceStatus: "completed",
      lastAttendance: "2025-07-30",
      attendanceRate: 84,
      files: [],
    },
    {
      id: 4,
      name: "Programlama",
      code: "IYS 1103",
      section: "Lab1",
      sectionFull: "IYS-Lab1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Derslik-7",
      schedule: {
        salı: [{ startTime: "16:15", endTime: "17:00", room: "Derslik-7" }],
        cuma: [{ startTime: "13:40", endTime: "15:30", room: "Bilgisayar Lab-2" }],
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 28,
      attendanceStatus: "completed",
      lastAttendance: "2025-07-26",
      attendanceRate: 94,
      files: [],
    },
    {
      id: 5,
      name: "Akademik Yapay Zekaya Giriş",
      code: "SSD 3264",
      section: "A1",
      sectionFull: "SSD-A1",
      building: "Mühendislik ve Doğa Bilimleri Fakültesi",
      room: "Derslik",
      schedule: {
        perşembe: [{ startTime: "16:15", endTime: "17:00", room: "Derslik" }],
        cuma: [{ startTime: "16:15", endTime: "17:00", room: "Derslik" }],
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 22,
      attendanceStatus: "completed",
      lastAttendance: "2025-07-26",
      attendanceRate: 91,
      files: [],
    },
    {
      id: 6,
      name: "Bilişim ve Bilgisayar Ağları Temelleri",
      code: "IYS 1107",
      section: "B1",
      sectionFull: "IYS-B1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Derslik-8",
      schedule: {
        salı: [{ startTime: "11:45", endTime: "12:30", room: "Derslik-8" }],
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 35,
      attendanceStatus: "pending",
      lastAttendance: "2025-07-29",
      attendanceRate: 85,
      files: [],
    },
    {
      id: 7,
      name: "Yapay Zeka ile Zenginleştirilmiş Proje Yönetimi",
      code: "USD 1165",
      section: "A1",
      sectionFull: "USD-A1",
      building: "Mühendislik ve Doğa Bilimleri Fakültesi",
      room: "Amfi-...",
      schedule: {
        perşembe: [{ startTime: "13:40", endTime: "15:30", room: "Amfi" }],
        perşembe: [{ startTime: "17:00", endTime: "17:45", room: "Amfi" }],
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 18,
      attendanceStatus: "completed",
      lastAttendance: "2025-07-25",
      attendanceRate: 89,
      files: [],
    },
    {
      id: 8,
      name: "Veri Toplama ve Analizi",
      code: "IYS 2103",
      section: "B1",
      sectionFull: "IYS-B1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Derslik-6",
      schedule: {
        cuma: [{ startTime: "08:40", endTime: "10:30", room: "Derslik-6" }],
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 26,
      attendanceStatus: "completed",
      lastAttendance: "2025-07-26",
      attendanceRate: 87,
      files: [],
    }
  ];

  const [dersler, setDersler] = useState(staticCourses);

  // Load courses from localStorage and combine with static courses
  useEffect(() => {
    const loadCourses = () => {
      const activeCourses = JSON.parse(localStorage.getItem('activeCourses') || '[]');

      // Convert active courses to the format expected by Derslerim
      const convertedCourses = activeCourses.map(course => ({
        id: course.id || Date.now() + Math.random(),
        name: course.courseName || course.courseTitle,
        code: course.courseCode,
        section: course.section,
        sectionFull: `YP-${course.section}`,
        building: "A Blok", // Default building
        room: "A101", // Default room
        class: `${course.classLevel || 1}-A`,
        instructor: course.faculty || "Dr. Ayşe Kaya",
        schedule: {
          // Convert days array to schedule object
          ...(course.days && course.days.length > 0 ? {
            [course.days[0]?.toLowerCase()]: [{
              startTime: course.times?.split('-')[0] || "08:40",
              endTime: course.times?.split('-')[1] || "09:30",
              room: "A101"
            }]
          } : {})
        },
        totalWeeks: 15,
        currentWeek: 8,
        studentCount: Math.floor(Math.random() * 30) + 20, // Random student count
        attendanceStatus: "not_taken",
        lastAttendance: null,
        attendanceRate: 0,
        files: [],
      }));

      // Combine static courses with converted active courses
      const allCourses = [...staticCourses, ...convertedCourses];
      setDersler(allCourses);
    };

    loadCourses();

    // Listen for localStorage changes
    const handleStorageChange = () => {
      loadCourses();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('teacherCoursesUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('teacherCoursesUpdated', handleStorageChange);
    };
  }, []);

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

  // Open schedule modal
  const handleOpenScheduleModal = () => {
    // Get registered courses from localStorage
    const teacherCourses = JSON.parse(localStorage.getItem('teacherCourses') || '[]');
    if (teacherCourses.length === 0) {
      alert('Program eklemek için önce ders kayıt etmelisiniz.');
      return;
    }
    setScheduleModalOpen(true);
  };

  // Close schedule modal
  const handleCloseScheduleModal = () => {
    setScheduleModalOpen(false);
    setSelectedCourse(null);
    setScheduleEntries([]);
    setCurrentScheduleEntry({ day: '', startTime: '', endTime: '', room: '' });
  };

  // Handle course selection for scheduling
  const handleCourseSelect = (courseId) => {
    const teacherCourses = JSON.parse(localStorage.getItem('teacherCourses') || '[]');
    const course = teacherCourses.find(c => c.id === courseId);
    setSelectedCourse(course);
  };

  // Add schedule entry
  const handleAddScheduleEntry = () => {
    if (!currentScheduleEntry.day || !currentScheduleEntry.startTime || !currentScheduleEntry.endTime) {
      alert('Lütfen gün, başlangıç ve bitiş saatini seçin.');
      return;
    }

    const newEntry = {
      id: Date.now(),
      ...currentScheduleEntry
    };

    setScheduleEntries([...scheduleEntries, newEntry]);
    setCurrentScheduleEntry({ day: '', startTime: '', endTime: '', room: '' });
  };

  // Remove schedule entry
  const handleRemoveScheduleEntry = (entryId) => {
    setScheduleEntries(scheduleEntries.filter(entry => entry.id !== entryId));
  };

  // Save schedule
  const handleSaveSchedule = () => {
    if (!selectedCourse || scheduleEntries.length === 0) {
      alert('Lütfen ders seçin ve en az bir program girişi ekleyin.');
      return;
    }

    // Create course with schedule for active courses
    const courseWithSchedule = {
      id: Date.now(),
      courseName: selectedCourse.courseName,
      courseCode: selectedCourse.courseCode,
      section: 'A1', // Default section
      term: selectedCourse.term,
      days: scheduleEntries.map(entry => entry.day),
      times: scheduleEntries.map(entry => `${entry.startTime}-${entry.endTime}`).join(', '),
      scheduleEntries: scheduleEntries, // Store detailed schedule
      faculty: selectedCourse.faculty,
      classLevel: selectedCourse.classLevel || 1,
      addedAt: new Date().toISOString()
    };

    // Save to active courses
    const existingActiveCourses = JSON.parse(localStorage.getItem('activeCourses') || '[]');
    const updatedActiveCourses = [...existingActiveCourses, courseWithSchedule];
    localStorage.setItem('activeCourses', JSON.stringify(updatedActiveCourses));

    // Trigger custom event for other components to update
    window.dispatchEvent(new Event('teacherCoursesUpdated'));

    alert('Program başarıyla eklendi!');
    handleCloseScheduleModal();
  };



  // Detay görünümü için DersDetay bileşenini kullan
  if (currentView === "detail" && selectedDers) {
    return <DersDetay ders={selectedDers} onBack={handleBackToList} />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 1.5 }}>
      {/* Compact Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2,
        p: 1.5,
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: "#1a237e", display: 'flex', alignItems: 'center', gap: 1 }}
        >
          📚 Derslerim
        </Typography>
        <Button
          variant="contained"
          startIcon={<ScheduleIcon />}
          onClick={handleOpenScheduleModal}
          size="small"
          sx={{ 
            textTransform: 'none',
            fontWeight: 500,
            px: 2
          }}
        >
          Program Ekle
        </Button>
      </Box>
      {/* Compact Course Grid */}
      <Grid container spacing={1.5}>
        {dersler.map((ders) => (
          <Grid item xs={12} sm={6} md={4} key={ders.id}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                borderRadius: 3,
                background: "white",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: `linear-gradient(90deg, ${
                    ders.attendanceRate >= 80 ? '#4caf50' : 
                    ders.attendanceRate >= 60 ? '#ff9800' : '#f44336'
                  } 0%, ${
                    ders.attendanceRate >= 80 ? '#66bb6a' : 
                    ders.attendanceRate >= 60 ? '#ffb74d' : '#ef5350'
                  } 100%)`,
                },
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  border: "1px solid rgba(25, 118, 210, 0.2)",
                }
              }}
              onClick={() => handleDersClick(ders)}
            >
              <CardContent sx={{ p: 1.2 }}>
                {/* Course Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.2 }}>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#1a237e",
                        mb: 0.5,
                        fontSize: '1.1rem'
                      }}
                    >
                      {ders.code}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(26, 35, 126, 0.7)",
                        fontWeight: 500
                      }}
                    >
                      {ders.section}
                    </Typography>
                  </Box>
                  
                  {/* Attendance Rate Circle - Compact */}
                  <Box
                    sx={{
                      width: 45,
                      height: 45,
                      borderRadius: "50%",
                      border: `2px solid ${
                        ders.attendanceRate >= 80 ? '#4caf50' : 
                        ders.attendanceRate >= 60 ? '#ff9800' : '#f44336'
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `radial-gradient(circle, ${
                        ders.attendanceRate >= 80 ? 'rgba(76, 175, 80, 0.1)' : 
                        ders.attendanceRate >= 60 ? 'rgba(255, 152, 0, 0.1)' : 'rgba(244, 67, 54, 0.1)'
                      } 0%, rgba(255, 255, 255, 0.9) 100%)`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: ders.attendanceRate >= 80 ? '#4caf50' : 
                               ders.attendanceRate >= 60 ? '#ff9800' : '#f44336',
                        fontSize: '0.875rem'
                      }}
                    >
                      %{ders.attendanceRate}
                    </Typography>
                  </Box>
                </Box>

                {/* Course Name */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#1a237e",
                    mb: 1.2,
                    fontSize: '0.95rem'
                  }}
                >
                  {ders.name}
                </Typography>

                {/* Course Info - Horizontal Layout */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, mb: 1.2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ fontSize: 16, color: '#666' }} />
                    <Typography variant="caption" color="text.secondary">
                      {ders.building} - {ders.room}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Groups sx={{ fontSize: 16, color: '#666' }} />
                    <Typography variant="caption" color="text.secondary">
                      {ders.studentCount} öğrenci
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday sx={{ fontSize: 16, color: '#666' }} />
                    <Typography variant="caption" color="text.secondary">
                      {getDaysText(ders.schedule)}
                    </Typography>
                  </Box>

                </Box>

                <Divider sx={{ my: 0.8 }} />

                {/* Action Button */}
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  fullWidth
                  size="small"
                  sx={{
                    background: "linear-gradient(135deg, #1a237e 0%, #3949ab 100%)",
                    borderRadius: 2,
                    py: 1,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: "none",
                    boxShadow: "0 2px 8px rgba(26, 35, 126, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #0d47a1 0%, #283593 100%)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(26, 35, 126, 0.4)",
                    }
                  }}
                >
                  Derse Git
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Schedule Management Modal */}
      <Dialog
        open={scheduleModalOpen}
        onClose={handleCloseScheduleModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Ders Programı Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Course Selection */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Ders Seçin</InputLabel>
              <Select
                value={selectedCourse?.id || ''}
                label="Ders Seçin"
                onChange={(e) => handleCourseSelect(e.target.value)}
              >
                {JSON.parse(localStorage.getItem('teacherCourses') || '[]').map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.courseName} ({course.courseCode})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedCourse && (
              <>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Program Girişleri Ekle
                </Typography>

                {/* Add Schedule Entry Form */}
                <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth>
                        <InputLabel>Gün</InputLabel>
                        <Select
                          value={currentScheduleEntry.day}
                          label="Gün"
                          onChange={(e) => setCurrentScheduleEntry({ ...currentScheduleEntry, day: e.target.value })}
                        >
                          {daysOfWeek.map((day) => (
                            <MenuItem key={day} value={day}>{day}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth>
                        <InputLabel>Başlangıç</InputLabel>
                        <Select
                          value={currentScheduleEntry.startTime}
                          label="Başlangıç"
                          onChange={(e) => setCurrentScheduleEntry({ ...currentScheduleEntry, startTime: e.target.value })}
                        >
                          {timeOptions.map((time) => (
                            <MenuItem key={time} value={time}>{time}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth>
                        <InputLabel>Bitiş</InputLabel>
                        <Select
                          value={currentScheduleEntry.endTime}
                          label="Bitiş"
                          onChange={(e) => setCurrentScheduleEntry({ ...currentScheduleEntry, endTime: e.target.value })}
                        >
                          {timeOptions.map((time) => (
                            <MenuItem key={time} value={time}>{time}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Derslik (Opsiyonel)"
                        value={currentScheduleEntry.room}
                        onChange={(e) => setCurrentScheduleEntry({ ...currentScheduleEntry, room: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddScheduleEntry}
                    >
                      Giriş Ekle
                    </Button>
                  </Box>
                </Paper>

                {/* Schedule Entries List */}
                {scheduleEntries.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ mb: 1 }}>Eklenen Program Girişleri:</Typography>
                    <List>
                      {scheduleEntries.map((entry) => (
                        <ListItem
                          key={entry.id}
                          sx={{ border: 1, borderColor: 'grey.300', borderRadius: 3, mb: 1 }}
                          secondaryAction={
                            <IconButton onClick={() => handleRemoveScheduleEntry(entry.id)} color="error">
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={`${entry.day} - ${entry.startTime} ile ${entry.endTime} arası`}
                            secondary={entry.room ? `Derslik: ${entry.room}` : 'Derslik belirtilmedi'}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseScheduleModal}>İptal</Button>
          <Button
            onClick={handleSaveSchedule}
            variant="contained"
            disabled={!selectedCourse || scheduleEntries.length === 0}
          >
            Programı Kaydet
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default Derslerim;
