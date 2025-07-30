import React, { useState, useEffect } from "react";
import { courseList } from "../data/courseSchedule";
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
} from "@mui/material";
import {
  Edit,
  Add as AddIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";

import DersDetay from "./DersDetay";

const Derslerim = ({ selectedSemester = "2025-2026-guz" }) => {
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

  // Get real courses from course data
  const getRealCourses = (semester = "2025-2026-guz") => {
    const courses = courseList[semester] || courseList["2025-2026-guz"];
    return courses.map((course) => ({
      id: course.id,
      name: course.name,
      code: course.code,
      section: course.section,
      sectionFull: course.section,
      building: "Ana Bina",
      room: course.room || "Belirtilmemiş",
      class: course.section,
      instructor: course.instructor,
      schedule: course.schedule,
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: course.studentCount,
      attendanceStatus: "not_taken",
      lastAttendance: null,
      attendanceRate: 0,
      files: [],
      credits: course.credits,
    }));
  };

  const staticCourses = getRealCourses(selectedSemester);

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
    return Object.keys(schedule).join(", ");
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
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1a237e" }}>
          📚 Derslerim
        </Typography>
       
      </Box>
      <Grid container spacing={3}>
        {dersler.map((ders) => (
          <Grid item xs={12} sm={6} md={4} key={ders.id}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                borderRadius: "24px",
                background: "linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)",
                border: "1px solid rgba(26, 35, 126, 0.08)",
                boxShadow: "0 4px 20px rgba(26, 35, 126, 0.08)",
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
                    "linear-gradient(90deg, #1a237e 0%, #3949ab 50%, #5e35b1 100%)",
                  borderRadius: "24px 24px 0 0",
                },
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: "0 20px 40px rgba(26, 35, 126, 0.15)",
                  border: "1px solid rgba(26, 35, 126, 0.15)",
                  "& .card-content": {
                    background:
                      "linear-gradient(145deg, #ffffff 0%, #f0f4ff 100%)",
                  },
                },
                "&:active": {
                  transform: "translateY(-4px) scale(1.01)",
                  transition: "all 0.1s ease",
                },
              }}
              onClick={() => handleDersClick(ders)}
            >
              <CardContent
                className="card-content"
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  textAlign: "center",
                  background: "transparent",
                  transition: "all 0.4s ease",
                  borderRadius: "24px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {/* Ders Kodu */}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #1a237e 0%, #3949ab 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                    fontSize: { xs: "1.75rem", sm: "2rem" },
                    letterSpacing: "-0.02em",
                  }}
                >
                  {ders.code}
                </Typography>

                {/* Section */}
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(26, 35, 126, 0.7)",
                    mb: 0.5,
                    fontWeight: 600,
                    fontSize: { xs: "1rem", sm: "1.125rem" },
                  }}
                >
                  Section - {ders.section}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(26, 35, 126, 0.6)",
                    mb: 3,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    fontWeight: 500,
                  }}
                >
                  {ders.sectionFull}
                </Typography>

                {/* Katılım Oranı */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      color: "rgba(26, 35, 126, 0.7)",
                      fontWeight: 500,
                      fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                    }}
                  >
                    {ders.attendanceRate > 0
                      ? "Genel Katılım Oranı"
                      : "Henüz yoklama alınmadı"}
                  </Typography>
                  <Box
                    sx={{
                      width: { xs: 70, sm: 80 },
                      height: { xs: 70, sm: 80 },
                      borderRadius: "50%",
                      border: `3px solid ${
                        ders.attendanceRate >= 80
                          ? "#4caf50"
                          : ders.attendanceRate >= 60
                          ? "#ff9800"
                          : ders.attendanceRate > 0
                          ? "#f44336"
                          : "#e0e0e0"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      background:
                        ders.attendanceRate > 0
                          ? `radial-gradient(circle, ${
                              ders.attendanceRate >= 80
                                ? "rgba(76, 175, 80, 0.1)"
                                : ders.attendanceRate >= 60
                                ? "rgba(255, 152, 0, 0.1)"
                                : "rgba(244, 67, 54, 0.1)"
                            } 0%, rgba(255, 255, 255, 0.9) 100%)`
                          : "radial-gradient(circle, rgba(224, 224, 224, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%)",
                      boxShadow:
                        ders.attendanceRate > 0
                          ? `0 4px 12px ${
                              ders.attendanceRate >= 80
                                ? "rgba(76, 175, 80, 0.2)"
                                : ders.attendanceRate >= 60
                                ? "rgba(255, 152, 0, 0.2)"
                                : "rgba(244, 67, 54, 0.2)"
                            }`
                          : "0 4px 12px rgba(224, 224, 224, 0.2)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color:
                          ders.attendanceRate >= 80
                            ? "#4caf50"
                            : ders.attendanceRate >= 60
                            ? "#ff9800"
                            : ders.attendanceRate > 0
                            ? "#f44336"
                            : "#bdbdbd",
                        fontSize: { xs: "1.5rem", sm: "1.75rem" },
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      %{ders.attendanceRate}
                    </Typography>
                  </Box>
                </Box>

                {/* Ders Bilgileri - Detaylı Format */}
                <Box
                  sx={{
                    textAlign: "left",
                    mb: 3,
                    background: "rgba(26, 35, 126, 0.02)",
                    borderRadius: "16px",
                    p: 2,
                    border: "1px solid rgba(26, 35, 126, 0.05)",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1.5,
                      color: "rgba(26, 35, 126, 0.8)",
                      fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                      lineHeight: 1.5,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{ fontWeight: 600, color: "rgba(26, 35, 126, 0.9)" }}
                    >
                      Ders:
                    </Box>{" "}
                    {ders.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1.5,
                      color: "rgba(26, 35, 126, 0.8)",
                      fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                      lineHeight: 1.5,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{ fontWeight: 600, color: "rgba(26, 35, 126, 0.9)" }}
                    >
                      Günler:
                    </Box>{" "}
                    {getDaysText(ders.schedule)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1.5,
                      color: "rgba(26, 35, 126, 0.8)",
                      fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                      lineHeight: 1.5,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{ fontWeight: 600, color: "rgba(26, 35, 126, 0.9)" }}
                    >
                      Derslik:
                    </Box>{" "}
                    {ders.building} - {ders.room}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1.5,
                      color: "rgba(26, 35, 126, 0.8)",
                      fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                      lineHeight: 1.5,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{ fontWeight: 600, color: "rgba(26, 35, 126, 0.9)" }}
                    >
                      Öğrenci Sayısı:
                    </Box>{" "}
                    {ders.studentCount}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: ders.info ? 1.5 : 0,
                      color: "rgba(26, 35, 126, 0.8)",
                      fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                      lineHeight: 1.5,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{ fontWeight: 600, color: "rgba(26, 35, 126, 0.9)" }}
                    >
                      Yoklama Oranı:
                    </Box>{" "}
                    %{ders.attendanceRate}
                  </Typography>
                  {ders.info && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: "italic",
                        color: "rgba(26, 35, 126, 0.6)",
                        fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                        lineHeight: 1.4,
                        background: "rgba(26, 35, 126, 0.03)",
                        borderRadius: "8px",
                        p: 1,
                        border: "1px solid rgba(26, 35, 126, 0.05)",
                      }}
                    >
                      {ders.info}
                    </Typography>
                  )}
                </Box>

                {/* Dersi Düzenle Butonu */}
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  fullWidth
                  sx={{
                    background:
                      "linear-gradient(135deg, #1a237e 0%, #3949ab 100%)",
                    borderRadius: "16px",
                    py: { xs: 1.25, sm: 1.5 },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(26, 35, 126, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #0d47a1 0%, #283593 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px rgba(26, 35, 126, 0.4)",
                    },
                    "&:active": {
                      transform: "translateY(0px)",
                      boxShadow: "0 4px 12px rgba(26, 35, 126, 0.3)",
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
