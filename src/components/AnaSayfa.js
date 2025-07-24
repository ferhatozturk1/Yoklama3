<<<<<<< HEAD
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
} from "@mui/material";
import {
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  ExpandMore as ExpandMoreIcon,
  CalendarToday as CalendarIcon,
  Circle as CircleIcon,
  School as SchoolIcon,
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

const AnaSayfa = ({ onSectionChange, selectedSemester = "2025-2026-guz" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedDay, setExpandedDay] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedDay(isExpanded ? panel : false);
  };

  // Comprehensive weekly schedule data until 8:00 PM
  const weeklySchedule = {
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
      çarşamba: "23 Nisan\nUlusal Egemenlik\nve Çocuk\nBayramı",
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
      çarşamba: "BMC301\nVeri Yapıları",
      perşembe: "",
      cuma: "",
    },
    "14:40": {
      pazartesi: "ENG201\nİleri İngilizce",
      salı: "",
      çarşamba: "",
      perşembe: "PHYS201\nFizik II",
      cuma: "BMC401\nYazılım Müh.",
    },
    "15:40": {
      pazartesi: "",
      salı: "MATH201\nDifferansiyel",
      çarşamba: "BMC302\nVeritabanı",
      perşembe: "",
      cuma: "",
    },
    "16:40": {
      pazartesi: "BMC303\nAğ Programlama",
      salı: "",
      çarşamba: "",
      perşembe: "ELEC201\nElektrik Devre",
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
      çarşamba: "EVE102\nMesleki İngilizce",
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
  const dayKeys = ["pazartesi", "salı", "çarşamba", "perşembe", "cuma"];

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
    if (lesson.includes("Bayram") || lesson.includes("Tatil")) return "holiday";
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
        p: isMobile ? 1.5 : 3,
        mb: isMobile ? 2 : 3,
        background: "linear-gradient(135deg, #1B2E6D 0%, #4A90E2 100%)",
        borderRadius: '8px',
        color: "white",
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
      }}
    >
      {/* Mobile Horizontal Layout */}
      {isMobile ? (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          flexWrap: 'wrap'
        }}>
          {/* Left: Avatar + Name */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flex: '1 1 auto',
            minWidth: 0 // Allow shrinking
          }}>
            <Avatar sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              width: 32,
              height: 32,
              flexShrink: 0
            }}>
              <SchoolIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Box sx={{
              minWidth: 0, // Allow text truncation
              flex: 1
            }}>
              <Typography sx={{
                fontWeight: 500,
                fontSize: '0.85rem',
                lineHeight: 1.2,
                mb: 0.25,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                Öğr. Gör. M. N. Öğüt
              </Typography>
              <Typography sx={{
                fontSize: '0.7rem',
                opacity: 0.85,
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                2025-2026 Güz
              </Typography>
            </Box>
          </Box>

          {/* Right: Time + Date */}
          <Box sx={{
            textAlign: 'right',
            flexShrink: 0,
            bgcolor: 'rgba(255,255,255,0.1)',
            px: 1.5,
            py: 1,
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            <Typography sx={{
              fontWeight: 600,
              fontSize: '0.9rem',
              lineHeight: 1.1,
              mb: 0.25
            }}>
              {currentTime.toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
            <Typography sx={{
              fontSize: '0.7rem',
              opacity: 0.85,
              lineHeight: 1.1
            }}>
              {currentTime.toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'short'
              })}
            </Typography>
          </Box>
        </Box>
      ) : (
        /* Desktop Layout - Keep original */
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}>
          <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}>
            <Avatar sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              width: 48,
              height: 48,
            }}>
              <SchoolIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{
                fontWeight: 600,
                mb: 0.5,
                fontSize: "1.1rem",
                lineHeight: 1.2,
              }}>
                Öğr. Gör. Mehmet Nuri Öğüt
              </Typography>
              <Typography variant="body2" sx={{
                opacity: 0.9,
                fontSize: "0.85rem",
                lineHeight: 1.2,
              }}>
                2025-2026 Güz Dönemi
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{
            textAlign: "center",
            bgcolor: "rgba(255,255,255,0.1)",
            px: 3,
            py: 1.5,
            borderRadius: '8px',
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}>
            <Typography variant="h6" sx={{
              fontWeight: 500,
              mb: 0.5,
              fontSize: "1.1rem",
              lineHeight: 1.2,
            }}>
              {currentTime.toLocaleTimeString("tr-TR")}
            </Typography>
            <Typography variant="body2" sx={{
              opacity: 0.9,
              fontSize: "0.85rem",
              lineHeight: 1.2,
            }}>
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

  // Get chip styling based on lesson status
  const getChipStyling = (timeSlot, dayKey) => {
    const status = getLessonStatus(timeSlot, dayKey);
    const lesson = weeklySchedule[timeSlot][dayKey];

    switch (status) {
      case "current":
        return {
          bgcolor: "#E8F5E8",
          color: "#27AE60",
          border: "2px solid #27AE60",
          fontWeight: 600,
          animation: "pulse 2s infinite",
        };
      case "upcoming":
        return {
          bgcolor: "#FFFBF0",
          color: "#B8860B",
          border: "1px solid #DAA520",
          fontWeight: 500,
        };
      case "completed":
        return {
          bgcolor: "#FAFAFA",
          color: "#9E9E9E",
          border: "1px solid #BDBDBD",
          opacity: 0.8,
        };
      case "holiday":
        return {
          bgcolor: "#FFFDE7",
          color: "#F57F17",
          fontWeight: 500,
          border: "1px solid #FFEB3B",
        };
      case "regular":
      default:
        return {
          bgcolor: "#E3F2FD",
          color: "#1565C0",
          border: "1px solid #90CAF9",
        };
    }
  };

  // Desktop Schedule Table
  const DesktopSchedule = () => (
    <Box sx={{ mt: 3 }}>
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
                  fontSize: "0.875rem",
                  py: 2,
                }}
              >
                Saat
              </TableCell>
              {days.map((day, index) => (
                <TableCell
                  key={day}
                  align="center"
                  sx={{
                    fontWeight: 600,
                    color:
                      index === currentTime.getDay() - 1
                        ? "#1B2E6D"
                        : "#2C3E50",
                    fontSize: "0.875rem",
                    py: 2,
                    bgcolor:
                      index === currentTime.getDay() - 1
                        ? "#E3F2FD"
                        : "#F8F9FA",
                  }}
                >
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((timeSlot, rowIndex) => (
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
                    fontSize: "0.875rem",
                    py: 2.5,
                    minWidth: "80px",
                  }}
                >
                  {timeSlot}
                </TableCell>
                {dayKeys.map((dayKey, index) => {
                  const lesson = weeklySchedule[timeSlot][dayKey];
                  const chipStyling = getChipStyling(timeSlot, dayKey);

                  return (
                    <TableCell
                      key={dayKey}
                      align="center"
                      sx={{ p: 1.5, minHeight: "60px" }}
                    >
                      {lesson ? (
                        <Chip
                          label={lesson.replace("\n", " - ")}
                          size="small"
                          sx={{
                            maxWidth: "100%",
                            height: "auto",
                            minHeight: "36px",
                            "& .MuiChip-label": {
                              display: "block",
                              whiteSpace: "normal",
                              textAlign: "center",
                              padding: "8px 12px",
                              fontSize: "0.75rem",
                              lineHeight: 1.3,
                            },
                            ...chipStyling,
                          }}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.disabled"
                          sx={{ py: 1 }}
                        >
                          -
                        </Typography>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Legend */}
      <Box
        sx={{
          mt: 3,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
        }}
      >
        <Chip
          size="small"
          label="Şu Anki Ders"
          sx={{
            bgcolor: "#E8F5E8",
            color: "#27AE60",
            border: "2px solid #27AE60",
          }}
        />
        <Chip
          size="small"
          label="Gelecek Ders"
          sx={{
            bgcolor: "#FFFBF0",
            color: "#B8860B",
            border: "1px solid #DAA520",
          }}
        />
        <Chip
          size="small"
          label="Tamamlanan Ders"
          sx={{
            bgcolor: "#FAFAFA",
            color: "#9E9E9E",
            border: "1px solid #BDBDBD",
          }}
        />
        <Chip
          size="small"
          label="Normal Ders"
          sx={{
            bgcolor: "#E3F2FD",
            color: "#1565C0",
            border: "1px solid #90CAF9",
          }}
        />
        <Chip
          size="small"
          label="Özel Gün/Tatil"
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

        return (
          <Accordion
            key={day}
            expanded={expandedDay === day}
            onChange={handleAccordionChange(day)}
            sx={{ mb: 1, borderRadius: 2, "&:before": { display: "none" } }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor:
                  dayIndex === currentTime.getDay() - 1 ? "#E3F2FD" : "#F8F9FA",
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
                    fontSize: isMobile ? '0.9rem' : '1rem'
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
              {dayClasses.length > 0 ? (
                dayClasses.map((slot) => (
                  <Card key={slot} sx={{ mb: 1, p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <AccessTimeIcon color="primary" />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ 
                            fontWeight: 500,
                            fontSize: isMobile ? '0.85rem' : '0.9rem'
                          }}
                        >
                          {slot} - {parseInt(slot.split(":")[0]) + 1}:
                          {slot.split(":")[1]}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            fontSize: isMobile ? '0.8rem' : '0.875rem'
                          }}
                        >
                          {weeklySchedule[slot][dayKeys[dayIndex]].replace(
                            "\n",
                            " - "
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="text.disabled"
                  sx={{ textAlign: "center", py: 2 }}
                >
                  Bu gün ders bulunmuyor
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
        mt: isMobile ? 1 : 2,
        pb: 4,
        px: isMobile ? 1 : 3,
      }}
    >
      <WelcomeHeader />

      {/* Current/Next Class Status */}
      <Box sx={{ mb: 4 }}>
        {currentClass && (
          <Paper
            elevation={2}
            sx={{
              p: 3,
              mb: 2,
              bgcolor: "#E8F5E8",
              borderLeft: "4px solid #27AE60",
              borderRadius: 0,
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircleIcon
                  sx={{
                    color: "#27AE60",
                    fontSize: 16,
                    animation: "pulse 2s infinite",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#27AE60" }}
                >
                  Şu Anki Ders
                </Typography>
              </Box>
              <Chip
                label="DEVAM EDİYOR"
                size="small"
                sx={{
                  bgcolor: "#27AE60",
                  color: "white",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                }}
              />
            </Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 500, color: "#1B2E6D", mb: 2 }}
            >
              {currentClass.lesson.replace("\n", " - ")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {currentClass.time} -{" "}
                {parseInt(currentClass.time.split(":")[0]) + 1}:
                {currentClass.time.split(":")[1]}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, color: "#27AE60" }}
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
                height: 8,
                borderRadius: 4,
                bgcolor: "#C8E6C9",
                "& .MuiLinearProgress-bar": { bgcolor: "#27AE60" },
              }}
            />
          </Paper>
        )}

        {!currentClass &&
          (() => {
            const nextClass = getNextClass();
            return (
              nextClass && (
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    mb: 2,
                    bgcolor: "#FFF3E0",
                    borderLeft: "4px solid #F39C12",
                    borderRadius: 0,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <AccessTimeIcon sx={{ color: "#F39C12", fontSize: 16 }} />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#F39C12" }}
                    >
                      Sıradaki Ders
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 500, color: "#1B2E6D", mb: 2 }}
                  >
                    {nextClass.lesson.replace("\n", " - ")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {nextClass.time} - {Math.floor(nextClass.minutesUntil / 60)}{" "}
                    saat {nextClass.minutesUntil % 60} dakika sonra
                  </Typography>
                </Paper>
              )
            );
          })()}
      </Box>

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
                fontSize: isMobile ? '1.1rem' : '1.5rem'
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
    </Container>
  );
};

export default AnaSayfa;
=======
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
} from "@mui/material";
import { AccessTime, Circle } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { useDersler } from '../contexts/DersContext';

const AnaSayfa = ({ onSectionChange, selectedSemester = "2025-2026-guz" }) => {
  const navigate = useNavigate();
  const { getDersByScheduleInfo } = useDersler();
  
  // Canlı saat state'i
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());

  // Her saniye güncelle
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setCurrentDate(now);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Haftalık ders programı
  const [weeklySchedule] = useState({
    "08:40": {
      pazartesi: "MATH113/3\n1.Ö-A1",
      salı: "",
      çarşamba: "",
      perşembe: "",
      cuma: "",
    },
    "10:00": {
      pazartesi: "",
      salı: "",
      çarşamba: "",
      perşembe: "",
      cuma: "MATH113/3\n1.Ö-A1",
    },
    "11:00": {
      pazartesi: "",
      salı: "BMC3/1\nKarma-Lab1",
      çarşamba: "",
      perşembe: "",
      cuma: "",
    },
    "14:00": {
      pazartesi: "",
      salı: "",
      çarşamba: "MATH113/3\n1.Ö-A1",
      perşembe: "",
      cuma: "",
    },
    "18:00": {
      pazartesi: "",
      salı: "ENG101/8\n2.Ö-D101",
      çarşamba: "",
      perşembe: "",
      cuma: "",
    },
    "19:00": {
      pazartesi: "",
      salı: "",
      çarşamba: "",
      perşembe: "ENG101/8\n2.Ö-D101",
      cuma: "",
    },
    "20:00": {
      pazartesi: "",
      salı: "BMC3/1\nKarma-Lab1",
      çarşamba: "",
      perşembe: "",
      cuma: "",
    },
  });

  const timeSlots = ["08:40", "10:00", "11:00", "14:00", "18:00", "19:00", "20:00"];
  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];
  const dayKeys = ["pazartesi", "salı", "çarşamba", "perşembe", "cuma"];

  // Şu anki dersi bul (canlı)
  const getCurrentClass = () => {
    const currentTimeNum =
      currentTime.getHours() * 100 + currentTime.getMinutes();
    const currentDay = dayKeys[currentTime.getDay() - 1]; // Pazartesi = 0

    if (!currentDay) return null;

    for (const timeSlot of timeSlots) {
      const [hour, minute] = timeSlot.split(":").map(Number);
      const slotTime = hour * 100 + minute;
      const endTime = slotTime + 50; // 50 dakikalık ders

      if (currentTimeNum >= slotTime && currentTimeNum <= endTime) {
        const lesson = weeklySchedule[timeSlot][currentDay];
        if (lesson) {
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

  // Bir sonraki dersi bul
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
        if (lesson) {
          const minutesUntil =
            Math.floor((slotTime - currentTimeNum) / 100) * 60 +
            ((slotTime - currentTimeNum) % 100);
          return { lesson, time: timeSlot, minutesUntil };
        }
      }
    }
    return null;
  };

  // Ders durumunu kontrol et
  const getLessonStatus = (timeSlot, dayKey) => {
    const currentTimeNum =
      currentTime.getHours() * 100 + currentTime.getMinutes();
    const currentDay = dayKeys[currentTime.getDay() - 1];
    const [hour, minute] = timeSlot.split(":").map(Number);
    const slotTime = hour * 100 + minute;
    const endTime = slotTime + 50;

    if (currentDay !== dayKey) return "inactive";

    if (currentTimeNum >= slotTime && currentTimeNum <= endTime) {
      return "active"; // Şu anda devam ediyor
    } else if (currentTimeNum < slotTime) {
      return "upcoming"; // Gelecek
    } else {
      return "completed"; // Tamamlandı
    }
  };

  const currentClass = getCurrentClass();
  const nextClass = getNextClass();

  // Dönem bilgisini parse et
  const getSemesterInfo = (semester) => {
    const [year, season] = semester.split("-").slice(-2);
    const seasonText = season === "guz" ? "Güz" : "Bahar";
    const yearText = semester.split("-").slice(0, 2).join("-");
    return {
      year: yearText,
      season: seasonText,
      full: `${yearText} ${seasonText}`,
    };
  };

  const semesterInfo = getSemesterInfo(selectedSemester);

  // Ders tıklama fonksiyonu
  const handleDersClick = (lesson) => {
    if (!lesson || lesson.includes("Bayram")) return;
    
    const ders = getDersByScheduleInfo(lesson);
    if (ders) {
      navigate(`/portal/ders/${ders.id}`);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      {/* Hoşgeldin Mesajı - Canlı Saat */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
          borderRadius: 3,
          color: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
            }}
          >
            Hoşgeldin Ögr. Gör. Mehmet Nuri Öğüt
          </Typography>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
                fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.375rem" },
                fontFamily: "SF Mono, Monaco, Consolas, monospace",
                letterSpacing: "0.02em",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AccessTime />
              {currentTime.toLocaleTimeString("tr-TR")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                fontSize: { xs: "0.875rem", sm: "1rem" },
                lineHeight: 1.5,
              }}
            >
              {currentDate.toLocaleDateString("tr-TR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body1"
          sx={{
            opacity: 0.9,
            fontSize: { xs: "0.875rem", sm: "1rem" },
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          {semesterInfo.full} Dönemi - Haftalık Ders Programı Takibi
         
        </Typography>
      </Paper>

      {/* Şu Anki Ders - Canlı */}
      {currentClass && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            bgcolor: "#e8f5e8",
            borderLeft: "4px solid #4caf50",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#2e7d32",
                fontSize: { xs: "1rem", sm: "1.125rem" },
                lineHeight: 1.4,
              }}
            >
              Şu Anki Ders - CANLI
            </Typography>
            <Chip
              icon={
                <Circle sx={{ fontSize: 12, animation: "pulse 2s infinite" }} />
              }
              label="DEVAM EDİYOR"
              color="success"
              variant="filled"
              sx={{
                fontWeight: 500,
                fontSize: "0.75rem",
                letterSpacing: "0.02em",
                "@keyframes pulse": {
                  "0%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                  "100%": { opacity: 1 },
                },
              }}
            />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 500,
              color: "#1a237e",
              mb: 2,
              fontSize: { xs: "1.25rem", sm: "1.375rem", md: "1.5rem" },
              lineHeight: 1.4,
            }}
          >
            {currentClass.lesson}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: "0.875rem",
                lineHeight: 1.5,
              }}
            >
              {currentClass.time} -{" "}
              {parseInt(currentClass.time.split(":")[0]) + 1}:
              {currentClass.time.split(":")[1]}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: "#2e7d32",
                fontSize: "0.875rem",
                letterSpacing: "0.01em",
              }}
            >
              Kalan: {Math.floor(currentClass.remainingMinutes / 60)}:
              {(currentClass.remainingMinutes % 60).toString().padStart(2, "0")}{" "}
              dk
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={currentClass.progressPercent}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "#c8e6c9",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#4caf50",
              },
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Ders İlerlemesi: %{Math.round(currentClass.progressPercent)}
          </Typography>
        </Paper>
      )}

      {/* Bir Sonraki Ders */}
      {!currentClass && nextClass && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            bgcolor: "#fff3e0",
            borderLeft: "4px solid #ff9800",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#f57c00",
              mb: 1,
              fontSize: { xs: "1rem", sm: "1.125rem" },
              lineHeight: 1.4,
            }}
          >
            Bir Sonraki Ders
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 500,
              color: "#1a237e",
              fontSize: { xs: "1.25rem", sm: "1.375rem", md: "1.5rem" },
              lineHeight: 1.4,
              mb: 1,
            }}
          >
            {nextClass.lesson}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.875rem",
              lineHeight: 1.5,
            }}
          >
            {nextClass.time} - {nextClass.minutesUntil} dakika sonra başlayacak
          </Typography>
        </Paper>
      )}

      {/* Akademik Takvim - Haftalık Ders Programı */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              color: "#1a237e",
              fontSize: { xs: "1.25rem", sm: "1.375rem", md: "1.5rem" },
              lineHeight: 1.4,
              textAlign: "center",
            }}
          >
            {semesterInfo.full} Dönemi - Haftalık Ders Programı - CANLI TAKİP
          </Typography>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="ders programı">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    width: "100px",
                    fontSize: "0.875rem",
                    letterSpacing: "0.01em",
                    lineHeight: 1.5,
                  }}
                >
                  Saat
                </TableCell>
                {days.map((day) => (
                  <TableCell
                    key={day}
                    align="center"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      letterSpacing: "0.01em",
                      lineHeight: 1.5,
                    }}
                  >
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {timeSlots.map((timeSlot) => (
                <TableRow
                  key={timeSlot}
                  sx={{ "&:nth-of-type(odd)": { bgcolor: "#fafafa" } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      fontWeight: 600,
                      bgcolor: "#e3f2fd",
                      borderRight: "2px solid #2196f3",
                      fontSize: "0.875rem",
                      letterSpacing: "0.02em",
                      fontFamily: "SF Mono, Monaco, Consolas, monospace",
                    }}
                  >
                    {timeSlot}
                  </TableCell>
                  {dayKeys.map((dayKey) => {
                    const lesson = weeklySchedule[timeSlot][dayKey];
                    const lessonStatus = getLessonStatus(timeSlot, dayKey);
                    const isCurrentLesson = lessonStatus === "active";
                    const isUpcoming = lessonStatus === "upcoming";
                    const isCompleted = lessonStatus === "completed";

                    let cellBgColor = "inherit";
                    let cellBorder = "inherit";

                    if (isCurrentLesson) {
                      cellBgColor = "#e8f5e8";
                      cellBorder = "3px solid #4caf50";
                    } else if (isUpcoming && lesson) {
                      cellBgColor = "#fff3e0";
                      cellBorder = "2px solid #ff9800";
                    } else if (isCompleted && lesson) {
                      cellBgColor = "#f5f5f5";
                      cellBorder = "1px solid #9e9e9e";
                    }

                    return (
                      <TableCell
                        key={dayKey}
                        align="center"
                        sx={{
                          height: "80px",
                          verticalAlign: "middle",
                          bgcolor: cellBgColor,
                          border: cellBorder,
                          position: "relative",
                          transition: "all 0.3s ease",
                          cursor: lesson && !lesson.includes("Bayram") ? "pointer" : "default",
                          "&:hover": lesson && !lesson.includes("Bayram") ? {
                            bgcolor: isCurrentLesson ? "#c8e6c9" : "#e3f2fd",
                            transform: "scale(1.02)",
                          } : {},
                        }}
                        onClick={() => handleDersClick(lesson)}
                      >
                        {lesson && (
                          <Box
                            sx={{
                              p: 1,
                              bgcolor: lesson.includes("Bayram")
                                ? "#fff3e0"
                                : isCurrentLesson
                                ? "#c8e6c9"
                                : isCompleted
                                ? "#f0f0f0"
                                : "#e3f2fd",
                              borderRadius: 1,
                              border: lesson.includes("Bayram")
                                ? "1px solid #ff9800"
                                : isCurrentLesson
                                ? "2px solid #4caf50"
                                : "1px solid #2196f3",
                              minHeight: "60px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: isCompleted ? 0.7 : 1,
                              transform: isCurrentLesson
                                ? "scale(1.05)"
                                : "scale(1)",
                              transition: "all 0.3s ease",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: isCurrentLesson ? 500 : 400,
                                fontSize: isCurrentLesson
                                  ? "0.8rem"
                                  : "0.75rem",
                                textAlign: "center",
                                whiteSpace: "pre-line",
                                lineHeight: 1.4,
                                letterSpacing: "0.01em",
                                color: lesson.includes("Bayram")
                                  ? "#f57c00"
                                  : isCurrentLesson
                                  ? "#2e7d32"
                                  : isCompleted
                                  ? "#666"
                                  : "#1976d2",
                              }}
                            >
                              {lesson}
                            </Typography>
                          </Box>
                        )}

                        {/* Durum İşaretçileri */}
                        {isCurrentLesson && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor: "#4caf50",
                              color: "white",
                              borderRadius: "50%",
                              width: 24,
                              height: 24,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.7rem",
                              animation: "pulse 2s infinite",
                              "@keyframes pulse": {
                                "0%": { transform: "scale(1)" },
                                "50%": { transform: "scale(1.1)" },
                                "100%": { transform: "scale(1)" },
                              },
                            }}
                          >
                            ●
                          </Box>
                        )}

                        {isUpcoming && lesson && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor: "#ff9800",
                              color: "white",
                              borderRadius: "50%",
                              width: 20,
                              height: 20,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.6rem",
                            }}
                          >
                            ⏳
                          </Box>
                        )}

                        {isCompleted && lesson && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor: "#9e9e9e",
                              color: "white",
                              borderRadius: "50%",
                              width: 20,
                              height: 20,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.6rem",
                            }}
                          >
                            ✓
                          </Box>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Canlı Durum Açıklamaları */}
        <Box sx={{ mt: 3, p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              mb: 2,
              textAlign: "center",
              fontSize: "1rem",
              lineHeight: 1.5,
            }}
          >
            Canlı Durum Göstergeleri
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Circle
                sx={{
                  color: "#4caf50",
                  fontSize: 16,
                  animation: "pulse 2s infinite",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  lineHeight: 1.4,
                }}
              >
                Şu Anda Devam Ediyor
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: "#fff3e0",
                  border: "2px solid #ff9800",
                  borderRadius: 0.5,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.75rem",
                  lineHeight: 1.4,
                }}
              >
                Yaklaşan Ders
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: "#f5f5f5",
                  border: "1px solid #9e9e9e",
                  borderRadius: 0.5,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.75rem",
                  lineHeight: 1.4,
                }}
              >
                Tamamlanan Ders
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: "#e3f2fd",
                  border: "1px solid #2196f3",
                  borderRadius: 0.5,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.75rem",
                  lineHeight: 1.4,
                }}
              >
                Normal Ders
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: "#fff3e0",
                  border: "1px solid #ff9800",
                  borderRadius: 0.5,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.75rem",
                  lineHeight: 1.4,
                }}
              >
                Özel Gün/Tatil
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              textAlign: "center",
              mt: 1,
              fontSize: "0.75rem",
              lineHeight: 1.4,
              opacity: 0.7,
            }}
          ></Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AnaSayfa;
>>>>>>> b458935077ae6d999bd4305048ef9f3ae0601500
