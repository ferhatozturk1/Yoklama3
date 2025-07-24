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
  Paper
} from "@mui/material";
import { Edit, Add as AddIcon, Delete as DeleteIcon, Schedule as ScheduleIcon } from "@mui/icons-material";

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
  
  // Static courses (existing ones)
  const staticCourses = [
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
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#1a237e" }}
        >
          📚 Derslerim
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<ScheduleIcon />}
          onClick={handleOpenScheduleModal}
        >
          Program Ekle
        </Button>
      </Box>
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
                    {ders.attendanceRate > 0 ? 'Genel Katılım Oranı' : 'Henüz yoklama alınmadı'}
                  </Typography>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      border: `4px solid ${ders.attendanceRate >= 80 ? '#4caf50' : ders.attendanceRate >= 60 ? '#ff9800' : '#f44336'}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      bgcolor: ders.attendanceRate > 0 ? "#f8f9fa" : "#f5f5f5",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ 
                        fontWeight: "bold", 
                        color: ders.attendanceRate >= 80 ? '#4caf50' : ders.attendanceRate >= 60 ? '#ff9800' : ders.attendanceRate > 0 ? '#f44336' : '#999'
                      }}
                    >
                      %{ders.attendanceRate}
                    </Typography>
                  </Box>
                </Box>

                {/* Ders Bilgileri - Detaylı Format */}
                <Box sx={{ textAlign: "left", mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Ders:</strong> {ders.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Günler:</strong> {getDaysText(ders.schedule)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Derslik:</strong> {ders.building} - {ders.room}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Öğrenci Sayısı:</strong> {ders.studentCount}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Yoklama Oranı:</strong> %{ders.attendanceRate}
                  </Typography>
                  {ders.info && (
                    <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic', color: '#666' }}>
                      {ders.info}
                    </Typography>
                  )}
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
                          onChange={(e) => setCurrentScheduleEntry({...currentScheduleEntry, day: e.target.value})}
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
                          onChange={(e) => setCurrentScheduleEntry({...currentScheduleEntry, startTime: e.target.value})}
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
                          onChange={(e) => setCurrentScheduleEntry({...currentScheduleEntry, endTime: e.target.value})}
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
                        onChange={(e) => setCurrentScheduleEntry({...currentScheduleEntry, room: e.target.value})}
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
                          sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, mb: 1 }}
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

export default Derslerim;