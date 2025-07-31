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
  Divider,
} from "@mui/material";
import {
  Edit,
  Add as AddIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  LocationOn,
  Groups,
  CalendarToday,
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
    day: "",
    startTime: "",
    endTime: "",
    room: "",
  });

  // Days of the week
  const daysOfWeek = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

  // Time options
  const timeOptions = [
    "08:40",
    "09:30",
    "09:50",
    "10:40",
    "11:00",
    "11:50",
    "13:40",
    "14:30",
    "14:40",
    "15:30",
    "15:40",
    "16:30",
    "16:40",
    "17:30",
  ];

  // Real courses from current university schedule (2025-2026)
  const staticCourses = [
    {
      id: 1,
      name: "Matematik",
      code: "MRK 1116",

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

      sectionFull: "IYS-Lab1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Derslik-7",
      schedule: {
        salı: [{ startTime: "16:15", endTime: "17:00", room: "Derslik-7" }],
        cuma: [
          { startTime: "13:40", endTime: "15:30", room: "Bilgisayar Lab-2" },
        ],
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
    },
  ];

  const [dersler, setDersler] = useState(staticCourses);

  // Load courses from localStorage and combine with static courses
  useEffect(() => {
    const loadCourses = () => {
      const activeCourses = JSON.parse(
        localStorage.getItem("activeCourses") || "[]"
      );

      // Convert active courses to the format expected by Derslerim
      const convertedCourses = activeCourses.map((course) => ({
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
          ...(course.days && course.days.length > 0
            ? {
                [course.days[0]?.toLowerCase()]: [
                  {
                    startTime: course.times?.split("-")[0] || "08:40",
                    endTime: course.times?.split("-")[1] || "09:30",
                    room: "A101",
                  },
                ],
              }
            : {}),
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

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("teacherCoursesUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("teacherCoursesUpdated", handleStorageChange);
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
    return Object.keys(schedule)
      .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
      .join(", ");
  };

  // Open schedule modal
  const handleOpenScheduleModal = () => {
    // Get registered courses from localStorage
    const teacherCourses = JSON.parse(
      localStorage.getItem("teacherCourses") || "[]"
    );
    if (teacherCourses.length === 0) {
      alert("Program eklemek için önce ders kayıt etmelisiniz.");
      return;
    }
    setScheduleModalOpen(true);
  };

  // Close schedule modal
  const handleCloseScheduleModal = () => {
    setScheduleModalOpen(false);
    setSelectedCourse(null);
    setScheduleEntries([]);
    setCurrentScheduleEntry({ day: "", startTime: "", endTime: "", room: "" });
  };

  // Handle course selection for scheduling
  const handleCourseSelect = (courseId) => {
    const teacherCourses = JSON.parse(
      localStorage.getItem("teacherCourses") || "[]"
    );
    const course = teacherCourses.find((c) => c.id === courseId);
    setSelectedCourse(course);
  };

  // Add schedule entry
  const handleAddScheduleEntry = () => {
    if (
      !currentScheduleEntry.day ||
      !currentScheduleEntry.startTime ||
      !currentScheduleEntry.endTime
    ) {
      alert("Lütfen gün, başlangıç ve bitiş saatini seçin.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      ...currentScheduleEntry,
    };

    setScheduleEntries([...scheduleEntries, newEntry]);
    setCurrentScheduleEntry({ day: "", startTime: "", endTime: "", room: "" });
  };

  // Remove schedule entry
  const handleRemoveScheduleEntry = (entryId) => {
    setScheduleEntries(scheduleEntries.filter((entry) => entry.id !== entryId));
  };

  // Save schedule
  const handleSaveSchedule = () => {
    if (!selectedCourse || scheduleEntries.length === 0) {
      alert("Lütfen ders seçin ve en az bir program girişi ekleyin.");
      return;
    }

    // Create course with schedule for active courses
    const courseWithSchedule = {
      id: Date.now(),
      courseName: selectedCourse.courseName,
      courseCode: selectedCourse.courseCode,
      section: "A1", // Default section
      term: selectedCourse.term,
      days: scheduleEntries.map((entry) => entry.day),
      times: scheduleEntries
        .map((entry) => `${entry.startTime}-${entry.endTime}`)
        .join(", "),
      scheduleEntries: scheduleEntries, // Store detailed schedule
      faculty: selectedCourse.faculty,
      classLevel: selectedCourse.classLevel || 1,
      addedAt: new Date().toISOString(),
    };

    // Save to active courses
    const existingActiveCourses = JSON.parse(
      localStorage.getItem("activeCourses") || "[]"
    );
    const updatedActiveCourses = [...existingActiveCourses, courseWithSchedule];
    localStorage.setItem("activeCourses", JSON.stringify(updatedActiveCourses));

    // Trigger custom event for other components to update
    window.dispatchEvent(new Event("teacherCoursesUpdated"));

    alert("Program başarıyla eklendi!");
    handleCloseScheduleModal();
  };

  // Detay görünümü için DersDetay bileşenini kullan
  if (currentView === "detail" && selectedDers) {
    return <DersDetay ders={selectedDers} onBack={handleBackToList} />;
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        py: { xs: 1, sm: 1.5, md: 2, lg: 2.5, xl: 3 },
        px: { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 },
        maxWidth: {
          xs: "100%",
          sm: "100%",
          md: "1200px",
          lg: "1400px",
          xl: "1800px",
        },
        mx: "auto",
      }}
    >
      {/* Compact Header */}
      <Box
        sx={{
          height: {
            xs: "32px",
            sm: "36px",
            md: "40px",
            lg: "42px",
            xl: "44px",
          },
          borderRadius: "999px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: { xs: 0.8, sm: 1, md: 1.2, lg: 1.4, xl: 1.6 },
          px: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 3.5 },
          bgcolor: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#1a237e",
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            fontSize: {
              xs: "0.875rem",
              sm: "0.95rem",
              md: "1rem",
              lg: "1.05rem",
              xl: "1.1rem",
            },
          }}
        >
          📚 Derslerim
        </Typography>
      </Box>

      {/* Responsive Course Grid */}
      <Grid container spacing={{ xs: 1, sm: 1.5, md: 2, lg: 2.5, xl: 3 }}>
        {dersler.map((ders) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={ders.id}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                borderRadius: 2,
                background: "white",
                border: "1px solid #e0e0e0",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background:
                    ders.attendanceRate >= 80
                      ? "#4caf50"
                      : ders.attendanceRate >= 60
                      ? "#ff9800"
                      : "#f44336",
                },
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  border: "1px solid #1976d2",
                },
              }}
              onClick={() => handleDersClick(ders)}
            >
              <CardContent
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Main Content */}
                <Box sx={{ flex: 1 }}>
                  {/* Header with Course Code and Attendance */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#1a237e",
                          fontSize: "1.1rem",
                          mb: 0.3,
                        }}
                      >
                        {ders.code}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                        }}
                      >
                        {ders.sectionFull || ders.section}
                      </Typography>
                    </Box>

                    {/* Attendance Rate Badge */}
                    <Box
                      sx={{
                        minWidth: 50,
                        height: 50,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor:
                          ders.attendanceRate >= 80
                            ? "#e8f5e8"
                            : ders.attendanceRate >= 60
                            ? "#fff3e0"
                            : "#ffebee",
                        border: `2px solid ${
                          ders.attendanceRate >= 80
                            ? "#4caf50"
                            : ders.attendanceRate >= 60
                            ? "#ff9800"
                            : "#f44336"
                        }`,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color:
                            ders.attendanceRate >= 80
                              ? "#4caf50"
                              : ders.attendanceRate >= 60
                              ? "#ff9800"
                              : "#f44336",
                          fontSize: "0.875rem",
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
                      fontSize: "1rem",
                      mb:
                        ders.name.length > 20
                          ? 0.3
                          : ders.name.length > 15
                          ? 0.2
                          : 0.1,
                      lineHeight: 1.3,
                      minHeight:
                        ders.name.length > 20
                          ? "2.6em"
                          : ders.name.length > 15
                          ? "2.2em"
                          : "1.8em",
                      display: "-webkit-box",
                      WebkitLineClamp: ders.name.length > 20 ? 2 : 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {ders.name}
                  </Typography>

                  {/* Course Details */}
                  <Box
                    sx={{
                      mb:
                        ders.name.length > 20
                          ? 0.8
                          : ders.name.length > 15
                          ? 0.6
                          : 0.4,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 0.8,
                        mb: 0.3,
                      }}
                    >
                      <LocationOn
                        sx={{ fontSize: 16, color: "#666", mt: 0.1 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.875rem", lineHeight: 1.2 }}
                      >
                        {ders.building} - {ders.room}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 0.8,
                        mb: 0.3,
                      }}
                    >
                      <Groups sx={{ fontSize: 16, color: "#666", mt: 0.1 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.875rem", lineHeight: 1.2 }}
                      >
                        {ders.studentCount} öğrenci
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 0.8,
                      }}
                    >
                      <CalendarToday
                        sx={{ fontSize: 16, color: "#666", mt: 0.1 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: "0.875rem", lineHeight: 1.2 }}
                      >
                        {getDaysText(ders.schedule)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Action Button - Always at bottom */}
                <Box sx={{ mt: "auto" }}>
                  <Button
                    variant="contained"
                    startIcon={<Edit sx={{ fontSize: 18 }} />}
                    fullWidth
                    sx={{
                      bgcolor: "#1a237e",
                      color: "white",
                      py: 1,
                      borderRadius: 1.5,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      textTransform: "none",
                      boxShadow: "0 2px 8px rgba(26, 35, 126, 0.3)",
                      "&:hover": {
                        bgcolor: "#0d47a1",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(26, 35, 126, 0.4)",
                      },
                    }}
                  >
                    Derse Git
                  </Button>
                </Box>
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
                value={selectedCourse?.id || ""}
                label="Ders Seçin"
                onChange={(e) => handleCourseSelect(e.target.value)}
              >
                {JSON.parse(localStorage.getItem("teacherCourses") || "[]").map(
                  (course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.courseName} ({course.courseCode})
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            {selectedCourse && (
              <>
                <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                  Program Girişleri Ekle
                </Typography>

                {/* Add Schedule Entry Form */}
                <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth>
                        <InputLabel>Gün</InputLabel>
                        <Select
                          value={currentScheduleEntry.day}
                          label="Gün"
                          onChange={(e) =>
                            setCurrentScheduleEntry({
                              ...currentScheduleEntry,
                              day: e.target.value,
                            })
                          }
                        >
                          {daysOfWeek.map((day) => (
                            <MenuItem key={day} value={day}>
                              {day}
                            </MenuItem>
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
                          onChange={(e) =>
                            setCurrentScheduleEntry({
                              ...currentScheduleEntry,
                              startTime: e.target.value,
                            })
                          }
                        >
                          {timeOptions.map((time) => (
                            <MenuItem key={time} value={time}>
                              {time}
                            </MenuItem>
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
                          onChange={(e) =>
                            setCurrentScheduleEntry({
                              ...currentScheduleEntry,
                              endTime: e.target.value,
                            })
                          }
                        >
                          {timeOptions.map((time) => (
                            <MenuItem key={time} value={time}>
                              {time}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Derslik (Opsiyonel)"
                        value={currentScheduleEntry.room}
                        onChange={(e) =>
                          setCurrentScheduleEntry({
                            ...currentScheduleEntry,
                            room: e.target.value,
                          })
                        }
                      />
                    </Grid>
                  </Grid>
                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                  >
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
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Eklenen Program Girişleri:
                    </Typography>
                    <List>
                      {scheduleEntries.map((entry) => (
                        <ListItem
                          key={entry.id}
                          sx={{
                            border: 1,
                            borderColor: "grey.300",
                            borderRadius: 3,
                            mb: 1,
                          }}
                          secondaryAction={
                            <IconButton
                              onClick={() =>
                                handleRemoveScheduleEntry(entry.id)
                              }
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={`${entry.day} - ${entry.startTime} ile ${entry.endTime} arası`}
                            secondary={
                              entry.room
                                ? `Derslik: ${entry.room}`
                                : "Derslik belirtilmedi"
                            }
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
