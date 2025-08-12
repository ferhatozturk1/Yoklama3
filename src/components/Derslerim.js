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
import { useAuth } from "../contexts/AuthContext";
import { fetchDepartmentLectures } from "../api/schedule";
import { getLecturerProfile, getUniversities, getFaculties, getDepartments, getBuildings, getClassrooms } from "../api/auth";
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
  const { user, accessToken, loadUserProfile, isLoading: authLoading, setUser } = useAuth();
  
  const isUuid = (v) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
  
  // Helper: department anahtarını çöz (isim öncelikli)
  const resolveDeptKey = (src) => {
    if (!src) return undefined;
    // Önce ID'yi bul (UUID)
    const deptId = src.department_id ||
      src.departmentId ||
      (src.department && src.department.id);
    
    if (deptId) return deptId;
    
    // ID bulunamazsa isim döndür (ama backend UUID bekliyor)
    return (
      src.department_name ||
      src.departmentName ||
      (typeof src.department === 'string' ? src.department : undefined)
    );
  };
  
  // Department adından ID çöz (gerekirse, ama artık isim de kullanılabilir)
  const resolveDeptIdFromNames = async (src) => {
    try {
      const departmentName = src?.department || src?.departmentName || src?.department_name;
      const facultyName = src?.faculty || src?.facultyName;
      const universityName = src?.university || src?.universityName;
      if (!departmentName || !facultyName || !universityName) return undefined;

      const universities = await getUniversities();
      const uni = (universities || []).find(u => u.name?.toLowerCase() === String(universityName).toLowerCase());
      if (!uni?.id) return undefined;
      const faculties = await getFaculties(uni.id);
      const fac = (faculties || []).find(f => f.name?.toLowerCase() === String(facultyName).toLowerCase());
      if (!fac?.id) return undefined;
      const departments = await getDepartments(fac.id);
      const dept = (departments || []).find(d => d.name?.toLowerCase() === String(departmentName).toLowerCase());
      return dept?.id;
    } catch {
      return undefined;
    }
  };
  
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

  const [dersler, setDersler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // department anahtarını (isim/id) güvenle elde et
      let departmentKey = resolveDeptKey(user);
      if (!departmentKey) {
        const storedUser = (() => { try { return JSON.parse(sessionStorage.getItem('user')); } catch { return null; } })();
        departmentKey = resolveDeptKey(storedUser) || departmentKey;
      }
      const pendingDepartmentId = sessionStorage.getItem('pendingDepartmentId') || null;
      if (!departmentKey && pendingDepartmentId) {
        departmentKey = pendingDepartmentId; // id olabilir, sorun değil
      }
      
      // Hala yoksa profil tazele ve isimlerden çözmeyi dene
      if (!departmentKey && accessToken && user?.id) {
        try {
          const prof = typeof loadUserProfile === 'function' ? await loadUserProfile(false) : null;
          departmentKey = resolveDeptKey(prof) || departmentKey;
        } catch {}
        if (!departmentKey) {
          const derivedId = await resolveDeptIdFromNames(user) || await resolveDeptIdFromNames((() => { try { return JSON.parse(sessionStorage.getItem('user')); } catch { return null; } })());
          if (derivedId) {
            departmentKey = derivedId;
            const merged = { ...(JSON.parse(sessionStorage.getItem('user') || 'null') || {}), department_id: derivedId, departmentId: derivedId };
            sessionStorage.setItem('user', JSON.stringify(merged));
            if (setUser) setUser({ ...user, department_id: derivedId, departmentId: derivedId });
          }
        }
      }
      
      console.log("🔍 Dersler yükleniyor (department key - ad veya id)...", { 
        userId: user?.id, 
        departmentKey, 
        accessToken: !!accessToken,
        accessTokenPrefix: accessToken ? accessToken.substring(0, 10) + "..." : "null"
      });

      // Debug: User nesnesindeki university bilgilerini kontrol et
      console.log("🔍 DEBUG - User university bilgileri:", {
        university_id: user?.university_id,
        university: user?.university,
        universityId: user?.universityId,
        fullUserObject: user
      });

      const normalizeLectures = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.results)) return data.results;
        if (Array.isArray(data?.lectures)) return data.lectures;
        if (Array.isArray(data?.items)) return data.items;
        if (typeof data === 'object' && data.id) return [data];
        if (typeof data === 'object') {
          const values = Object.values(data);
          if (values.length && values.every(v => typeof v === 'object')) {
            return values;
          }
        }
        return [];
      };
      
      if (!accessToken) {
        setError("Access token bulunamadı");
        setLoading(false);
        return;
      }
      if (!departmentKey) {
        setError("Departman bilgisi bulunamadı. Lütfen tekrar deneyin.");
        setLoading(false);
        return;
      }

      // Bölüm anahtarı (ad ya da id) ile endpoint'e git
      const lecturesRaw = await fetchDepartmentLectures(departmentKey, accessToken);
      console.log("✅ Backend'ten dersler alındı");
      console.log("📊 Raw API Data:", lecturesRaw);
      const lecturesArray = normalizeLectures(lecturesRaw);
      console.log("📏 Normalize edilmiş ders sayısı:", lecturesArray.length);
      console.log("🧪 İlk ders (normalize):", lecturesArray[0]);

      const transformedCourses = lecturesArray.map((course) => ({
        id: course.id,
        name: course.explicit_name || course.name || course.course_name || course.lecture_name || "Ders",
        code: course.code || course.course_code || course.lecture_code || "DERS",
        section: course.section || course.section_name || course.section_code || "A1",
        sectionFull: `YP-${course.section || course.section_name || "A1"}`,
        building: course.building?.name || course.building || null,
        room: course.room?.name || course.room || null,
        class: `${course.classLevel || 1}-A`,
        instructor: course.instructor?.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || "Öğretim Üyesi",
        schedule: {},
        totalWeeks: 15,
        currentWeek: 1,
        studentCount: Math.floor(Math.random() * 30) + 20,
        attendanceStatus: "not_taken",
        lastAttendance: null,
        attendanceRate: 0,
        files: [],
      }));

      setDersler(transformedCourses);
      
      // Bina verilerini çek (üniversite ID'si gerekli)
      try {
        // University ID'yi farklı kaynaklardan almaya çalış
        let universityId = user?.university_id || 
                          user?.university?.id || 
                          user?.universityId;
        
        // Eğer bulunamazsa sessionStorage'dan da kontrol et
        if (!universityId) {
          const storedUser = (() => { 
            try { 
              return JSON.parse(sessionStorage.getItem('user')); 
            } catch { 
              return null; 
            } 
          })();
          universityId = storedUser?.university_id || 
                        storedUser?.university?.id || 
                        storedUser?.universityId;
        }

        // Eğer hala bulunamazsa kullanıcı profilini tazele ve tekrar dene
        if (!universityId && accessToken && user?.id) {
          console.log("🔄 University ID bulunamadı, profil tazeleniyor...");
          try {
            const freshProfile = typeof loadUserProfile === 'function' ? await loadUserProfile(true) : null;
            console.log("📊 Tazelenen profil verisi:", freshProfile);
            
            // FreshProfile'dan university_id'yi al
            universityId = freshProfile?.university_id || 
                          freshProfile?.university?.id || 
                          freshProfile?.universityId;
            
            console.log("🆔 Tazelen profil University ID:", universityId);
            
            // Eğer freshProfile'da university_id varsa user state'ini de güncelle
            if (freshProfile && (freshProfile.university_id || freshProfile.university?.id)) {
              const updatedUser = {
                ...user,
                ...freshProfile,
                university_id: freshProfile.university_id || freshProfile.university?.id
              };
              console.log("🔄 User state güncelleniyor:", updatedUser);
              if (setUser) setUser(updatedUser);
              
              // SessionStorage'ı da güncelle
              try {
                sessionStorage.setItem('user', JSON.stringify(updatedUser));
              } catch (storageError) {
                console.warn("⚠️ SessionStorage güncellenemedi:", storageError);
              }
            }
          } catch (profileError) {
            console.error("❌ Profil tazeleme hatası:", profileError);
          }
        }

        if (universityId) {
          console.log("🏢 Bina verileri çekiliyor, University ID:", universityId);
          const buildingsData = await getBuildings(universityId, accessToken);
          setBuildings(buildingsData);
          console.log("✅ Bina verileri alındı:", buildingsData);
          
          // Her bina için sınıf verilerini çek
          if (buildingsData.length > 0) {
            console.log("🚪 Sınıf verileri çekiliyor...");
            const allClassrooms = [];
            for (const building of buildingsData) {
              try {
                const buildingClassrooms = await getClassrooms(building.id, accessToken);
                allClassrooms.push(...buildingClassrooms.map(classroom => ({
                  ...classroom,
                  buildingId: building.id,
                  buildingName: building.name
                })));
              } catch (classroomError) {
                console.error(`❌ ${building.name} binası için sınıflar çekilemedi:`, classroomError);
              }
            }
            setClassrooms(allClassrooms);
            console.log("✅ Tüm sınıf verileri alındı:", allClassrooms);
          }
        } else {
          // University ID bulunamazsa Postman'deki ID'yi kullan
          console.warn("⚠️ University ID bulunamadı, hard-coded ID kullanılıyor...");
          const hardcodedUniversityId = "bae612be-cd3c-4d37-825c-d394e3859009";
          try {
            console.log("🏢 Hard-coded University ID ile bina verileri çekiliyor:", hardcodedUniversityId);
            const buildingsData = await getBuildings(hardcodedUniversityId, accessToken);
            setBuildings(buildingsData);
            console.log("✅ Hard-coded ID ile bina verileri alındı:", buildingsData);
            
            // Her bina için sınıf verilerini çek
            if (buildingsData.length > 0) {
              console.log("🚪 Sınıf verileri çekiliyor...");
              const allClassrooms = [];
              for (const building of buildingsData) {
                try {
                  const buildingClassrooms = await getClassrooms(building.id, accessToken);
                  allClassrooms.push(...buildingClassrooms.map(classroom => ({
                    ...classroom,
                    buildingId: building.id,
                    buildingName: building.name
                  })));
                } catch (classroomError) {
                  console.error(`❌ ${building.name} binası için sınıflar çekilemedi:`, classroomError);
                }
              }
              setClassrooms(allClassrooms);
              console.log("✅ Hard-coded ID ile tüm sınıf verileri alındı:", allClassrooms);
            }
          } catch (hardcodedError) {
            console.error("❌ Hard-coded University ID ile de hata:", hardcodedError);
          }
          
          console.warn("👤 User nesnesindeki university bilgileri:", {
            university_id: user?.university_id,
            university: user?.university,
            universityId: user?.universityId,
            fullUser: user
          });
        }
      } catch (buildingError) {
        console.error("❌ Bina verilerini çekerken hata:", buildingError);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Basit yeniden dene
  const handleRetry = () => {
    fetchCourses();
  };

  // Load courses from backend and localStorage
  useEffect(() => {
    if (!user || !accessToken || authLoading) return;
    fetchCourses();

    // Also load courses from localStorage and combine
    const loadLocalCourses = () => {
      const activeCourses = JSON.parse(
        localStorage.getItem("activeCourses") || "[]"
      );

      if (activeCourses.length > 0) {
        // Convert active courses to the format expected by Derslerim
        const convertedCourses = activeCourses.map((course) => ({
          id: course.id || Date.now() + Math.random(),
          name: course.courseName || course.courseTitle || course.explicit_name,
          code: course.courseCode,
          section: course.section,
          sectionFull: `YP-${course.section}`,
          building: null, // Will be updated with API data
          room: null, // Will be updated with API data
          class: `${course.classLevel || 1}-A`,
          instructor: course.instructor || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || "Öğretim Üyesi",
          schedule: {
            // Convert days array to schedule object
            ...(course.days && course.days.length > 0
              ? {
                  [course.days[0]?.toLowerCase()]: [
                    {
                      startTime: course.times?.split("-")[0] || "08:40",
                      endTime: course.times?.split("-")[1] || "09:30",
                      room: null, // Will be updated with API data
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

        // Combine backend courses with converted active courses
        setDersler(prevDersler => [...prevDersler, ...convertedCourses]);
      }
    };

    loadLocalCourses();

    // Listen for localStorage changes
    const handleStorageChange = () => {
      loadLocalCourses();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("teacherCoursesUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("teacherCoursesUpdated", handleStorageChange);
    };
  }, [user?.department_id, user?.id, user?.university_id, user?.university?.id, accessToken, authLoading]);

  // Buildings ve classrooms state değiştiğinde derslerdeki building ve room bilgilerini güncelle
  useEffect(() => {
    if (buildings.length > 0 && classrooms.length > 0 && dersler.length > 0) {
      console.log("🏢🚪 Building ve classroom verileri ile dersler güncelleniyor...");
      setDersler(prevDersler => 
        prevDersler.map(ders => {
          // Eğer ders zaten building ve room bilgisine sahipse güncelleme
          if (ders.building && ders.room) {
            return ders;
          }
          
          // API'den gelen derslerin building/room bilgisi yoksa rastgele ata
          const randomClassroom = classrooms[Math.floor(Math.random() * classrooms.length)];
          return {
            ...ders,
            building: randomClassroom?.buildingName || ders.building || "Bina bilgisi güncelleniyor",
            room: randomClassroom?.name || ders.room || "Sınıf bilgisi güncelleniyor"
          };
        })
      );
    }
  }, [buildings, classrooms]);

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

  // Hata görünümü
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: '#dc2626', fontWeight: 700, mb: 2 }}>
          Dersler yüklenirken hata oluştu
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 3 }}>
          {error}
        </Typography>
        <Button variant="contained" onClick={handleRetry}>Tekrar Dene</Button>
      </Container>
    );
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

      {/* Loading State */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Dersler yükleniyor...
          </Typography>
        </Box>
      )}

      {/* Responsive Course Grid */}
      {!loading && !error && (
        <Grid container spacing={{ xs: 1, sm: 1.5, md: 2, lg: 2.5, xl: 3 }}>
          {dersler.length === 0 ? (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 8,
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Henüz ders bulunmuyor
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sistem yöneticisiyle iletişime geçin veya daha sonra tekrar deneyin.
                </Typography>
              </Box>
            </Grid>
          ) : (
            dersler.map((ders) => (
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
                          mt:1,
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
                        {ders.building && ders.room 
                          ? `${ders.building} - ${ders.room}`
                          : "Konum güncelleniyor..."
                        }
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
            ))
          )}
        </Grid>
      )}

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
