import React, { useState, useEffect } from "react";

import { useAuth } from "../contexts/AuthContext";
import { fetchLecturerLecturesNew } from "../api/schedule";
import { getSectionDetails, getSectionHours } from "../api/auth";
import {
  Container,
  Typography,
  Box,
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  LinearProgress,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  ExpandMore as ExpandMoreIcon,
  CalendarToday as CalendarIcon,
  QrCode as QrCodeIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

const AnaSayfa = ({
  onSectionChange,
  onNavigate,
  selectedSemester = "2025-2026-Güz",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedDay, setExpandedDay] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(8); // Şu anki hafta (8. hafta)

  const { user, accessToken } = useAuth();

  // Ders saat slotları (getRealScheduleData içinde kullanılmadan önce tanımlı olmalı)
  const timeSlots = [
    "08:40",
    "09:30",
    "09:40", // Programming Language Concepts - Salı
    "09:50",
    "10:40",
    "11:00",
    "11:40", // Programming Language Concepts - Çarşamba
    "11:50",
    "12:40", // Data Structures - Pazartesi
    "13:40",
    "14:30",
    "14:40",
    "15:30",
    "15:40",
    "16:30",
    "16:40",
    "17:30",
  ];

  // Backend'den ders programını çek ve haftalık programa dönüştür
  const [apiWeeklySchedule, setApiWeeklySchedule] = useState(null);
  const [scheduleError, setScheduleError] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  useEffect(() => {
    // API response'u normalize etmek için Derslerim ile aynı fonksiyon
    const normalizeLectures = (data) => {
      console.log('🔄 ANASAYFA normalizeLectures - Input data:', data);

      if (!data) return [];

      // Yeni API formatı: { id: "...", sections: [...] }
      if (data.sections && Array.isArray(data.sections)) {
        console.log('📋 ANASAYFA: New API format detected - sections array found');
        const lectures = data.sections.map(section => {
          // Her section içindeki lecture bilgisini al ve section bilgisini ekle
          return {
            ...section.lecture, // lecture bilgileri (id, name, code, explicit_name)
            section_id: section.id, // section ID'si
            section_number: section.section_number, // section numarası
            // Eski format uyumluluğu için
            id: section.lecture.id,
            name: section.lecture.explicit_name || section.lecture.name,
            course_name: section.lecture.explicit_name || section.lecture.name,
            lecture_name: section.lecture.explicit_name || section.lecture.name,
            code: section.lecture.code,
            lecture_code: section.lecture.code,
            section: section.section_number,
            section_name: section.section_number,
            section_code: section.section_number
          };
        });
        console.log('✅ ANASAYFA: Converted sections to lectures:', lectures);
        return lectures;
      }

      // Eski format backward compatibility
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

      console.warn('⚠️ ANASAYFA: Unknown data format, returning empty array');
      return [];
    };

    const loadSchedule = async () => {
      console.log('🔄 ANASAYFA: loadSchedule çağırıldı!', {
        lecturerId: user?.lecturer_id,
        hasToken: !!accessToken,
        timestamp: new Date().toISOString()
      });

      if (!user?.lecturer_id || !accessToken) {
        console.log('❌ Lecturer ID veya accessToken eksik:', { lecturerId: user?.lecturer_id, hasToken: !!accessToken });
        return;
      }

      try {
        setScheduleLoading(true);
        setScheduleError(null);

        console.log('🎯 ANASAYFA: Derslerim ile aynı API kullanılıyor - fetchLecturerLecturesNew');
        console.log('👨‍🏫 Lecturer ID:', user.lecturer_id);

        // Derslerim ile aynı API kullan
        const lecturesRaw = await fetchLecturerLecturesNew(user.lecturer_id, accessToken);
        console.log('✅ ANASAYFA: Raw lectures data received:', lecturesRaw);

        // API response'u normalize et
        const lecturesArray = normalizeLectures(lecturesRaw);
        console.log('✅ ANASAYFA: Normalized lectures array:', lecturesArray);

        // Derslerden haftalık program oluştur
        const weeklySchedule = {
          Pazartesi: [],
          Salı: [],
          Çarşamba: [],
          Perşembe: [],
          Cuma: [],
          Cumartesi: [],
          Pazar: []
        };

        // Her ders için section detaylarını çek ve program oluştur
        for (const course of lecturesArray) {
          if (course.section_id && accessToken) {
            try {
              console.log('🔍 ANASAYFA: Fetching section hours for:', course.section_id);
              const hoursData = await getSectionHours(course.section_id, accessToken);

              if (hoursData && hoursData.length > 0) {
                const dayMapping = {
                  'monday': 'Pazartesi',
                  'tuesday': 'Salı',
                  'wednesday': 'Çarşamba',
                  'thursday': 'Perşembe',
                  'friday': 'Cuma',
                  'saturday': 'Cumartesi',
                  'sunday': 'Pazar'
                };

                hoursData.forEach(hour => {
                  const dayName = dayMapping[hour.day?.toLowerCase()] || hour.day;

                  if (dayName && weeklySchedule[dayName]) {
                    let timeSlot = '';
                    if (hour.time_start && hour.time_end) {
                      const startTime = hour.time_start.length > 5 ? hour.time_start.substring(0, 5) : hour.time_start;
                      const endTime = hour.time_end.length > 5 ? hour.time_end.substring(0, 5) : hour.time_end;
                      timeSlot = `${startTime} - ${endTime}`;
                    }

                    // Ders bilgisini program slot'una ekle
                    weeklySchedule[dayName].push({
                      id: course.id,
                      name: course.explicit_name || course.name || "Ders",
                      code: course.code || course.course_code || "DERS",
                      time: timeSlot,
                      startTime: hour.time_start,
                      endTime: hour.time_end,
                      building: course.building?.name || course.building || "",
                      room: course.room?.name || course.room || "",
                      section: course.section || "A1"
                    });
                  }
                });
              }
            } catch (sectionError) {
              console.error('❌ ANASAYFA: Section hours fetch error:', sectionError);
            }
          }
        }

        console.log('✅ ANASAYFA: Weekly schedule created:', weeklySchedule);
        setApiWeeklySchedule(weeklySchedule);

        // Debug: Veri var mı kontrol et
        const hasData = weeklySchedule && Object.values(weeklySchedule).some(dayEntries => dayEntries.length > 0);
        console.log('📊 ANASAYFA: Program verisi var mı?', hasData);
        if (!hasData) {
          console.warn('⚠️ ANASAYFA: Hiç ders verisi yok!');
        }

      } catch (e) {
        console.error("❌ ANASAYFA: Ders programı yükleme hatası:", e);
        setScheduleError(e.message);
        setApiWeeklySchedule(null);
      } finally {
        setScheduleLoading(false);
      }
    };

    // Sadece user.lecturer_id ve accessToken değiştiğinde çalıştır, diğer değişikliklerden etkilenme
    loadSchedule();
  }, [user?.lecturer_id, accessToken]); // Sadece bu iki değer değiştiğinde çalışsın

  // Debug: user ve accessToken değişimlerini logla
  useEffect(() => {
    console.log('👤 ANASAYFA: User değişti:', {
      lecturer_id: user?.lecturer_id,
      name: user?.name,
      timestamp: new Date().toISOString()
    });
  }, [user]);

  useEffect(() => {
    console.log('🔑 ANASAYFA: AccessToken değişti:', {
      hasToken: !!accessToken,
      tokenLength: accessToken?.length,
      timestamp: new Date().toISOString()
    });
  }, [accessToken]);

  // Profile photo URL'ini düzelt - Backend'den gelen relative path'i tam URL'e çevir
  const getProfilePhotoUrl = (photoPath) => {
    if (!photoPath) {
      return null;
    }
    if (photoPath.startsWith('http')) {
      return photoPath;
    }
    const fullUrl = `http://127.0.0.1:8000${photoPath}`;
    return fullUrl;
  };

  // Debug: Backend'den gelen user bilgilerini kontrol et
  // console debug gürültüsünü azaltmak için kapatıldı

  // QR Code System States
  const [yoklamaDialog, setYoklamaDialog] = useState(false);
  const [currentQRCode, setCurrentQRCode] = useState("");
  const [qrTimer, setQrTimer] = useState(5);
  const [attendanceList, setAttendanceList] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check if current date is a national holiday
  const getNationalHoliday = (date) => {
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const day = date.getDate();

    const holidays = {
      "1-1": "Yılbaşı",
      "4-23": "23 Nisan Ulusal Egemenlik ve Çocuk Bayramı",
      "5-1": "1 Mayıs Emek ve Dayanışma Günü",
      "5-19": "19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramı",
      "8-30": "30 Ağustos Zafer Bayramı",
      "10-29": "29 Ekim Cumhuriyet Bayramı",
      "11-10": "10 Kasım Atatürk'ü Anma Günü",
    };

    const key = `${month}-${day}`;
    return holidays[key] || null;
  };

  const currentHoliday = getNationalHoliday(currentTime);

  // Check if a specific day is a holiday
  const isDayHoliday = (dayIndex) => {
    const today = new Date();
    const currentDayIndex = today.getDay() - 1; // Convert Sunday=0 to Monday=0

    // If it's the current day and there's a holiday, return the holiday
    if (dayIndex === currentDayIndex && currentHoliday) {
      return currentHoliday;
    }

    return null;
  };

  // QR Code generation and timer
  useEffect(() => {
    let qrInterval;
    let timerInterval;

    if (yoklamaDialog && activeLesson) {
      // Generate initial QR code
      generateNewQRCode();

      // QR code regeneration every 5 seconds
      qrInterval = setInterval(() => {
        generateNewQRCode();
        setQrTimer(5);
      }, 5000);

      // Timer countdown
      timerInterval = setInterval(() => {
        setQrTimer((prev) => (prev > 0 ? prev - 1 : 5));
      }, 1000);
    }

    return () => {
      if (qrInterval) clearInterval(qrInterval);
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [yoklamaDialog, activeLesson]);

  // Generate new QR code
  const generateNewQRCode = () => {
    const timestamp = Date.now();
    let lessonText = 'LESSON';

    if (activeLesson?.lesson) {
      if (typeof activeLesson.lesson === 'string') {
        lessonText = activeLesson.lesson;
      } else if (typeof activeLesson.lesson === 'object') {
        lessonText = activeLesson.lesson.name || activeLesson.lesson.code || 'LESSON';
      }
    }

    const lessonId = lessonText.split("\n")[0] || "LESSON";
    const qrData = `ATTENDANCE_${lessonId}_${timestamp}`;
    setCurrentQRCode(qrData);
  };

  // Handle attendance taking
  const handleYoklamaAl = (lesson) => {
    setActiveLesson(lesson);
    setAttendanceList([]);
    setYoklamaDialog(true);
  };

  // Simulate student attendance (for demo)
  const simulateStudentAttendance = () => {
    const students = [
      "Ahmet Yılmaz - 2021001",
      "Ayşe Kaya - 2021002",
      "Mehmet Demir - 2021003",
      "Fatma Şahin - 2021004",
      "Ali Özkan - 2021005",
    ];

    const randomStudent = students[Math.floor(Math.random() * students.length)];
    const timestamp = new Date().toLocaleTimeString("tr-TR");

    if (!attendanceList.find((item) => item.student === randomStudent)) {
      setAttendanceList((prev) => [
        ...prev,
        {
          student: randomStudent,
          time: timestamp,
          qrCode: currentQRCode,
        },
      ]);
    }
  };

  // Close attendance dialog
  const handleCloseYoklama = () => {
    setYoklamaDialog(false);
    setActiveLesson(null);
    setAttendanceList([]);
    setCurrentQRCode("");
    setQrTimer(5);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedDay(isExpanded ? panel : false);
  };

  // Get real schedule data from API or course data
  const getRealScheduleData = () => {
    // API'den gelen veriyi tablo formatına çevir
    if (apiWeeklySchedule) {
      // Sadece veri boşsa log yaz
      const hasData = Object.values(apiWeeklySchedule).some(dayEntries => dayEntries.length > 0);
      if (!hasData) {
        console.log('📅 API verisi boş, boş tablo döndürülüyor');
      }

      const dayMap = {
        'Pazartesi': 'pazartesi',
        'Salı': 'sali',
        'Çarşamba': 'carsamba',
        'Perşembe': 'persembe',
        'Cuma': 'cuma'
      };

      // Boş tablo yapısı oluştur
      const base = {};
      timeSlots.forEach(ts => {
        base[ts] = {
          pazartesi: '',
          sali: '',
          carsamba: '',
          persembe: '',
          cuma: ''
        };
      });

      // API verisini tabloya doldur
      Object.entries(apiWeeklySchedule).forEach(([dayTr, items]) => {
        const dayKey = dayMap[dayTr];
        if (!dayKey) return;

        console.log(`🔍 ${dayTr} günü için ${items?.length || 0} ders bulundu:`, items);

        (items || []).forEach(item => {
          // API'den gelen startTime'ı kullan
          const startTime = item.startTime;

          console.log(`🕐 Processing course: ${item.name}, startTime: ${startTime}, endTime: ${item.endTime}`);

          if (startTime) {
            // startTime'ı timeSlots'ta ara
            const cleanStartTime = startTime.length > 5 ? startTime.substring(0, 5) : startTime;
            const matchingSlot = timeSlots.find(slot => {
              return slot === cleanStartTime;
            });

            console.log(`🔍 Looking for slot "${cleanStartTime}" in timeSlots:`, timeSlots);
            console.log(`🎯 Matching slot found: ${matchingSlot}`);

            if (matchingSlot) {
              // Sadece ders adını göster, saat bilgisini kaldır
              const courseName = item.name || item.code || 'Bilinmeyen Ders';
              const room = item.room ? ` - ${item.room}` : '';

              base[matchingSlot][dayKey] = `${courseName}${room}`;

              console.log(`✅ AnaSayfa Program: ${dayTr} ${matchingSlot} -> ${courseName}${room}`);
            } else {
              console.warn(`❌ Time slot bulunamadı: "${cleanStartTime}" for ${item.name}`);
              console.log('🔍 Available slots:', timeSlots);
              console.log('🔍 Looking for:', cleanStartTime);
            }
          } else {
            console.warn(`⚠️ StartTime bulunamadı for ${item.name}`);
          }
        });
      });

      return base;
    }

    // Loading durumu için boş tablo
    if (scheduleLoading) {
      const base = {};
      timeSlots.forEach(ts => {
        base[ts] = {
          pazartesi: '',
          sali: '',
          carsamba: '',
          persembe: '',
          cuma: ''
        };
      });
      return base;
    }

    // Hata durumu için boş tablo
    if (scheduleError) {
      const base = {};
      timeSlots.forEach(ts => {
        base[ts] = {
          pazartesi: '',
          sali: '',
          carsamba: '',
          persembe: '',
          cuma: ''
        };
      });
      return base;
    }

    // Fallback: boş tablo
    const base = {};
    timeSlots.forEach(ts => {
      base[ts] = {
        pazartesi: '',
        sali: '',
        carsamba: '',
        persembe: '',
        cuma: ''
      };
    });
    return base;
  };

  const baseSchedule = React.useMemo(() => getRealScheduleData(), [apiWeeklySchedule, scheduleLoading, scheduleError]);

  const dayKeys = ["pazartesi", "sali", "carsamba", "persembe", "cuma"];

  // Generate dynamic schedule with holidays (memoized)
  const weeklySchedule = React.useMemo(() => {
    const schedule = {};

    Object.keys(baseSchedule).forEach((timeSlot) => {
      schedule[timeSlot] = {};
      dayKeys.forEach((dayKey, dayIndex) => {
        const dayHoliday = isDayHoliday(dayIndex);
        if (dayHoliday) {
          schedule[timeSlot][dayKey] = dayHoliday;
        } else {
          schedule[timeSlot][dayKey] = baseSchedule[timeSlot][dayKey];
        }
      });
    });

    return schedule;
  }, [baseSchedule]);

  // Function to calculate end time for each time slot
  const getEndTime = (startTime) => {
    const [hour, minute] = startTime.split(":").map(Number);
    const endMinute = minute + 45; // Each class is 45 minutes

    if (endMinute >= 60) {
      return `${String(hour + 1).padStart(2, "0")}:${String(
        endMinute - 60
      ).padStart(2, "0")}`;
    } else {
      return `${String(hour).padStart(2, "0")}:${String(endMinute).padStart(
        2,
        "0"
      )}`;
    }
  };
  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

  // Get lesson status for visual indicators
  const getLessonStatus = (timeSlot, dayKey) => {
    const currentTimeNum =
      currentTime.getHours() * 100 + currentTime.getMinutes();
    const currentDay = dayKeys[currentTime.getDay() - 1];
    const [hour, minute] = timeSlot.split(":").map(Number);
    const slotTime = hour * 100 + minute;
    const endTime = slotTime + 50;
    const lesson = weeklySchedule[timeSlot][dayKey];

    if (!lesson) return "empty";

    let lessonText = '';
    if (typeof lesson === 'string') {
      lessonText = lesson;
    } else if (typeof lesson === 'object' && lesson !== null) {
      lessonText = lesson.name || lesson.code || '';
    }

    if (
      lessonText.includes("Bayram") ||
      lessonText.includes("Tatil") ||
      lessonText.includes("Nisan") ||
      lessonText.includes("Mayıs") ||
      lessonText.includes("Ağustos") ||
      lessonText.includes("Ekim") ||
      lessonText.includes("Kasım") ||
      lessonText.includes("Yılbaşı")
    )
      return "holiday";
    if (currentDay !== dayKey) return "regular";

    if (currentTimeNum >= slotTime && currentTimeNum <= endTime) {
      return "current";
    } else if (currentTimeNum < slotTime) {
      return "upcoming";
    } else {
      return "completed";
    }
  };

  // Get current class
  const getCurrentClass = () => {
    const currentTimeNum =
      currentTime.getHours() * 100 + currentTime.getMinutes();
    const currentDay = dayKeys[currentTime.getDay() - 1];

    if (!currentDay) return null;

    for (const timeSlot of timeSlots) {
      const [hour, minute] = timeSlot.split(":").map(Number);
      const slotTime = hour * 100 + minute;
      const endTime = slotTime + 50;

      if (currentTimeNum >= slotTime && currentTimeNum <= endTime) {
        const lesson = weeklySchedule[timeSlot][currentDay];
        let lessonText = '';
        if (typeof lesson === 'string') {
          lessonText = lesson;
        } else if (typeof lesson === 'object' && lesson !== null) {
          lessonText = lesson.name || lesson.code || '';
        }

        if (lesson && !lessonText.includes("Bayram")) {
          const remainingMinutes =
            Math.floor((endTime - currentTimeNum) / 100) * 60 +
            ((endTime - currentTimeNum) % 100);
          const progressPercent = ((currentTimeNum - slotTime) / 50) * 100;
          return {
            lesson,
            time: timeSlot,
            remainingMinutes: Math.max(0, remainingMinutes),
            progressPercent: Math.min(100, Math.max(0, progressPercent)),
          };
        }
      }
    }
    return null;
  };

  // Get next class
  const getNextClass = () => {
    const currentTimeNum =
      currentTime.getHours() * 100 + currentTime.getMinutes();
    const currentDay = dayKeys[currentTime.getDay() - 1];

    if (!currentDay) return null;

    for (const timeSlot of timeSlots) {
      const [hour, minute] = timeSlot.split(":").map(Number);
      const slotTime = hour * 100 + minute;

      if (currentTimeNum < slotTime) {
        const lesson = weeklySchedule[timeSlot][currentDay];
        let lessonText = '';
        if (typeof lesson === 'string') {
          lessonText = lesson;
        } else if (typeof lesson === 'object' && lesson !== null) {
          lessonText = lesson.name || lesson.code || '';
        }

        if (lesson && !lessonText.includes("Bayram")) {
          const minutesUntil =
            Math.floor((slotTime - currentTimeNum) / 100) * 60 +
            ((slotTime - currentTimeNum) % 100);
          return {
            lesson,
            time: timeSlot,
            minutesUntil,
          };
        }
      }
    }
    return null;
  };

  const currentClass = getCurrentClass();

  // Three Block Header
  const WelcomeHeader = () => {
    const nextClass = getNextClass();

    // Function to handle lesson click
    const handleLessonBlockClick = () => {
      if (currentClass) {
        handleLessonClick(
          currentClass.lesson,
          currentClass.time,
          dayKeys[currentTime.getDay() - 1]
        );
      } else if (nextClass) {
        handleLessonClick(
          nextClass.lesson,
          nextClass.time,
          dayKeys[currentTime.getDay() - 1]
        );
      } else {
        handleLessonClick("MATH113/3\nYP-A1", "08:40", "pazartesi");
      }
    };

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 1 : 2,
          mb: isMobile ? 1.5 : 2,
          justifyContent: "space-between",
        }}
      >
        {/* Left - Time Info */}
        <Paper
          elevation={2}
          sx={{
            flex: 1,
            p: isMobile ? 1 : 1.5,
            background: "linear-gradient(135deg, #1B2E6D 0%, #4A90E2 100%)",
            borderRadius: "8px",
            color: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
            textAlign: "center",
            minWidth: isMobile ? "auto" : "160px",
          }}
        >
          <Typography
            variant={isMobile ? "body2" : "body1"}
            sx={{
              fontWeight: 500,
              mb: 0.3,
              fontSize: currentHoliday
                ? isMobile
                  ? "0.75rem"
                  : "0.95rem"
                : isMobile
                  ? "0.85rem"
                  : "1rem",
              lineHeight: 1.2,
            }}
          >
            {currentHoliday || currentTime.toLocaleTimeString("tr-TR")}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              opacity: 0.9,
              fontSize: isMobile ? "0.65rem" : "0.75rem",
              lineHeight: 1.2,
            }}
          >
            {currentTime.toLocaleDateString("tr-TR", {
              weekday: isMobile ? "short" : "long",
              day: "numeric",
              month: isMobile ? "short" : "long",
            })}
          </Typography>
        </Paper>

        {/* Center - Week Selector */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            flex: isMobile ? 0 : 1,
          }}
        >
          <IconButton
            onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
            size="small"
            disabled={currentWeek <= 1}
            sx={{
              bgcolor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              "&:hover": { bgcolor: "#f5f5f5" },
              "&:disabled": { bgcolor: "#f5f5f5", opacity: 0.5 },
              width: isMobile ? 28 : 32,
              height: isMobile ? 28 : 32,
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>

          <FormControl size="small" sx={{ minWidth: isMobile ? 90 : 120 }}>
            <Select
              value={currentWeek}
              onChange={(e) => setCurrentWeek(e.target.value)}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 200,
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#f1f1f1",
                      borderRadius: "3px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#c1c1c1",
                      borderRadius: "3px",
                      "&:hover": {
                        background: "#a8a8a8",
                      },
                    },
                  },
                },
              }}
              sx={{
                bgcolor: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #e0e0e0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #1976d2",
                },
                height: isMobile ? 28 : 32,
                fontSize: isMobile ? "0.75rem" : "0.875rem",
              }}
            >
              <MenuItem value={1}>1.Hafta</MenuItem>
              <MenuItem value={2}>2.Hafta</MenuItem>
              <MenuItem value={3}>3.Hafta</MenuItem>
              <MenuItem value={4}>4.Hafta</MenuItem>
              <MenuItem value={5}>5.Hafta</MenuItem>
              <MenuItem value={6}>6.Hafta</MenuItem>
              <MenuItem value={7}>7.Hafta</MenuItem>
              <MenuItem value={8}>8.Hafta</MenuItem>
              <MenuItem value={9}>9.Hafta</MenuItem>
              <MenuItem value={10}>10.Hafta</MenuItem>
              <MenuItem value={11}>11.Hafta</MenuItem>
              <MenuItem value={12}>12.Hafta</MenuItem>
              <MenuItem value={13}>13.Hafta</MenuItem>
              <MenuItem value={14}>14.Hafta</MenuItem>
              <MenuItem value={15}>15.Hafta</MenuItem>
            </Select>
          </FormControl>

          <IconButton
            onClick={() => setCurrentWeek(Math.min(15, currentWeek + 1))}
            size="small"
            disabled={currentWeek >= 15}
            sx={{
              bgcolor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              "&:hover": { bgcolor: "#f5f5f5" },
              "&:disabled": { bgcolor: "#f5f5f5", opacity: 0.5 },
              width: isMobile ? 28 : 32,
              height: isMobile ? 28 : 32,
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Right - Next Class Info */}
        <Paper
          elevation={2}
          onClick={handleLessonBlockClick}
          sx={{
            flex: 1,
            p: isMobile ? 1 : 1.5,
            background: "linear-gradient(135deg, #1B2E6D 0%, #4A90E2 100%)",
            borderRadius: "8px",
            color: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
            cursor: "pointer",
            minWidth: isMobile ? "auto" : "160px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            transition: "transform 0.2s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.18)",
            },
          }}
        >
          <Box sx={{ textAlign: "center", width: "100%" }}>
            {(() => {
              if (currentClass) {
                let lessonText = 'Ders';
                if (typeof currentClass.lesson === 'string') {
                  lessonText = currentClass.lesson;
                } else if (typeof currentClass.lesson === 'object' && currentClass.lesson !== null) {
                  lessonText = currentClass.lesson.name || currentClass.lesson.code || 'Ders';
                }
                const courseName = lessonText?.split("\\n")?.[0] || lessonText || "Ders";
                return (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: isMobile ? "0.7rem" : "0.85rem",
                        lineHeight: 1.1,
                        mb: 0.2,
                        color: "white",
                      }}
                    >
                      {courseName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.9,
                        fontSize: isMobile ? "0.6rem" : "0.7rem",
                        lineHeight: 1.1,
                        display: "block",
                      }}
                    >
                      Şimdi - {currentClass.remainingTime} dk kaldı
                    </Typography>
                  </>
                );
              } else if (nextClass) {
                let lessonText = 'Ders';
                if (typeof nextClass.lesson === 'string') {
                  lessonText = nextClass.lesson;
                } else if (typeof nextClass.lesson === 'object' && nextClass.lesson !== null) {
                  lessonText = nextClass.lesson.name || nextClass.lesson.code || 'Ders';
                }
                const courseName = lessonText?.split("\\n")?.[0] || lessonText || "Ders";
                return (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        fontSize: isMobile ? "0.7rem" : "0.85rem",
                        lineHeight: 1.1,
                        mb: 0.2,
                        color: "white",
                      }}
                    >
                      {courseName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.9,
                        fontSize: isMobile ? "0.6rem" : "0.7rem",
                        lineHeight: 1.1,
                        display: "block",
                      }}
                    >
                      Sıradaki Ders - {nextClass.time}
                    </Typography>
                  </>
                );
              } else {
                // Bugün ders yoksa gelecek 7 gün içindeki ilk dersi bul
                let nextDayClass = null;

                // Gelecek 7 günü kontrol et
                for (let i = 1; i <= 7; i++) {
                  const futureDate = new Date(currentTime);
                  futureDate.setDate(futureDate.getDate() + i);
                  const futureDayIndex = futureDate.getDay() - 1; // 0=Pazartesi, 1=Salı, ...

                  // Hafta sonu günlerini atla (Cumartesi=5, Pazar=6)
                  if (futureDayIndex < 0 || futureDayIndex > 4) continue;

                  const futureDayKey = dayKeys[futureDayIndex];

                  if (futureDayKey && weeklySchedule) {
                    for (const timeSlot of timeSlots) {
                      const lesson = weeklySchedule[timeSlot][futureDayKey];
                      let lessonText = '';
                      if (typeof lesson === 'string') {
                        lessonText = lesson;
                      } else if (typeof lesson === 'object' && lesson !== null) {
                        lessonText = lesson.name || lesson.code || '';
                      }

                      if (lesson && !lessonText.includes("Bayram")) {
                        nextDayClass = {
                          lesson,
                          time: timeSlot,
                          day: futureDayKey,
                          daysAhead: i
                        };
                        break;
                      }
                    }
                    if (nextDayClass) break; // İlk dersi bulduğumuzda dur
                  }
                }

                if (nextDayClass) {
                  let lessonText = 'Ders';
                  if (typeof nextDayClass.lesson === 'string') {
                    lessonText = nextDayClass.lesson;
                  } else if (typeof nextDayClass.lesson === 'object' && nextDayClass.lesson !== null) {
                    lessonText = nextDayClass.lesson.name || nextDayClass.lesson.code || 'Ders';
                  }
                  const courseName = lessonText?.split("\\n")?.[0] || lessonText || "Ders";
                  const dayNames = {
                    'pazartesi': 'Pazartesi',
                    'sali': 'Salı',
                    'carsamba': 'Çarşamba',
                    'persembe': 'Perşembe',
                    'cuma': 'Cuma'
                  };
                  const dayName = dayNames[nextDayClass.day] || 'Gelecek';

                  return (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: isMobile ? "0.7rem" : "0.85rem",
                          lineHeight: 1.1,
                          mb: 0.2,
                          color: "white",
                        }}
                      >
                        {courseName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          opacity: 0.9,
                          fontSize: isMobile ? "0.6rem" : "0.7rem",
                          lineHeight: 1.1,
                          display: "block",
                        }}
                      >
                        {dayName} - {nextDayClass.time}
                      </Typography>
                    </>
                  );
                } else {
                  return (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: isMobile ? "0.7rem" : "0.85rem",
                          lineHeight: 1.1,
                          mb: 0.2,
                          color: "white",
                        }}
                      >
                        Ders Yok
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          opacity: 0.9,
                          fontSize: isMobile ? "0.6rem" : "0.7rem",
                          lineHeight: 1.1,
                          display: "block",
                        }}
                      >
                        Bu hafta ders yok
                      </Typography>
                    </>
                  );
                }
              }
            })()}
          </Box>

          {/* Yoklama Button - Always visible but only active during class time */}
          <Chip
            label={isMobile ? "YOKLAMA" : "YOKLAMA AL"}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (currentClass) {
                handleYoklamaAl(currentClass);
              } else {
                alert("Yoklama sadece ders saatinde alınabilir!");
              }
            }}
            sx={{
              bgcolor: currentClass ? "#4F46E5" : "#666",
              color: "white",
              fontWeight: 500,
              fontSize: isMobile ? "0.5rem" : "0.6rem",
              height: isMobile ? "16px" : "18px",
              cursor: "pointer",
              opacity: currentClass ? 1 : 0.6,
              "&:hover": {
                bgcolor: currentClass ? "#3730A3" : "#555",
                opacity: currentClass ? 1 : 0.8,
              },
              transition: "all 0.2s ease",
            }}
          />
        </Paper>
      </Box>
    );
  };

  // Handle lesson click
  const handleLessonClick = (lesson, timeSlot, dayKey) => {
    if (!lesson || lesson.includes("Bayram") || lesson.includes("Tatil"))
      return;

    // Lesson string'ini temizle
    const lessonText = typeof lesson === 'string' ? lesson : (lesson.name || lesson.code || 'Ders');

    // Gerçek öğrenci sayısını al
    const studentCount = typeof lesson === 'object' && lesson.studentCount ? lesson.studentCount : 0;

    // Parse lesson info
    const [courseName, roomInfo] = lessonText.split("\n");

    // Create course data for navigation
    const courseData = {
      id: `${courseName}_${timeSlot}_${dayKey}`,
      name: courseName || 'Ders',
      code: courseName ? (courseName.split("/")[0] || courseName) : 'DERS',
      section: courseName ? (courseName.split("/")[1] || "1") : "1",
      room: roomInfo || "Belirtilmemiş",
      building: "Belirtilmemiş",
      instructor: user?.name || "Öğretim Görevlisi",
      studentCount: 0,
      attendanceStatus: "pending",
      attendanceRate: 0,
      lastAttendance: null,
      currentWeek: currentWeek,
      totalWeeks: 14,
      schedule: {
        [dayKey]: [
          {
            startTime: timeSlot,
            endTime: `${parseInt(timeSlot.split(":")[0]) + 1}:${timeSlot.split(":")[1]}`,
            room: roomInfo || "Belirtilmemiş",
          },
        ],
      },
      files: [],
    };

    console.log('🔄 Ders detayına yönlendiriliyor:', courseData);

    // Navigate to course detail
    if (onNavigate) {
      onNavigate("ders-detay", courseData);
    } else {
      console.error('❌ onNavigate prop bulunamadı!');
    }
  };

  // Get chip styling based on lesson status
  const getChipStyling = (timeSlot, dayKey) => {
    const status = getLessonStatus(timeSlot, dayKey);
    const lesson = weeklySchedule[timeSlot][dayKey];

    const baseStyle = {
      cursor:
        lesson && !lesson.includes("Bayram") && !lesson.includes("Tatil")
          ? "pointer"
          : "default",
      transition: "all 0.2s ease-in-out",
      "&:hover":
        lesson && !lesson.includes("Bayram") && !lesson.includes("Tatil")
          ? {
            transform: "scale(1.05)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1,
          }
          : {},
    };

    switch (status) {
      case "current":
        return {
          ...baseStyle,
          bgcolor: "#E8F5E8",
          color: "#27AE60",
          border: "2px solid #27AE60",
          fontWeight: 600,
          animation: "pulse 2s infinite",
        };
      case "upcoming":
        return {
          ...baseStyle,
          bgcolor: "#FFFBF0",
          color: "#B8860B",
          border: "1px solid #DAA520",
          fontWeight: 500,
        };
      case "completed":
        return {
          ...baseStyle,
          bgcolor: "#FAFAFA",
          color: "#9E9E9E",
          border: "1px solid #BDBDBD",
          opacity: 0.8,
        };
      case "holiday":
        return {
          ...baseStyle,
          bgcolor: "#FFFDE7",
          color: "#F57F17",
          fontWeight: 500,
          border: "1px solid #FFEB3B",
          cursor: "default",
          "&:hover": {},
        };
      case "regular":
      default:
        return {
          ...baseStyle,
          bgcolor: "#E3F2FD",
          color: "#1565C0",
          border: "1px solid #90CAF9",
        };
    }
  };

  // Desktop Schedule Table
  // Create schedule data from API response (memoized to prevent unnecessary re-renders)
  const scheduleData = React.useMemo(() => {
    if (!apiWeeklySchedule) return [];

    const allScheduleEntries = [];
    Object.entries(apiWeeklySchedule).forEach(([day, entries]) => {
      entries.forEach(entry => {
        allScheduleEntries.push({
          day: day,
          startTime: entry.time?.split(' - ')[0] || '00:00',
          endTime: entry.time?.split(' - ')[1] || '00:00',
          course: entry.lectureDisplay || `${entry.lectureCode || 'DERS'} - ${entry.lecture || 'Bilinmeyen'}`,
          courseName: entry.lecture || 'Bilinmeyen Ders',
          courseCode: entry.lectureCode || 'DERS',
          sectionName: entry.sectionId || 'Bilinmeyen Şube',
          building: entry.building || 'Bilinmeyen Bina',
          room: entry.room || 'Bilinmeyen Sınıf',
          lectureId: entry.lectureId,
          sectionId: entry.sectionId
        });
      });
    });

    return allScheduleEntries;
  }, [apiWeeklySchedule]);

  const DesktopSchedule = () => {
    // Loading durumu
    if (scheduleLoading) {
      return (
        <Box sx={{ mt: 1, textAlign: 'center', py: 4 }}>
          <CircularProgress size={40} sx={{ color: '#1976d2' }} />
          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
            📚 Ders programı yükleniyor...
          </Typography>
        </Box>
      );
    }

    // Error durumu
    if (scheduleError) {
      return (
        <Box sx={{ mt: 1, textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{ color: 'error.main', mb: 1 }}>
            ❌ Ders programı yüklenemedi
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {scheduleError}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
            sx={{ mt: 1 }}
          >
            🔄 Tekrar Dene
          </Button>
        </Box>
      );
    }

    // Veri yok durumu - ancak yükleme başarılıysa geçici bilgi göster
    const hasAnyData = apiWeeklySchedule && Object.values(apiWeeklySchedule).some(dayEntries => dayEntries.length > 0);
    if (!hasAnyData) {
      return (
        <Box sx={{ mt: 1, textAlign: 'center', py: 4 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
            📅 Henüz ders programı bulunmuyor
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Dersleriniz veritabanında mevcut ancak şube ve saat bilgileri henüz atanmamış.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Lütfen sistem yöneticisiyle iletişime geçin.
          </Typography>
          <Typography variant="body2" sx={{ color: 'info.main', fontWeight: 600 }}>
            ✅ Endpoint zinciri başarıyla çalışıyor
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 1 }}>
        <TableContainer
          component={Paper}
          elevation={2}
          sx={{
            borderRadius: 2,
            border: "1px solid #DEE2E6"
          }}
        >
          <Table
            size="small"
            sx={{
              "& .MuiTableCell-root": {
                borderRight: "1px solid #DEE2E6",
                padding: "4px 8px",
                fontSize: "0.75rem",
                width: "16.66%",
                maxWidth: "120px",
                minWidth: "80px"
              }
            }}
          >
            <TableHead>
              <TableRow
                sx={{ bgcolor: "#F8F9FA", borderBottom: "2px solid #DEE2E6" }}
              >
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#2C3E50",
                    fontSize: "0.7rem",
                    py: 0.5,
                    textAlign: "center",
                    width: "16.66%",
                    maxWidth: "120px",
                    minWidth: "80px",
                  }}
                >
                  Saat Aralığı
                </TableCell>
                {days.map((day, index) => (
                  <TableCell
                    key={day}
                    sx={{
                      fontWeight: 600,
                      color: "#2C3E50",
                      fontSize: "0.7rem",
                      py: 0.5,
                      textAlign: "center",
                      width: "16.66%",
                      maxWidth: "120px",
                      minWidth: "80px",
                    }}
                  >
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {timeSlots.map((timeSlot, rowIndex) => {
                return (
                  <TableRow
                    key={timeSlot}
                    sx={{
                      "&:hover": { bgcolor: "#F8F9FA" },
                      borderBottom:
                        rowIndex < timeSlots.length - 1
                          ? "1px solid #DEE2E6"
                          : "none",
                      minHeight: "55px",
                      maxHeight: "55px",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        color: "#1B2E6D",
                        bgcolor: "#F8F9FA",
                        fontSize: "0.65rem",
                        py: 0.5,
                        textAlign: "center",
                        width: "16.66%",
                        maxWidth: "120px",
                        minWidth: "80px",
                      }}
                    >
                      {timeSlot} - {getEndTime(timeSlot)}
                    </TableCell>
                    {dayKeys.map((dayKey, index) => {
                      const lesson = weeklySchedule[timeSlot][dayKey];
                      const chipStyling = getChipStyling(timeSlot, dayKey);
                      const dayHoliday = isDayHoliday(index);

                      // For holiday columns, show horizontal holiday name in each cell
                      if (dayHoliday) {
                        return (
                          <TableCell
                            key={dayKey}
                            align="center"
                            sx={{
                              p: 0.3,
                              width: "16.66%",
                              maxWidth: "120px",
                              minWidth: "80px",
                              minHeight: "35px",
                              bgcolor: "#FFFDE7",
                              border: "1px solid #FFEB3B",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#F57F17",
                                fontWeight: 600,
                                fontSize: "0.6rem",
                                textAlign: "center",
                                lineHeight: 1.1,
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              {dayHoliday}
                            </Typography>
                          </TableCell>
                        );
                      }

                      // Normal cells for non-holiday days
                      return (
                        <TableCell
                          key={dayKey}
                          align="center"
                          sx={{
                            p: 0.3,
                            minHeight: "50px",
                            maxHeight: "50px",
                            verticalAlign: "middle",
                            width: "16.66%",
                            maxWidth: "120px",
                            minWidth: "80px",
                          }}
                        >
                          {lesson ? (
                            <Chip
                              label={(() => {
                                const lessonText = typeof lesson === 'string' ? lesson.replace("\n", " - ") : (lesson.name || lesson.code || 'Ders');
                                return lessonText.length > 15 ? lessonText.substring(0, 15) + '...' : lessonText;
                              })()}
                              size="small"
                              onClick={() =>
                                handleLessonClick(typeof lesson === 'string' ? lesson : (lesson.name || lesson.code || 'Ders'), timeSlot, dayKey)
                              }
                              sx={{
                                maxWidth: "100%",
                                width: "100%",
                                height: "auto",
                                minHeight: "35px",
                                maxHeight: "40px",
                                "& .MuiChip-label": {
                                  display: "block",
                                  whiteSpace: "normal",
                                  textAlign: "center",
                                  padding: "4px 6px",
                                  fontSize: "0.6rem",
                                  lineHeight: 1.1,
                                  wordBreak: "break-word",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: lesson.length > 40 ? 2 : lesson.length > 25 ? 2 : 1,
                                  WebkitBoxOrient: "vertical",
                                },
                                ...chipStyling,
                              }}
                            />
                          ) : (
                            <Typography
                              variant="body2"
                              color="text.disabled"
                              sx={{ py: 0.15, fontSize: "0.6rem" }}
                            >
                              -
                            </Typography>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Legend */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            justifyContent: "center",
          }}
        >
          <Chip
            size="small"
            label="Şu Andaki Ders"
            sx={{
              bgcolor: "#E8F5E8",
              color: "#27AE60",
              border: "2px solid #27AE60",
            }}
          />
          <Chip
            size="small"
            label="Sonraki Ders"
            sx={{
              bgcolor: "#FFFBF0",
              color: "#B8860B",
              border: "1px solid #DAA520",
            }}
          />
          <Chip
            size="small"
            label="Tamamlanmış Ders"
            sx={{
              bgcolor: "#FAFAFA",
              color: "#9E9E9E",
              border: "1px solid #BDBDBD",
            }}
          />
          <Chip
            size="small"
            label="Düzenli Ders"
            sx={{
              bgcolor: "#E3F2FD",
              color: "#1565C0",
              border: "1px solid #90CAF9",
            }}
          />
          <Chip
            size="small"
            label="Özel Gün ve Tatil"
            sx={{
              bgcolor: "	#FFECB3",
              color: "#1565C0",
              border: "1px solid #FFEB3B",
            }}
          />
        </Box>
      </Box>
    );
  };

  // Mobile Accordion Schedule
  const MobileSchedule = () => (
    <Box>
      {days.map((day, dayIndex) => {
        const dayClasses = timeSlots.filter(
          (slot) => weeklySchedule[slot][dayKeys[dayIndex]]
        );
        const dayHoliday = isDayHoliday(dayIndex);

        return (
          <Accordion
            key={day}
            expanded={expandedDay === day}
            onChange={handleAccordionChange(day)}
            sx={{ mb: 0.5, borderRadius: 2, "&:before": { display: "none" } }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: dayHoliday
                  ? "#FFFDE7"
                  : dayIndex === currentTime.getDay() - 1
                    ? "#E3F2FD"
                    : "#F8F9FA",
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "100%",
                }}
              >
                <CalendarIcon
                  color={
                    dayIndex === currentTime.getDay() - 1
                      ? "primary"
                      : "disabled"
                  }
                />
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 500,
                    fontSize: isMobile ? "0.9rem" : "1rem",
                    color: dayHoliday ? "#F57F17" : "inherit",
                  }}
                >
                  {day}
                </Typography>
                <Badge
                  badgeContent={dayClasses.length}
                  color="primary"
                  sx={{ ml: "auto", mr: 2 }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {dayHoliday ? (
                <Card
                  sx={{
                    p: 2,
                    bgcolor: "#FFFDE7",
                    border: "1px solid #FFEB3B",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#F57F17",
                      fontWeight: 600,
                      fontSize: "1rem",
                      mb: 1,
                    }}
                  >
                    Resmî Tatil
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#F57F17",
                      fontSize: "0.875rem",
                    }}
                  >
                    {dayHoliday}
                  </Typography>
                </Card>
              ) : dayClasses.length > 0 ? (
                dayClasses.map((slot) => {
                  const lesson = weeklySchedule[slot][dayKeys[dayIndex]];
                  const lessonText = typeof lesson === 'string' ? lesson : (lesson.name || lesson.code || '');
                  const isClickable =
                    lesson &&
                    !lessonText.includes("Bayram") &&
                    !lessonText.includes("Tatil");

                  return (
                    <Card
                      key={slot}
                      sx={{
                        mb: 0.5,
                        p: 1.5,
                        cursor: isClickable ? "pointer" : "default",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": isClickable
                          ? {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          }
                          : {},
                      }}
                      onClick={() =>
                        isClickable &&
                        handleLessonClick(typeof lesson === 'string' ? lesson : (lesson.name || lesson.code || 'Ders'), slot, dayKeys[dayIndex])
                      }
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <AccessTimeIcon color="primary" />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 500,
                              fontSize: isMobile ? "0.85rem" : "0.9rem",
                            }}
                          >
                            {slot} - {getEndTime(slot)}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: isMobile ? "0.8rem" : "0.875rem",
                            }}
                          >
                            {typeof lesson === 'string' ? lesson.replace("\n", " - ") : (lesson.name || lesson.code || 'Ders')}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  );
                })
              ) : (
                <Typography
                  variant="body2"
                  color="text.disabled"
                  sx={{ textAlign: "center", py: 1.5 }}
                >
                  Bugün ders bulunmuyor
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );

  return (
    <Container
      maxWidth={false}
      sx={{
        mt: { xs: 0.125, sm: 0.2, md: 0.25, lg: 0.3, xl: 0.35 },
        pb: { xs: 1, sm: 1.2, md: 1.5, lg: 1.8, xl: 2 },
        px: { xs: 0.5, sm: 1, md: 1.5, lg: 2, xl: 3 },
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
      <WelcomeHeader />

      {/* Schedule Table with Week Navigation */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 1.5,
          borderRadius: 2,
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        }}
      >
        {/* Schedule Table */}
        <Box sx={{ mt: 1 }}>
          {isMobile ? <MobileSchedule /> : <DesktopSchedule />}
        </Box>
      </Paper>

      {/* QR Code Attendance Dialog */}
      <Dialog
        open={yoklamaDialog}
        onClose={handleCloseYoklama}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            minHeight: "500px",
          },
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                src={getProfilePhotoUrl(user?.profile_photo)}
                alt={`${user?.title || ''} ${user?.first_name || ''} ${user?.last_name || ''}`}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#4F46E5",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
                onError={(e) => {
                  console.error('❌ AnaSayfa Dialog Avatar - Resim yüklenemedi:', {
                    src: e.target.src,
                    originalPath: user?.profile_photo,
                    error: e
                  });
                }}
              >
                {user?.first_name?.charAt(0)?.toUpperCase() || user?.title?.charAt(0)?.toUpperCase() || 'K'}
              </Avatar>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <QrCodeIcon sx={{ color: "#4F46E5", fontSize: 28 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#1e293b" }}
                  >
                    Yoklama Alınıyor
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: "#64748b", mt: 0.5 }}>
                  {user?.title ? `${user.title} ${user.first_name || ''} ${user.last_name || ''}`.trim() :
                    `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Öğretim Görevlisi'}
                </Typography>
              </Box>
            </Box>
            <Button
              onClick={handleCloseYoklama}
              sx={{ minWidth: "auto", p: 1, color: "#64748b" }}
            >
              <CloseIcon />
            </Button>
          </Box>
          {activeLesson && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {typeof activeLesson.lesson === 'string' ? activeLesson.lesson.replace("\n", " - ") : (activeLesson.lesson.name || activeLesson.lesson.code || 'Ders')} • {activeLesson.time}
            </Typography>
          )}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3}>
            {/* QR Code Section */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: "12px",
                  bgcolor: "#f8fafc",
                  border: "2px solid #e2e8f0",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600, color: "#1e293b" }}
                >
                  QR Kodu Tarayın
                </Typography>

                {/* QR Code Placeholder */}
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    mx: "auto",
                    mb: 2,
                    bgcolor: "white",
                    border: "2px solid #4F46E5",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* QR Code Pattern Simulation */}
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      background: `
                        radial-gradient(circle at 20% 20%, #000 2px, transparent 2px),
                        radial-gradient(circle at 80% 20%, #000 2px, transparent 2px),
                        radial-gradient(circle at 20% 80%, #000 2px, transparent 2px),
                        radial-gradient(circle at 60% 40%, #000 1px, transparent 1px),
                        radial-gradient(circle at 40% 60%, #000 1px, transparent 1px),
                        radial-gradient(circle at 70% 70%, #000 1px, transparent 1px)
                      `,
                      backgroundSize:
                        "20px 20px, 20px 20px, 20px 20px, 10px 10px, 10px 10px, 10px 10px",
                      opacity: 0.8,
                    }}
                  />
                  <QrCodeIcon
                    sx={{
                      position: "absolute",
                      fontSize: 60,
                      color: "#4F46E5",
                      opacity: 0.3,
                    }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  QR Kod ID: {currentQRCode.slice(-8)}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Yenileniyor:
                  </Typography>
                  <Chip
                    label={`${qrTimer}s`}
                    size="small"
                    sx={{
                      bgcolor: qrTimer <= 2 ? "#fee2e2" : "#f0f9ff",
                      color: qrTimer <= 2 ? "#dc2626" : "#0369a1",
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {/* Demo Button */}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={simulateStudentAttendance}
                  sx={{
                    mt: 2,
                    borderColor: "#4F46E5",
                    color: "#4F46E5",
                    "&:hover": {
                      bgcolor: "#f0f9ff",
                    },
                  }}
                >
                  Demo: Öğrenci Katılımı
                </Button>
              </Paper>
            </Grid>

            {/* Attendance List Section */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: "12px",
                  bgcolor: "#f8fafc",
                  border: "2px solid #e2e8f0",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#1e293b" }}
                  >
                    Katılan Öğrenciler
                  </Typography>
                  <Chip
                    label={attendanceList.length}
                    size="small"
                    sx={{
                      bgcolor: "#dcfce7",
                      color: "#166534",
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {attendanceList.length > 0 ? (
                  <List sx={{ maxHeight: 300, overflow: "auto" }}>
                    {attendanceList.map((attendance, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          bgcolor: "white",
                          mb: 1,
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <ListItemIcon>
                          <CheckCircleIcon sx={{ color: "#22c55e" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={attendance.student}
                          secondary={`Katılım: ${attendance.time}`}
                          primaryTypographyProps={{
                            fontWeight: 500,
                            fontSize: "0.9rem",
                          }}
                          secondaryTypographyProps={{
                            fontSize: "0.8rem",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 4,
                      color: "text.secondary",
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                    <Typography variant="body2">
                      Henüz kimse katılmadı
                    </Typography>
                    <Typography variant="caption">
                      Öğrenciler QR kodu tarayarak katılabilir
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: "#f8fafc" }}>
          <Button
            onClick={handleCloseYoklama}
            variant="outlined"
            sx={{
              borderColor: "#64748b",
              color: "#64748b",
              "&:hover": {
                bgcolor: "#f1f5f9",
              },
            }}
          >
            Yoklamayı Bitir
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#22c55e",
              "&:hover": {
                bgcolor: "#16a34a",
              },
            }}
          >
            Kaydet ({attendanceList.length} Öğrenci)
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AnaSayfa;
