import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  Update as UpdateIcon,
  School as SchoolIcon,
  LocationOn,
  Groups,
  CalendarToday,
  CheckCircle,
  Edit,
  ExpandMore as ExpandMoreIcon,
  Schedule as ScheduleIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import AuthContext from "../contexts/AuthContext";
import { fetchLecturerLectures, fetchSectionHours, updateHour } from "../api/schedule";

const DersVeDönemIslemleri = ({ onNavigate }) => {
  const { user, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedTerm, setSelectedTerm] = useState("2025-2026 Güz");
  
  // Ders güncelleme için state'ler
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [lecturerLectures, setLecturerLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [lectureHours, setLectureHours] = useState([]);
  const [loadingLectures, setLoadingLectures] = useState(false);
  const [loadingHours, setLoadingHours] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [editingHour, setEditingHour] = useState(null);
  const [lecturerCoursesForDisplay, setLecturerCoursesForDisplay] = useState([]);
  const [hourFormData, setHourFormData] = useState({
    order: '',
    day: '',
    time_start: '',
    time_end: '',
    classroom_id: ''
  });

  // Available terms
  const termOptions = [
    "2025-2026 Bahar",
    "2025-2026 Güz",
    "2024-2025 Bahar",
    "2024-2025 Güz",
    "2023-2024 Bahar",
    "2023-2024 Güz",
  ];

  // Helper function - Kursları normalize et
  const normalizeCourses = async (courses) => {
    let normalizedCourses = [];
    
    if (!courses) {
      normalizedCourses = [];
    } else if (courses.sections && Array.isArray(courses.sections)) {
      normalizedCourses = await Promise.all(courses.sections.map(async (section) => {
        const course = {
          ...section.lecture,
          section_id: section.id,
          section_number: section.section_number,
          id: section.lecture.id,
          name: section.lecture.explicit_name || section.lecture.name,
          course_name: section.lecture.explicit_name,
          lecture_name: section.lecture.explicit_name,
          code: section.lecture.code,
          lecture_code: section.lecture.code,
          section: section.section_number,
          section_name: section.section_number,
          section_code: section.section_number,
          hours: []
        };
        
        // Section'ın saatlerini de yükle
        try {
          const hours = await fetchSectionHours(section.id, accessToken);
          course.hours = hours || [];
          
          // Günleri formatla
          const dayHours = {};
          if (Array.isArray(hours)) {
            hours.forEach(hour => {
              console.log('🕐 Processing hour:', hour); // Debug için
              const dayName = hour.day;
              if (!dayHours[dayName]) dayHours[dayName] = [];
              dayHours[dayName].push({
                startTime: hour.time_start,
                endTime: hour.time_end,
                order: hour.order,
                hour_id: hour.hour_id || hour.id, // ID kontrolü
                id: hour.id || hour.hour_id,
                classroom_id: hour.classroom_id,
                day: hour.day,
                time_start: hour.time_start,
                time_end: hour.time_end
              });
            });
          }
          course.schedule = dayHours;
          
        } catch (hoursError) {
          console.error('❌ Section hours yüklenirken hata:', hoursError);
          course.hours = [];
          course.schedule = {};
        }
        
        return course;
      }));
    } else if (Array.isArray(courses)) {
      normalizedCourses = courses;
    } else if (courses.lectures && Array.isArray(courses.lectures)) {
      normalizedCourses = courses.lectures;
    } else if (courses.data && Array.isArray(courses.data)) {
      normalizedCourses = courses.data;
    } else {
      console.warn('⚠️ Unexpected API response format:', courses);
      normalizedCourses = [];
    }
    
    return normalizedCourses;
  };

  // Öğretmenin derslerini yükle
  useEffect(() => {
    const loadLecturerCourses = async () => {
      if (user?.lecturer_id && accessToken) {
        setLoadingCourses(true);
        try {
          console.log('🔄 Öğretmen dersleri yükleniyor...', user.lecturer_id);
          const courses = await fetchLecturerLectures(user.lecturer_id, accessToken);
          console.log('📚 API Response courses:', courses);
          console.log('📚 Courses type:', typeof courses);
          console.log('📚 Is array:', Array.isArray(courses));
          
          // API response'ı normalize et (Derslerim.js'deki normalizeLectures mantığı)
          let normalizedCourses = [];
          
          if (!courses) {
            normalizedCourses = [];
          } else if (courses.sections && Array.isArray(courses.sections)) {
            // Yeni API formatı: { id: "...", sections: [...] }
            console.log('📋 New API format detected - sections array found');
            normalizedCourses = await Promise.all(courses.sections.map(async (section) => {
              const course = {
                ...section.lecture, // lecture bilgileri (id, name, code, explicit_name)
                section_id: section.id, // section ID'si
                section_number: section.section_number, // section numarası
                // Eski format uyumluluğu için
                id: section.lecture.id,
                name: section.lecture.explicit_name || section.lecture.name,
                course_name: section.lecture.explicit_name,
                lecture_name: section.lecture.explicit_name,
                code: section.lecture.code,
                lecture_code: section.lecture.code,
                section: section.section_number,
                section_name: section.section_number,
                section_code: section.section_number,
                hours: [] // Başlangıçta boş, ama sonra doldurulacak
              };
              
              // Section'ın saatlerini de yükle
              try {
                console.log('🕐 Loading hours for section:', section.id);
                const hours = await fetchSectionHours(section.id, accessToken);
                console.log('🕐 Hours for section', section.id, ':', hours);
                course.hours = hours || [];
                
                // Günleri formatla
                const dayHours = {};
                if (Array.isArray(hours)) {
                  hours.forEach(hour => {
                    console.log('🕐 Processing hour (loadLecturerCourses):', hour); // Debug için
                    const dayName = hour.day;
                    if (!dayHours[dayName]) dayHours[dayName] = [];
                    dayHours[dayName].push({
                      startTime: hour.time_start,
                      endTime: hour.time_end,
                      order: hour.order,
                      hour_id: hour.hour_id || hour.id, // ID kontrolü
                      id: hour.id || hour.hour_id,
                      classroom_id: hour.classroom_id,
                      day: hour.day,
                      time_start: hour.time_start,
                      time_end: hour.time_end
                    });
                  });
                }
                course.schedule = dayHours;
                
              } catch (hoursError) {
                console.error('❌ Section hours yüklenirken hata:', hoursError);
                course.hours = [];
                course.schedule = {};
              }
              
              return course;
            }));
            console.log('✅ Converted sections to lectures with hours:', normalizedCourses);
          } else if (Array.isArray(courses)) {
            normalizedCourses = courses;
          } else if (courses.lectures && Array.isArray(courses.lectures)) {
            normalizedCourses = courses.lectures;
          } else if (courses.data && Array.isArray(courses.data)) {
            normalizedCourses = courses.data;
          } else {
            console.warn('⚠️ Unexpected API response format:', courses);
            normalizedCourses = [];
          }
          
          console.log('🎯 Final normalized courses:', normalizedCourses);
          setLecturerCoursesForDisplay(normalizedCourses);
        } catch (error) {
          console.error('❌ Öğretmen dersleri yüklenirken hata:', error);
          setLecturerCoursesForDisplay([]);
        } finally {
          setLoadingCourses(false);
        }
      }
    };

    loadLecturerCourses();
  }, [user?.lecturer_id, accessToken]);
  const handleTermChange = (event) => {
    setSelectedTerm(event.target.value);
  };

  // Güncel dönem kontrolü - sadece 2025-2026 dönemi aktif
  const isCurrentTerm = (term) => {
    return term.includes("2025-2026");
  };

  // Ders güncelleme fonksiyonları
  const handleUpdateDialogOpen = async () => {
    if (!user?.lecturer_id || !accessToken) {
      alert('Kullanıcı bilgileri bulunamadı!');
      return;
    }

    setLoadingLectures(true);
    try {
      const lectures = await fetchLecturerLectures(user.lecturer_id, accessToken);
      console.log('🔄 Dialog - Raw lectures response:', lectures);
      
      // Lectures'ı normalize et
      let normalizedLectures = [];
      
      if (!lectures) {
        normalizedLectures = [];
      } else if (lectures.sections && Array.isArray(lectures.sections)) {
        // Yeni API formatı: { id: "...", sections: [...] }
        console.log('📋 Dialog - New API format detected - sections array found');
        normalizedLectures = lectures.sections.map(section => ({
          ...section.lecture, // lecture bilgileri (id, name, code, explicit_name)
          section_id: section.id, // section ID'si
          section_number: section.section_number, // section numarası
          // Eski format uyumluluğu için
          id: section.lecture.id,
          name: section.lecture.explicit_name || section.lecture.name,
          course_name: section.lecture.explicit_name,
          lecture_name: section.lecture.explicit_name,
          code: section.lecture.code,
          lecture_code: section.lecture.code,
          section: section.section_number,
          section_name: section.section_number,
          section_code: section.section_number
        }));
        console.log('✅ Dialog - Converted sections to lectures:', normalizedLectures);
      } else if (Array.isArray(lectures)) {
        normalizedLectures = lectures;
      } else if (lectures.lectures && Array.isArray(lectures.lectures)) {
        normalizedLectures = lectures.lectures;
      } else if (lectures.data && Array.isArray(lectures.data)) {
        normalizedLectures = lectures.data;
      } else {
        console.warn('⚠️ Dialog - Unexpected API response format:', lectures);
        normalizedLectures = [];
      }
      
      console.log('🎯 Dialog - Final normalized lectures:', normalizedLectures);
      setLecturerLectures(normalizedLectures);
      setUpdateDialogOpen(true);
    } catch (error) {
      console.error('Dersler yüklenirken hata:', error);
      alert('Dersler yüklenirken hata oluştu!');
    } finally {
      setLoadingLectures(false);
    }
  };

  const handleLectureSelect = async (lecture) => {
    setSelectedLecture(lecture);
    setLoadingHours(true);
    try {
      const hours = await fetchSectionHours(lecture.section_id, accessToken);
      setLectureHours(hours);
    } catch (error) {
      console.error('Ders saatleri yüklenirken hata:', error);
      alert('Ders saatleri yüklenirken hata oluştu!');
    } finally {
      setLoadingHours(false);
    }
  };

  const handleEditHour = (hour) => {
    console.log('✏️ Editing hour:', hour);
    console.log('🆔 Hour ID:', hour.hour_id || hour.id);
    
    setEditingHour(hour);
    setHourFormData({
      order: hour.order || '',
      day: hour.day || '',
      time_start: hour.time_start || '',
      time_end: hour.time_end || '',
      classroom_id: hour.classroom_id || ''
    });
  };

  const handleSaveHour = async () => {
    if (!editingHour || !accessToken || !selectedLecture) {
      console.error('❌ Eksik bilgiler:', { editingHour: !!editingHour, accessToken: !!accessToken, selectedLecture: !!selectedLecture });
      return;
    }

    // Zorunlu alanları kontrol et
    if (!hourFormData.order || !hourFormData.day || !hourFormData.time_start || !hourFormData.time_end) {
      alert('Lütfen tüm zorunlu alanları doldurun (Sıra, Gün, Başlangıç, Bitiş)!');
      return;
    }

    try {
      console.log('🔄 Saat güncelleniyor...', {
        hour_id: editingHour.hour_id,
        updateData: hourFormData,
        section_id: selectedLecture.section_id,
        fullEditingHour: editingHour
      });

      // Hour ID kontrolü - hem hour_id hem id alanını kontrol et
      const hourId = editingHour.hour_id || editingHour.id;
      if (!hourId) {
        console.error('❌ hour_id veya id bulunamadı!', editingHour);
        alert('Saat ID\'si bulunamadı. Lütfen sayfayı yenileyin.');
        return;
      }

      console.log('🆔 Using hour ID:', hourId);

      // Backend'e gönderilecek veri
      const updateData = {
        order: String(hourFormData.order), // String olarak gönder
        day: hourFormData.day,
        time_start: hourFormData.time_start,
        time_end: hourFormData.time_end,
        section_id: selectedLecture.section_id,
        classroom_id: hourFormData.classroom_id || null
      };

      console.log('📤 PUT Request Data:', updateData);
      console.log('🌐 API URL will be:', `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/lecturer_data/hours/${hourId}/`);

      await updateHour(hourId, updateData, accessToken);
      
      console.log('✅ Saat güncellendi, saatleri yeniden yükleniyor...');
      
      // Saatleri yeniden yükle
      const hours = await fetchSectionHours(selectedLecture.section_id, accessToken);
      setLectureHours(hours);
      setEditingHour(null);
      
      // Ana listeyi de yeniden yükle
      const courses = await fetchLecturerLectures(user.lecturer_id, accessToken);
      const normalizedCourses = await normalizeCourses(courses);
      setLecturerCoursesForDisplay(normalizedCourses);
      
      alert('Ders saati başarıyla güncellendi!');
    } catch (error) {
      console.error('❌ Saat güncellenirken hata:', error);
      alert(`Saat güncellenirken hata oluştu: ${error.message}`);
    }
  };

  const handleDialogClose = () => {
    setUpdateDialogOpen(false);
    setSelectedLecture(null);
    setLectureHours([]);
    setEditingHour(null);
  };

  // Ders ekle butonu - Ders ekleme sayfasına yönlendir
  const handleAddCourse = () => {
    navigate('/portal/ders-kayit');
  };

  const isTermActive = isCurrentTerm(selectedTerm);
  // Real courses from current university schedule (2025-2026)
  const staticCourses = [
    {
      id: 1,
      name: "Matematik",
      code: "MRK 1116",
      section: "A1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Amfi-6",
      schedule: {
        Çarşamba: [{ startTime: "08:40", endTime: "11:30", room: "Amfi-6" }],
      },
      studentCount: 45,
      attendanceStatus: "completed",
      attendanceRate: 88,
    },
    {
      id: 2,
      name: "Matematik",
      code: "IYS 1101",
      section: "B1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Amfi",
      schedule: {
        Salı: [{ startTime: "08:40", endTime: "10:30", room: "Amfi" }],
      },
      studentCount: 38,
      attendanceStatus: "completed",
      attendanceRate: 92,
    },
    {
      id: 3,
      name: "Mesleki Matematik",
      code: "EKT 1117",
      section: "C1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Amfi-6",
      schedule: {
        Çarşamba: [{ startTime: "11:45", endTime: "12:30", room: "Amfi-6" }],
      },
      studentCount: 32,
      attendanceStatus: "completed",
      attendanceRate: 84,
    },
    {
      id: 4,
      name: "Programlama",
      code: "IYS 1103",
      section: "Lab1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Derslik-7",
      schedule: {
        Salı: [{ startTime: "16:15", endTime: "17:00", room: "Derslik-7" }],
        Cuma: [
          { startTime: "13:40", endTime: "15:30", room: "Bilgisayar Lab-2" },
        ],
      },
      studentCount: 28,
      attendanceStatus: "completed",
      attendanceRate: 94,
    },
    {
      id: 5,
      name: "Akademik Yapay Zekaya Giriş",
      code: "SSD 3264",
      section: "A1",
      building: "Mühendislik ve Doğa Bilimleri Fakültesi",
      room: "Derslik",
      schedule: {
        Perşembe: [{ startTime: "16:15", endTime: "17:00", room: "Derslik" }],
        Cuma: [{ startTime: "16:15", endTime: "17:00", room: "Derslik" }],
      },
      studentCount: 22,
      attendanceStatus: "completed",
      attendanceRate: 91,
    },
    {
      id: 6,
      name: "Bilişim ve Bilgisayar Ağları Temelleri",
      code: "IYS 1107",
      section: "B1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Derslik-8",
      schedule: {
        Salı: [{ startTime: "11:45", endTime: "12:30", room: "Derslik-8" }],
      },
      studentCount: 35,
      attendanceStatus: "pending",
      attendanceRate: 85,
    },
    {
      id: 7,
      name: "Yapay Zeka ile Zenginleştirilmiş Proje Yönetimi",
      code: "USD 1165",
      section: "A1",
      building: "Mühendislik ve Doğa Bilimleri Fakültesi",
      room: "Amfi",
      schedule: {
        Perşembe: [
          { startTime: "13:40", endTime: "15:30", room: "Amfi" },
          { startTime: "17:00", endTime: "17:45", room: "Amfi" },
        ],
      },
      studentCount: 18,
      attendanceStatus: "completed",
      attendanceRate: 89,
    },
    {
      id: 8,
      name: "Veri Toplama ve Analizi",
      code: "IYS 2103",
      section: "B1",
      building: "Manisa Teknik Bilimler MYO",
      room: "Derslik-6",
      schedule: {
        Cuma: [{ startTime: "08:40", endTime: "10:30", room: "Derslik-6" }],
      },
      studentCount: 26,
      attendanceStatus: "completed",
      attendanceRate: 87,
    },
  ];

  const getDaysText = (schedule) => {
    if (!schedule || typeof schedule !== 'object') return 'Henüz planlanmamış';
    
    const dayNames = {
      'Monday': 'Pazartesi',
      'Tuesday': 'Salı', 
      'Wednesday': 'Çarşamba',
      'Thursday': 'Perşembe',
      'Friday': 'Cuma',
      'Saturday': 'Cumartesi',
      'Sunday': 'Pazar'
    };
    
    const days = Object.keys(schedule);
    if (days.length === 0) return 'Henüz planlanmamış';
    
    return days.map(day => dayNames[day] || day).join(', ');
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "not_taken":
        return "error";
      default:
        return "default";
    }
  };

  const getAttendanceStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Tamamlandı";
      case "pending":
        return "Beklemede";
      case "not_taken":
        return "Alınmadı";
      default:
        return "Bilinmiyor";
    }
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        py: { xs: 0.5, sm: 0.75, md: 1, lg: 1.25, xl: 1.5 },
        px: { xs: 1, sm: 2, md: 3, lg: 4, xl: 6 },
        maxWidth: { xs: "100%", sm: "100%", md: "1200px", lg: "1400px", xl: "1800px" },
        mx: "auto"
      }}
    >
      {/* Minimal Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 1.5,
          p: 1,
          bgcolor: "white",
          borderRadius: 1,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "#1a237e", fontSize: "1rem" }}
        >
          Ders ve Dönem İşlemleri
        </Typography>
      </Box>

      {/* Minimal Term Selection */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 1.5,
          p: 1,
          bgcolor: "#f8f9fa",
          borderRadius: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, fontSize: "0.8rem", color: "#1a237e" }}
        >
          Dönem:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={selectedTerm}
            onChange={handleTermChange}
            sx={{
              fontSize: "0.8rem",
              "& .MuiSelect-select": {
                py: 0.5,
              },
            }}
          >
            {termOptions.map((term) => (
              <MenuItem key={term} value={term} sx={{ fontSize: "0.8rem" }}>
                {term}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Main Layout: Left Sidebar + Right Course List */}
      <Grid container spacing={1.5}>
        {/* Left Sidebar - Ultra Minimal Action Cards */}
        <Grid item xs={12} md={2.5}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
            {/* Ders Ekle Card - Ultra Minimal */}
            <Card
              sx={{
                borderRadius: 1,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                cursor: isTermActive ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                opacity: isTermActive ? 1 : 0.5,
                "&:hover": isTermActive
                  ? {
                      transform: "translateY(-1px)",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }
                  : {},
              }}
              onClick={() =>
                isTermActive && handleAddCourse()
              }
            >
              <CardContent sx={{ p: 0.8, textAlign: "center" }}>
                <Box
                  sx={{
                    bgcolor: isTermActive
                      ? "rgba(33, 150, 243, 0.06)"
                      : "rgba(158, 158, 158, 0.06)",
                    borderRadius: 0.8,
                    p: 0.6,
                    mb: 0.5,
                    display: "inline-flex",
                  }}
                >
                  <AddCircleIcon
                    sx={{
                      fontSize: 24,
                      color: isTermActive ? "#2196f3" : "#9e9e9e",
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    mb: 0.1,
                    color: isTermActive ? "#1a237e" : "#9e9e9e",
                    lineHeight: 1.2,
                  }}
                >
                  Ders Ekle
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.65rem",
                    lineHeight: 1.1,
                    color: isTermActive ? "text.secondary" : "#bdbdbd",
                  }}
                >
                  {isTermActive
                    ? "Yeni Ders Ekleme "
                    : "Sadece aktif dönemde"}
                </Typography>
              </CardContent>
            </Card>

            {/* Ders Güncelle Card - Ultra Minimal */}
            <Card
              sx={{
                borderRadius: 1,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                cursor: isTermActive ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                opacity: isTermActive ? 1 : 0.5,
                "&:hover": isTermActive
                  ? {
                      transform: "translateY(-1px)",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }
                  : {},
              }}
              onClick={() =>
                isTermActive && handleUpdateDialogOpen()
              }
            >
              <CardContent sx={{ p: 0.8, textAlign: "center" }}>
                <Box
                  sx={{
                    bgcolor: isTermActive
                      ? "rgba(76, 175, 80, 0.06)"
                      : "rgba(158, 158, 158, 0.06)",
                    borderRadius: 0.8,
                    p: 0.6,
                    mb: 0.5,
                    display: "inline-flex",
                  }}
                >
                  <UpdateIcon
                    sx={{
                      fontSize: 24,
                      color: isTermActive ? "#4caf50" : "#9e9e9e",
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    mb: 0.1,
                    color: isTermActive ? "#1a237e" : "#9e9e9e",
                    lineHeight: 1.2,
                  }}
                >
                  Ders Güncelle
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.65rem",
                    lineHeight: 1.1,
                    color: isTermActive ? "text.secondary" : "#bdbdbd",
                  }}
                >
                  {isTermActive
                    ? "Ders Bilgilerini Güncelleme"
                    : "Sadece aktif dönemde"}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Right Side - Compact Course List */}
        <Grid item xs={12} md={9.5}>
          <Card
            sx={{ borderRadius: 1.5, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
          >
            <CardContent sx={{ p: 1.5 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <SchoolIcon sx={{ color: "#1976d2", fontSize: 18 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, fontSize: "1rem" }}
                >
                  Derslerim ({(lecturerCoursesForDisplay || []).length})
                </Typography>
              </Box>

              {/* Compact Course Table */}
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                      <TableCell
                        sx={{ fontWeight: 600, py: 0.5, fontSize: "0.8rem" }}
                      >
                        Ders Kodu
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, py: 0.5, fontSize: "0.8rem" }}
                      >
                        Ders Adı
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, py: 0.5, fontSize: "0.8rem" }}
                      >
                        Günler
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(lecturerCoursesForDisplay || []).length > 0 ? (
                      (lecturerCoursesForDisplay || []).map((ders) => (
                        <TableRow
                          key={ders.section_id || ders.id}
                          sx={{
                            "&:hover": { bgcolor: "#f8f9fa" },
                            cursor: "pointer",
                          }}
                        >
                          <TableCell sx={{ py: 0.3 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: "#1976d2",
                                fontSize: "0.8rem",
                                lineHeight: 1.2,
                              }}
                            >
                              {ders.code}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 0.3 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                fontSize: "0.8rem",
                                lineHeight: 1.2,
                                mb: 0.2,
                              }}
                            >
                              {ders.explicit_name || ders.name}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Chip
                                label={ders.section_number || ders.section || "A1"}
                                size="small"
                                sx={{
                                  height: 16,
                                  fontSize: "0.6rem",
                                  bgcolor: "rgba(33, 150, 243, 0.1)",
                                  color: "#1976d2",
                                  "& .MuiChip-label": { px: 0.5 },
                                }}
                              />
                              <LocationOn sx={{ fontSize: 8, color: "#666" }} />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: "0.65rem", lineHeight: 1.1 }}
                              >
                                {ders.building || 'Bina bilgisi yok'} - {ders.room || 'Sınıf bilgisi yok'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 0.3 }}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: "0.7rem", lineHeight: 1.2 }}
                            >
                              {ders.schedule ? getDaysText(ders.schedule) : 'Henüz planlanmamış'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} sx={{ textAlign: 'center', py: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            {loadingCourses ? 'Dersler yükleniyor...' : 'Henüz ders bulunmuyor'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Ders Güncelleme Dialog */}
      <Dialog 
        open={updateDialogOpen} 
        onClose={handleDialogClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <UpdateIcon color="primary" />
            <Typography variant="h6">Ders Güncelleme</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {loadingLectures ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              {/* Ders Seçimi */}
              {!selectedLecture ? (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Güncellenecek Dersi Seçin:
                  </Typography>
                  {(lecturerLectures || []).length > 0 ? (
                    (lecturerLectures || []).map((lecture) => (
                      <Card 
                        key={lecture.section_id}
                        sx={{ 
                          mb: 2, 
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.04)' }
                        }}
                        onClick={() => handleLectureSelect(lecture)}
                      >
                        <CardContent>
                          <Typography variant="h6">
                            {lecture.explicit_name || lecture.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Kod: {lecture.code} | Section ID: {lecture.section_id}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                      {loadingLectures ? 'Dersler yükleniyor...' : 'Henüz ders bulunmuyor'}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box>
                  {/* Seçilen Ders Bilgileri */}
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Seçilen Ders:</strong> {selectedLecture.explicit_name || selectedLecture.name} ({selectedLecture.code})
                    </Typography>
                  </Alert>

                  {/* Ders Saatleri */}
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Ders Saatleri:
                  </Typography>
                  
                  {(lectureHours || []).length > 0 ? (
                    (lectureHours || []).map((hour) => (
                      <Accordion key={hour.hour_id || hour.id || `hour-${hour.order}-${hour.day}`} sx={{ mb: 1 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <ScheduleIcon color="action" />
                            <Typography>
                              {hour.day} - {hour.time_start} / {hour.time_end} - Sıra: {hour.order}
                            </Typography>
                            <Button
                              size="small"
                              startIcon={<Edit />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditHour(hour);
                              }}
                            >
                              Düzenle
                            </Button>
                          </Box>
                        </AccordionSummary>
                      
                      <AccordionDetails>
                        {(editingHour?.hour_id === hour.hour_id || editingHour?.id === hour.id) ? (
                          <Grid container spacing={2}>
                            <Grid item xs={6} md={3}>
                              <TextField
                                label="Sıra"
                                type="number"
                                fullWidth
                                size="small"
                                value={hourFormData.order}
                                onChange={(e) => setHourFormData({...hourFormData, order: e.target.value})}
                              />
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <FormControl fullWidth size="small">
                                <InputLabel>Gün</InputLabel>
                                <Select
                                  value={hourFormData.day}
                                  onChange={(e) => setHourFormData({...hourFormData, day: e.target.value})}
                                  label="Gün"
                                >
                                  <MenuItem value="Monday">Pazartesi</MenuItem>
                                  <MenuItem value="Tuesday">Salı</MenuItem>
                                  <MenuItem value="Wednesday">Çarşamba</MenuItem>
                                  <MenuItem value="Thursday">Perşembe</MenuItem>
                                  <MenuItem value="Friday">Cuma</MenuItem>
                                  <MenuItem value="Saturday">Cumartesi</MenuItem>
                                  <MenuItem value="Sunday">Pazar</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <TextField
                                label="Başlangıç"
                                type="time"
                                fullWidth
                                size="small"
                                value={hourFormData.time_start}
                                onChange={(e) => setHourFormData({...hourFormData, time_start: e.target.value})}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <TextField
                                label="Bitiş"
                                type="time"
                                fullWidth
                                size="small"
                                value={hourFormData.time_end}
                                onChange={(e) => setHourFormData({...hourFormData, time_end: e.target.value})}
                                InputLabelProps={{ shrink: true }}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                label="Sınıf ID"
                                fullWidth
                                size="small"
                                value={hourFormData.classroom_id}
                                onChange={(e) => setHourFormData({...hourFormData, classroom_id: e.target.value})}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  variant="contained"
                                  startIcon={<SaveIcon />}
                                  onClick={handleSaveHour}
                                  size="small"
                                >
                                  Kaydet
                                </Button>
                                <Button
                                  variant="outlined"
                                  onClick={() => setEditingHour(null)}
                                  size="small"
                                >
                                  İptal
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        ) : (
                          <Box>
                            <Typography variant="body2">
                              <strong>Gün:</strong> {hour.day}<br />
                              <strong>Saat:</strong> {hour.time_start} - {hour.time_end}<br />
                              <strong>Sıra:</strong> {hour.order}<br />
                              <strong>Sınıf ID:</strong> {hour.classroom_id}
                            </Typography>
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                    {loadingHours ? 'Saatler yükleniyor...' : 'Bu ders için henüz saat bilgisi yok'}
                  </Typography>
                )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          {selectedLecture && (
            <Button onClick={() => setSelectedLecture(null)}>
              Ders Seçimine Dön
            </Button>
          )}
          <Button onClick={handleDialogClose}>
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DersVeDönemIslemleri;
