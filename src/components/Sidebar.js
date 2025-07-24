import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Chip,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  School as SchoolIcon,
  ExpandLess,
  ExpandMore,
  Info as InfoIcon,
  ManageAccounts as ManageAccountsIcon,
  Home as HomeIcon,
  Class as ClassIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const Sidebar = ({
  open,
  onToggle,
  isMobile,
  selectedSemester,
  onNavigate,
}) => {
  const theme = useTheme();

  // State for selected term
  const [selectedTerm, setSelectedTerm] = useState("2025-2026 Güz");

  // State for courses list
  const [courses, setCourses] = useState([]);

  // State for modal/form
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for collapsible sections
  const [openSections, setOpenSections] = useState({
    coursesOffered: true,
    academicInfo: false,
  });

  // State for new course form
  const [newCourse, setNewCourse] = useState({
    courseName: "",
    term: "",
    section: "",
    courseCode: "",
    courseTitle: "",
    language: "",
    theoryPractice: "",
    mandatoryElective: "Z",
    credits: "",
    ects: "",
    faculty: "",
    classLevel: 1,
    days: [],
    times: "",
  });

  // Available terms
  const terms = [
    "2023-2024 Güz",
    "2023-2024 Bahar",
    "2024-2025 Güz",
    "2024-2025 Bahar",
    "2025-2026 Güz",
    "2025-2026 Bahar",
  ];

  // Mock course data - will be replaced with API calls later
  const mockCourses = {
    "2025-2026 Güz": [
      {
        id: 1,
        courseName: "Matematik I",
        term: "2025-2026 Güz",
        section: "A1",
        courseCode: "MATH113",
        courseTitle: "Matematik I",
        language: "Türkçe",
        theoryPractice: "3+1",
        mandatoryElective: "Zorunlu",
        credits: "4",
        ects: "6",
        faculty: "Öğr. Gör. Mehmet Nuri Öğüt",
        classLevel: 1,
        days: ["Pazartesi"],
        times: "08:40-09:30",
      },
      {
        id: 2,
        courseName: "İngilizce I",
        term: "2025-2026 Güz",
        section: "D101",
        courseCode: "ENG101",
        courseTitle: "İngilizce I",
        language: "İngilizce",
        theoryPractice: "2+2",
        mandatoryElective: "Zorunlu",
        credits: "3",
        ects: "5",
        faculty: "Öğr. Gör. Mehmet Nuri Öğüt",
        classLevel: 1,
        days: ["Salı"],
        times: "09:50-11:00",
      },
    ],
  };

  // Teacher's registered courses - loaded from localStorage
  const [teacherCourses, setTeacherCourses] = useState([]);

  // Load teacher's registered courses
  useEffect(() => {
    const savedCourses = localStorage.getItem("teacherCourses");
    if (savedCourses) {
      setTeacherCourses(JSON.parse(savedCourses));
    }

    // Listen for localStorage changes to update courses in real-time
    const handleStorageChange = () => {
      const updatedCourses = localStorage.getItem("teacherCourses");
      if (updatedCourses) {
        setTeacherCourses(JSON.parse(updatedCourses));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events from other components
    const handleCustomStorageChange = () => {
      handleStorageChange();
      // Refresh courses list
      const activeCourses = JSON.parse(
        localStorage.getItem("activeCourses") || "[]"
      );
      const activeCoursesForTerm = activeCourses.filter(
        (course) => course.term === selectedTerm
      );
      const mockCoursesForTerm = mockCourses[selectedTerm] || [];
      const allCourses = [...mockCoursesForTerm, ...activeCoursesForTerm];
      setCourses(allCourses);
    };

    window.addEventListener("teacherCoursesUpdated", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "teacherCoursesUpdated",
        handleCustomStorageChange
      );
    };
  }, [selectedTerm]);

  // Get available courses for the selected term
  const availableCourses = teacherCourses
    .filter((course) => course.term === selectedTerm)
    .map((course) => course.courseName)
    .filter((name, index, self) => self.indexOf(name) === index); // Remove duplicates

  // Days of the week (Monday to Friday only)
  const daysOfWeek = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

  // Update courses when term changes
  useEffect(() => {
    // Load both mock courses and active courses from localStorage
    const mockCoursesForTerm = mockCourses[selectedTerm] || [];
    const activeCourses = JSON.parse(
      localStorage.getItem("activeCourses") || "[]"
    );
    const activeCoursesForTerm = activeCourses.filter(
      (course) => course.term === selectedTerm
    );

    // Combine both sources
    const allCourses = [...mockCoursesForTerm, ...activeCoursesForTerm];
    setCourses(allCourses);
  }, [selectedTerm]);

  // Handle term change
  const handleTermChange = (event) => {
    setSelectedTerm(event.target.value);
  };

  // Handle opening add course modal
  const handleAddCourse = () => {
    // Reset form completely
    setNewCourse({
      courseName: "",
      term: selectedTerm,
      section: "",
      courseCode: "",
      courseTitle: "",
      language: "",
      theoryPractice: "",
      mandatoryElective: "Z",
      credits: "",
      ects: "",
      faculty: "",
      classLevel: 1,
      days: [],
      times: "",
    });
    setIsModalOpen(true);
  };

  // Handle course selection in autocomplete
  const handleCourseSelection = (event, value) => {
    if (value) {
      // Find the selected course from teacher's registered courses
      const selectedCourseData = teacherCourses.find(
        (course) => course.courseName === value && course.term === selectedTerm
      );

      if (selectedCourseData) {
        // Auto-fill course information from registered course data
        const courseInfo = {
          courseName: selectedCourseData.courseName,
          courseCode: selectedCourseData.courseCode,
          courseTitle: selectedCourseData.courseName,
          language:
            selectedCourseData.courseLanguage || selectedCourseData.language,
          theoryPractice: selectedCourseData.theoryPractice,
          credits: selectedCourseData.credits,
          ects: selectedCourseData.ects,
          faculty: selectedCourseData.faculty,
          section: "A1", // Default section, can be changed by user
          mandatoryElective: selectedCourseData.mandatoryElective,
          days: [], // Will be set by user
          times: "", // Will be set by user
        };

        setNewCourse((prev) => ({
          ...prev,
          ...courseInfo,
        }));
      }
    } else {
      // Reset form when no course is selected
      setNewCourse({
        courseName: "",
        term: selectedTerm,
        section: "",
        courseCode: "",
        courseTitle: "",
        language: "",
        theoryPractice: "",
        mandatoryElective: "Z",
        credits: "",
        ects: "",
        faculty: "",
        classLevel: 1,
        days: [],
        times: "",
      });
    }
  };

  // Handle saving new course
  const handleSaveCourse = () => {
    // Validation
    const requiredFields = [
      "courseName",
      "courseCode",
      "section",
      "days",
      "times",
    ];
    const missingFields = requiredFields.filter((field) => {
      if (field === "days") return newCourse[field].length === 0;
      return !newCourse[field];
    });

    if (missingFields.length > 0) {
      alert(
        "Lütfen tüm zorunlu alanları doldurun (Ders Adı, Ders Kodu, Şube, Günler, Saatler)"
      );
      return;
    }

    const courseWithId = {
      ...newCourse,
      id: Date.now(), // Simple ID generation
      addedAt: new Date().toISOString(),
    };

    // Save to active courses in localStorage (compatible with DersEkleBirak)
    const existingActiveCourses = JSON.parse(
      localStorage.getItem("activeCourses") || "[]"
    );
    const updatedActiveCourses = [...existingActiveCourses, courseWithId];
    localStorage.setItem("activeCourses", JSON.stringify(updatedActiveCourses));

    // Update local state
    setCourses((prev) => [...prev, courseWithId]);
    setIsModalOpen(false);

    // Show success message
    alert("Ders başarıyla eklendi!");
  };

  // Handle course field updates
  const handleCourseFieldChange = (courseId, field, value) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId ? { ...course, [field]: value } : course
      )
    );
  };

  // Handle section toggle
  const handleSectionToggle = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Navigation items
  const navigationItems = [
    {
      key: "ana-sayfa",
      label: "Ana Sayfa",
      icon: <HomeIcon />,
      path: "ana-sayfa",
    },
    {
      key: "ders-ve-donem-islemleri",
      label: "Ders ve Dönem İşlemleri",
      icon: <ManageAccountsIcon />,
      path: "ders-ve-donem-islemleri",
    },
    {
      key: "derslerim",
      label: "Derslerim",
      icon: <ClassIcon />,
      path: "derslerim",
    },
    {
      key: "profilim",
      label: "Profilim",
      icon: <PersonIcon />,
      path: "profilim",
    },
  ];

  const sidebarContent = (
    <Box
      sx={{
        width: 280,
        height: "100vh",
        backgroundColor: "#1a237e",
        color: "white",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navigation List */}
      <List sx={{ flexGrow: 1, py: 0 }}>
        {/* Main Navigation Items */}
        {navigationItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              onClick={() => onNavigate && onNavigate(item.path)}
              sx={{
                py: 1.5,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {React.cloneElement(item.icon, {
                  sx: { color: "white", fontSize: 20 },
                })}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "white",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        {/* Courses Offered Section */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleSectionToggle("coursesOffered")}
            sx={{
              py: 1.5,
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <SchoolIcon sx={{ color: "white", fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary="Sunulan Dersler"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "white",
              }}
            />
            {openSections.coursesOffered ? (
              <ExpandLess sx={{ color: "white" }} />
            ) : (
              <ExpandMore sx={{ color: "white" }} />
            )}
          </ListItemButton>
        </ListItem>

        <Collapse in={openSections.coursesOffered} timeout="auto" unmountOnExit>
          <Box sx={{ pl: 2, pr: 2, pb: 2 }}>
            {/* Academic Term Selector */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <Select
                value={selectedTerm}
                onChange={handleTermChange}
                displayEmpty
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "white",
                  fontSize: "0.875rem",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.5)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.7)",
                  },
                  "& .MuiSelect-icon": {
                    color: "white",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "white",
                      "& .MuiMenuItem-root": {
                        fontSize: "0.875rem",
                      },
                    },
                  },
                }}
              >
                {terms.map((term) => (
                  <MenuItem key={term} value={term}>
                    {term}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Add Course Button */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCourse}
              fullWidth
              size="small"
              sx={{
                mb: 2,
                backgroundColor: "#4caf50",
                "&:hover": { backgroundColor: "#45a049" },
                textTransform: "none",
                fontSize: "0.875rem",
              }}
            >
              Ders Ekle
            </Button>

            {/* Info Text */}
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.75rem",
                textAlign: "center",
                py: 1,
                fontStyle: "italic",
              }}
            >
              Hızlı ders ekleme için kullanın.
              <br />
              Derslerinizi "Derslerim" bölümünde görüntüleyebilirsiniz.
            </Typography>
          </Box>
        </Collapse>

        {/* Academic Information Section */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleSectionToggle("academicInfo")}
            sx={{
              py: 1.5,
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <InfoIcon sx={{ color: "white", fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary="Akademik Bilgiler"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "white",
              }}
            />
            {openSections.academicInfo ? (
              <ExpandLess sx={{ color: "white" }} />
            ) : (
              <ExpandMore sx={{ color: "white" }} />
            )}
          </ListItemButton>
        </ListItem>
      </List>

      {/* Add Course Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Yeni Ders Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {/* Course Name Autocomplete */}
            <Autocomplete
              options={availableCourses}
              value={newCourse.courseName}
              onChange={handleCourseSelection}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ders Adı"
                  fullWidth
                  margin="normal"
                />
              )}
            />

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  label="Ders Kodu"
                  value={newCourse.courseCode}
                  onChange={(e) =>
                    setNewCourse((prev) => ({
                      ...prev,
                      courseCode: e.target.value,
                    }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Şube"
                  value={newCourse.section}
                  onChange={(e) =>
                    setNewCourse((prev) => ({
                      ...prev,
                      section: e.target.value,
                    }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Dil"
                  value={newCourse.language}
                  onChange={(e) =>
                    setNewCourse((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="T+P"
                  value={newCourse.theoryPractice}
                  onChange={(e) =>
                    setNewCourse((prev) => ({
                      ...prev,
                      theoryPractice: e.target.value,
                    }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Kredi"
                  value={newCourse.credits}
                  onChange={(e) =>
                    setNewCourse((prev) => ({
                      ...prev,
                      credits: e.target.value,
                    }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="ECTS"
                  value={newCourse.ects}
                  onChange={(e) =>
                    setNewCourse((prev) => ({ ...prev, ects: e.target.value }))
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Sınıf Seviyesi</InputLabel>
                  <Select
                    value={newCourse.classLevel}
                    label="Sınıf Seviyesi"
                    onChange={(e) =>
                      setNewCourse((prev) => ({
                        ...prev,
                        classLevel: e.target.value,
                      }))
                    }
                  >
                    {[1, 2, 3, 4].map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Öğretim Üyesi"
                  value={newCourse.faculty}
                  onChange={(e) =>
                    setNewCourse((prev) => ({
                      ...prev,
                      faculty: e.target.value,
                    }))
                  }
                  fullWidth
                />
              </Grid>

              {/* Days Selection */}
              <Grid item xs={12}>
                <FormLabel component="legend">Günler</FormLabel>
                <Autocomplete
                  multiple
                  options={daysOfWeek}
                  value={newCourse.days}
                  onChange={(_, newValue) => {
                    setNewCourse((prev) => ({ ...prev, days: newValue }));
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Günleri seçin" />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Ders Saati</InputLabel>
                  <Select
                    value={newCourse.times}
                    label="Ders Saati"
                    onChange={(e) =>
                      setNewCourse((prev) => ({
                        ...prev,
                        times: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="08:40-09:30">08:40-09:30</MenuItem>
                    <MenuItem value="09:50-10:40">09:50-10:40</MenuItem>
                    <MenuItem value="10:40-11:30">10:40-11:30</MenuItem>
                    <MenuItem value="11:50-12:40">11:50-12:40</MenuItem>
                    <MenuItem value="13:40-14:30">13:40-14:30</MenuItem>
                    <MenuItem value="14:40-15:30">14:40-15:30</MenuItem>
                    <MenuItem value="15:40-16:30">15:40-16:30</MenuItem>
                    <MenuItem value="16:40-17:30">16:40-17:30</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Mandatory/Elective */}
              <Grid item xs={12}>
                <FormLabel component="legend">Zorunlu/Seçmeli</FormLabel>
                <RadioGroup
                  row
                  value={newCourse.mandatoryElective}
                  onChange={(e) =>
                    setNewCourse((prev) => ({
                      ...prev,
                      mandatoryElective: e.target.value,
                    }))
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
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>İptal</Button>
          <Button onClick={handleSaveCourse} variant="contained">
            Ders Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  // Return drawer for mobile, permanent sidebar for desktop
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? 280 : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

export default Sidebar;
