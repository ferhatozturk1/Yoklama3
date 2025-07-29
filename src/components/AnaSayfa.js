import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  ExpandMore as ExpandMoreIcon,
  CalendarToday as CalendarIcon,
  Circle as CircleIcon,
  School as SchoolIcon,
  QrCode as QrCodeIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AnaSayfa = ({
  onSectionChange,
  onNavigate,
  selectedSemester = "2025-2026-guz",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedDay, setExpandedDay] = useState(false);

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
    const lessonId = activeLesson?.lesson.split("\n")[0] || "LESSON";
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

  // Base schedule data without holidays
  const baseSchedule = {
    "08:40": {
      pazartesi: "MATH113/3\nYP-A1",
      salı: "",
      çarşamba: "",
      perşembe: "",
      cuma: "PHYS101\nFizik Lab",
    },
    "09:50": {
      pazartesi: "",
      salı: "ENG101/8\nYP-D101",
      çarşamba: "",
      perşembe: "MATH113/3\nYP-A2",
      cuma: "",
    },
    "11:00": {
      pazartesi: "BMC201\nAlgoritma",
      salı: "ENG101/8\nBMC3",
      çarşamba: "",
      perşembe: "BMC3\nLab-1",
      cuma: "STAT102\nİstatistik",
    },
    "13:40": {
      pazartesi: "",
      salı: "CHEM101\nKimya Lab",
      çarşamba: "",
      perşembe: "",
      cuma: "",
    },
    "14:40": {
      pazartesi: "ENG201\nİleri İngilizce",
      salı: "",
      çarşamba: "",
      perşembe: "PHYS201\nFizik II",
      cuma: "BMC401\nYazılım Mühendisliği",
    },
    "15:40": {
      pazartesi: "",
      salı: "MATH201\nDiferensiyel Denklemler",
      çarşamba: "",
      perşembe: "",
      cuma: "",
    },
    "16:40": {
      pazartesi: "BMC303\nAğ Programcılığı",
      salı: "",
      çarşamba: "",
      perşembe: "ELEC201\nElektrik Devreleri",
      cuma: "PROJ401\nBitirme Projesi",
    },
    "17:40": {
      pazartesi: "",
      salı: "BMC501\nYapay Zeka",
      çarşamba: "",
      perşembe: "",
      cuma: "",
    },
    "18:40": {
      pazartesi: "EVE101\nAkşam Dersi",
      salı: "",
      çarşamba: "",
      perşembe: "",
      cuma: "",
    },
    "19:40": {
      pazartesi: "",
      salı: "EVE201\nProje Yönetimi",
      çarşamba: "",
      perşembe: "EVE301\nGirişimcilik",
      cuma: "",
    },
  };

  // Generate dynamic schedule with holidays
  const weeklySchedule = {};
  const dayKeys = ["pazartesi", "salı", "çarşamba", "perşembe", "cuma"];

  Object.keys(baseSchedule).forEach((timeSlot) => {
    weeklySchedule[timeSlot] = {};
    dayKeys.forEach((dayKey, dayIndex) => {
      const dayHoliday = isDayHoliday(dayIndex);
      if (dayHoliday) {
        weeklySchedule[timeSlot][dayKey] = dayHoliday;
      } else {
        weeklySchedule[timeSlot][dayKey] = baseSchedule[timeSlot][dayKey];
      }
    });
  });

  const timeSlots = [
    "08:40",
    "09:50",
    "11:00",
    "13:40",
    "14:40",
    "15:40",
    "16:40",
    "17:40",
    "18:40",
    "19:40",
  ];
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
    if (
      lesson.includes("Bayram") ||
      lesson.includes("Tatil") ||
      lesson.includes("Nisan") ||
      lesson.includes("Mayıs") ||
      lesson.includes("Ağustos") ||
      lesson.includes("Ekim") ||
      lesson.includes("Kasım") ||
      lesson.includes("Yılbaşı")
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
        if (lesson && !lesson.includes("Bayram")) {
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
        if (lesson && !lesson.includes("Bayram")) {
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

  // Compact Welcome Header
  const WelcomeHeader = () => (
    <Paper
      elevation={2}
      sx={{
        p: isMobile ? 1 : 2,
        mb: isMobile ? 1.5 : 2,
        background: "linear-gradient(135deg, #1B2E6D 0%, #4A90E2 100%)",
        borderRadius: "8px",
        color: "white",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
      }}
    >
      {/* Mobile Horizontal Layout */}
      {isMobile ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {/* Left: Avatar + Name */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flex: "1 1 auto",
              minWidth: 0, // Allow shrinking
            }}
          >
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                width: 32,
                height: 32,
                flexShrink: 0,
              }}
            >
              <SchoolIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Box
              sx={{
                minWidth: 0, // Allow text truncation
                flex: 1,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  lineHeight: 1.2,
                  mb: 0.25,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Öğr. Gör. M. N. Öğüt
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  opacity: 0.85,
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                2025-2026 Güz
              </Typography>
            </Box>
          </Box>

          {/* Right: Time + Date */}
          <Box
            sx={{
              textAlign: "right",
              flexShrink: 0,
              bgcolor: "rgba(255,255,255,0.1)",
              px: 1.5,
              py: 1,
              borderRadius: "6px",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: currentHoliday ? "0.75rem" : "0.9rem",
                lineHeight: 1.1,
                mb: 0.25,
                textAlign: "center",
              }}
            >
              {currentHoliday ||
                currentTime.toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.7rem",
                opacity: 0.85,
                lineHeight: 1.1,
              }}
            >
              {currentTime.toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
              })}
            </Typography>
          </Box>
        </Box>
      ) : (
        /* Desktop Layout - Keep original */
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                width: 48,
                height: 48,
              }}
            >
              <SchoolIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  fontSize: "1.1rem",
                  lineHeight: 1.2,
                }}
              >
                Öğr. Gör. Mehmet Nuri Öğüt
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  fontSize: "0.85rem",
                  lineHeight: 1.2,
                }}
              >
                2025-2026 Güz Dönemi
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              textAlign: "center",
              bgcolor: "rgba(255,255,255,0.1)",
              px: 3,
              py: 1.5,
              borderRadius: "8px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                mb: 0.5,
                fontSize: currentHoliday ? "0.95rem" : "1.1rem",
                lineHeight: 1.2,
                textAlign: "center",
              }}
            >
              {currentHoliday || currentTime.toLocaleTimeString("tr-TR")}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontSize: "0.85rem",
                lineHeight: 1.2,
              }}
            >
              {currentTime.toLocaleDateString("tr-TR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );

  // Handle lesson click
  const handleLessonClick = (lesson, timeSlot, dayKey) => {
    if (!lesson || lesson.includes("Bayram") || lesson.includes("Tatil"))
      return;

    // Parse lesson info
    const [courseName, roomInfo] = lesson.split("\n");

    // Create mock course data for navigation
    const mockCourse = {
      id: `${courseName}_${timeSlot}_${dayKey}`,
      name: courseName,
      code: courseName.split("/")[0] || courseName,
      section: courseName.split("/")[1] || "1",
      room: roomInfo || "Belirtilmemiş",
      building: "Ana Bina",
      instructor: "Öğr. Gör. M. N. Öğüt",
      studentCount: 25,
      attendanceStatus: "completed",
      attendanceRate: 85,
      lastAttendance: new Date().toISOString(),
      currentWeek: 8,
      totalWeeks: 14,
      schedule: {
        [dayKey]: [
          {
            startTime: timeSlot,
            endTime: `${parseInt(timeSlot.split(":")[0]) + 1}:${
              timeSlot.split(":")[1]
            }`,
            room: roomInfo || "Belirtilmemiş",
          },
        ],
      },
      files: [],
    };

    // Navigate to course detail
    if (onNavigate) {
      onNavigate("ders-detay", mockCourse);
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
  const DesktopSchedule = () => (
    <Box sx={{ mt: 1.5 }}>
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{ borderRadius: 0, border: "1px solid #DEE2E6" }}
      >
        <Table
          sx={{ "& .MuiTableCell-root": { borderRight: "1px solid #DEE2E6" } }}
        >
          <TableHead>
            <TableRow
              sx={{ bgcolor: "#F8F9FA", borderBottom: "2px solid #DEE2E6" }}
            >
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "#2C3E50",
                  fontSize: "0.8rem",
                  py: 1,
                }}
              >
                Saat
              </TableCell>
              {days.map((day, index) => {
                const dayHoliday = isDayHoliday(index);
                return (
                  <TableCell
                    key={day}
                    align="center"
                    sx={{
                      fontWeight: 600,
                      color: dayHoliday
                        ? "#F57F17"
                        : index === currentTime.getDay() - 1
                        ? "#1B2E6D"
                        : "#2C3E50",
                      fontSize: "0.8rem",
                      py: 1,
                      bgcolor: dayHoliday
                        ? "#FFFDE7"
                        : index === currentTime.getDay() - 1
                        ? "#E3F2FD"
                        : "#F8F9FA",
                    }}
                  >
                    {day}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((timeSlot, rowIndex) => {
              // Check which days are holidays
              const holidayColumns = dayKeys.map((dayKey, index) => ({
                index,
                holiday: isDayHoliday(index),
              }));

              return (
                <TableRow
                  key={timeSlot}
                  sx={{
                    "&:hover": { bgcolor: "#F8F9FA" },
                    borderBottom:
                      rowIndex < timeSlots.length - 1
                        ? "1px solid #DEE2E6"
                        : "none",
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      color: "#1B2E6D",
                      bgcolor: "#F8F9FA",
                      fontSize: "0.8rem",
                      py: 1.5,
                      minWidth: "70px",
                    }}
                  >
                    {timeSlot}
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
                            p: 1,
                            minHeight: "50px",
                            bgcolor: "#FFFDE7",
                            border: "1px solid #FFEB3B",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#F57F17",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              textAlign: "center",
                              lineHeight: 1.2,
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
                          p: 1,
                          minHeight: "50px",
                        }}
                      >
                        {lesson ? (
                          <Chip
                            label={lesson.replace("\n", " - ")}
                            size="small"
                            onClick={() =>
                              handleLessonClick(lesson, timeSlot, dayKey)
                            }
                            sx={{
                              maxWidth: "100%",
                              height: "auto",
                              minHeight: "32px",
                              "& .MuiChip-label": {
                                display: "block",
                                whiteSpace: "normal",
                                textAlign: "center",
                                padding: "6px 8px",
                                fontSize: "0.7rem",
                                lineHeight: 1.2,
                              },
                              ...chipStyling,
                            }}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.disabled"
                            sx={{ py: 0.5 }}
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
            bgcolor: "#FFFDE7",
            color: "#F57F17",
            border: "1px solid #FFEB3B",
          }}
        />
      </Box>
    </Box>
  );

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
                  const isClickable =
                    lesson &&
                    !lesson.includes("Bayram") &&
                    !lesson.includes("Tatil");

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
                        handleLessonClick(lesson, slot, dayKeys[dayIndex])
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
                            {slot} - {parseInt(slot.split(":")[0]) + 1}:
                            {slot.split(":")[1]}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: isMobile ? "0.8rem" : "0.875rem",
                            }}
                          >
                            {lesson.replace("\n", " - ")}
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
      maxWidth={isMobile ? "sm" : "xl"}
      sx={{
        mt: isMobile ? 0.5 : 1,
        pb: 2,
        px: isMobile ? 1 : 2,
      }}
    >
      <WelcomeHeader />

      {/* Compact Lesson Status */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        }}
      >
        {(() => {
          const nextClass = getNextClass();

          if (currentClass) {
            return (
              <Box
                sx={{
                  cursor: "pointer",
                  "&:hover": { opacity: 0.9 },
                }}
                onClick={() =>
                  handleLessonClick(
                    currentClass.lesson,
                    currentClass.time,
                    dayKeys[currentTime.getDay() - 1]
                  )
                }
              >
                {/* Şu Anki Ders */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <CircleIcon
                    sx={{
                      color: "#27AE60",
                      fontSize: 16,
                      animation: "pulse 2s infinite",
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: "#27AE60", fontSize: "1rem" }}
                  >
                    Şu Andaki Ders
                  </Typography>
                  <Chip
                    label="DEVAM EDIYOR"
                    size="small"
                    sx={{
                      bgcolor: "#27AE60",
                      color: "white",
                      fontWeight: 500,
                      fontSize: "0.7rem",
                      height: "20px",
                    }}
                  />
                  <Chip
                    label="YOKLAMA AL"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleYoklamaAl(currentClass);
                    }}
                    sx={{
                      bgcolor: "#4F46E5",
                      color: "white",
                      fontWeight: 500,
                      fontSize: "0.7rem",
                      height: "20px",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#3730A3" },
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                  }}
                >
                  {/* Sol: Şu Anki Ders Bilgileri */}
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 500,
                          color: "#1B2E6D",
                          fontSize: "1rem",
                        }}
                      >
                        {currentClass.lesson.replace("\n", " - ")}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
                          fontSize: "0.75rem",
                          fontStyle: "italic",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        💡 Matematik temel kavramları ve analitik geometri
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#666", fontSize: "0.8rem", mb: 0.5 }}
                    >
                      📍 A Blok - 201 Nolu Sınıf
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#666", fontSize: "0.8rem" }}
                      >
                        {currentClass.time} -{" "}
                        {parseInt(currentClass.time.split(":")[0]) + 1}:
                        {currentClass.time.split(":")[1]}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "#27AE60",
                          fontSize: "0.8rem",
                        }}
                      >
                        Kalan: {Math.floor(currentClass.remainingMinutes / 60)}:
                        {(currentClass.remainingMinutes % 60)
                          .toString()
                          .padStart(2, "0")}{" "}
                        dk
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={currentClass.progressPercent}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: "#C8E6C9",
                        mt: 0.5,
                        "& .MuiLinearProgress-bar": { bgcolor: "#27AE60" },
                      }}
                    />
                  </Box>

                  {/* Sağ: Sıradaki Ders (eğer varsa) */}
                  {nextClass && (
                    <Box
                      sx={{
                        flex: 1,
                        borderLeft: { md: "1px solid #dee2e6" },
                        pl: { md: 2 },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <AccessTimeIcon
                          sx={{ color: "#F39C12", fontSize: 16 }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: "#F39C12",
                            fontSize: "0.9rem",
                          }}
                        >
                          Sonraki Ders
                        </Typography>
                      </Box>

                      {/* Kompakt Düzen - Ders Adı ve Bilgiler */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        {/* Ders Adı */}
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: "#1B2E6D",
                            fontSize: "0.95rem",
                            lineHeight: 1.2,
                          }}
                        >
                          {nextClass.lesson.replace("\n", " - ")}
                        </Typography>

                        {/* Açıklama */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#666",
                            fontSize: "0.75rem",
                            fontStyle: "italic",
                            lineHeight: 1.3,
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          💡 İngilizce dil becerileri geliştirme
                        </Typography>

                        {/* Yer Bilgisi */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "#666", fontSize: "0.75rem" }}
                          >
                            📍
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#1B2E6D",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          >
                            B Blok - 105 Nolu Sınıf
                          </Typography>
                        </Box>

                        {/* Saat Bilgisi */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "#666", fontSize: "0.75rem" }}
                          >
                            🕒
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#F39C12",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                            }}
                          >
                            {nextClass.time} -{" "}
                            {Math.floor(nextClass.minutesUntil / 60)} saat{" "}
                            {nextClass.minutesUntil % 60} dk sonra
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          } else if (nextClass) {
            return (
              <Box
                sx={{
                  cursor: "pointer",
                  "&:hover": { opacity: 0.9 },
                }}
                onClick={() =>
                  handleLessonClick(
                    nextClass.lesson,
                    nextClass.time,
                    dayKeys[currentTime.getDay() - 1]
                  )
                }
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <AccessTimeIcon sx={{ color: "#F39C12", fontSize: 16 }} />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: "#F39C12", fontSize: "1rem" }}
                  >
                    Sonraki Ders
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: "#1B2E6D",
                      fontSize: "1rem",
                    }}
                  >
                    {nextClass.lesson.replace("\n", " - ")}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "0.75rem",
                      fontStyle: "italic",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    💡 İngilizce dil becerilerinin geliştirilmesi
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#666", fontSize: "0.8rem", mb: 0.5 }}>
                  📍 B Blok - 105 Numaralı Sınıf
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", fontSize: "0.8rem" }}>
                  {nextClass.time} - {Math.floor(nextClass.minutesUntil / 60)} saat {nextClass.minutesUntil % 60} dakika sonra
                </Typography>
              </Box>
            );
          } else {
            return (
              <Box
                sx={{
                  cursor: "pointer",
                  "&:hover": { opacity: 0.9 },
                }}
                onClick={() =>
                  handleLessonClick("MATH113/3\nYP-A1", "08:40", "pazartesi")
                }
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <SchoolIcon sx={{ color: "#2196F3", fontSize: 16 }} />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: "#2196F3", fontSize: "1rem" }}
                  >
                    Örnek Ders
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: "#1B2E6D",
                      fontSize: "1rem",
                    }}
                  >
                    MATH113/3 - YP-A1
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "0.75rem",
                      fontStyle: "italic",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    📚 Matematik analizi ve diferensiyel denklemler
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", fontSize: "0.8rem" }}
                >
                  Ayrıntıları görmek için tıklayın
                </Typography>
              </Box>
            );
          }
        })()}
      </Paper>

      {/* Schedule Section */}
      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid #E0E0E0",
            bgcolor: "#F8F9FA",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ScheduleIcon sx={{ color: "#1B2E6D", fontSize: 28 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 500,
                color: "#1B2E6D",
                fontSize: isMobile ? "1.1rem" : "1.5rem",
              }}
            >
              Ders Programı
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <QrCodeIcon sx={{ color: "#4F46E5", fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1e293b" }}
              >
                Yoklama Alınıyor
              </Typography>
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
              {activeLesson.lesson.replace("\n", " - ")} • {activeLesson.time}
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
