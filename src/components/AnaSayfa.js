import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
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
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Avatar,
  Divider,
  Badge,
  LinearProgress,
  AppBar,
  IconButton,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
  ExpandMore as ExpandMoreIcon,
  Class as ClassIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  PersonAdd as PersonAddIcon,
  Assignment as AttendanceIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState(0);
  const [expandedDay, setExpandedDay] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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

  const timeSlots = ["08:40", "09:50", "11:00", "13:40", "14:40", "15:40", "16:40", "17:40", "18:40", "19:40"];
  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];
  const dayKeys = ["pazartesi", "salı", "çarşamba", "perşembe", "cuma"];

  // Get lesson status for visual indicators
  const getLessonStatus = (timeSlot, dayKey) => {
    const currentTimeNum = currentTime.getHours() * 100 + currentTime.getMinutes();
    const currentDay = dayKeys[currentTime.getDay() - 1];
    const [hour, minute] = timeSlot.split(":").map(Number);
    const slotTime = hour * 100 + minute;
    const endTime = slotTime + 50;
    const lesson = weeklySchedule[timeSlot][dayKey];

    if (!lesson) return 'empty';
    if (lesson.includes('Bayram') || lesson.includes('Tatil')) return 'holiday';
    if (currentDay !== dayKey) return 'regular';
    
    if (currentTimeNum >= slotTime && currentTimeNum <= endTime) {
      return 'current';
    } else if (currentTimeNum < slotTime) {
      return 'upcoming';
    } else {
      return 'completed';
    }
  };

  // Get current class
  const getCurrentClass = () => {
    const currentTimeNum = currentTime.getHours() * 100 + currentTime.getMinutes();
    const currentDay = dayKeys[currentTime.getDay() - 1];

    if (!currentDay) return null;

    for (const timeSlot of timeSlots) {
      const [hour, minute] = timeSlot.split(":").map(Number);
      const slotTime = hour * 100 + minute;
      const endTime = slotTime + 50;

      if (currentTimeNum >= slotTime && currentTimeNum <= endTime) {
        const lesson = weeklySchedule[timeSlot][currentDay];
        if (lesson && !lesson.includes('Bayram')) {
          const remainingMinutes = Math.floor((endTime - currentTimeNum) / 100) * 60 + ((endTime - currentTimeNum) % 100);
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
    const currentTimeNum = currentTime.getHours() * 100 + currentTime.getMinutes();
    const currentDay = dayKeys[currentTime.getDay() - 1];

    if (!currentDay) return null;

    for (const timeSlot of timeSlots) {
      const [hour, minute] = timeSlot.split(":").map(Number);
      const slotTime = hour * 100 + minute;

      if (currentTimeNum < slotTime) {
        const lesson = weeklySchedule[timeSlot][currentDay];
        if (lesson && !lesson.includes('Bayram')) {
          const minutesUntil = Math.floor((slotTime - currentTimeNum) / 100) * 60 + ((slotTime - currentTimeNum) % 100);
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

  // Mock data for tabs
  const todaysClasses = [
    { time: "08:40-09:30", subject: "MATH113/3", room: "YP-A1", status: "completed" },
    { time: "09:50-10:40", subject: "ENG101/8", room: "YP-D101", status: "current" },
    { time: "11:00-11:50", subject: "BMC3", room: "Lab-1", status: "upcoming" },
  ];

  const notifications = [
    { id: 1, message: "Matematik dersinde yoklama alınmadı", type: "warning", time: "2 saat önce" },
    { id: 2, message: "Yeni ders programı güncellendi", type: "info", time: "1 gün önce" },
    { id: 3, message: "Öğrenci kaydı tamamlandı", type: "success", time: "3 gün önce" },
  ];

  const attendanceStats = [
    { course: "MATH113", attendance: 85, trend: "up" },
    { course: "ENG101", attendance: 78, trend: "down" },
    { course: "BMC3", attendance: 92, trend: "up" },
  ];

  // Compact Welcome Header
  const WelcomeHeader = () => (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 3,
        background: "linear-gradient(135deg, #1B2E6D 0%, #4A90E2 100%)",
        borderRadius: 2,
        color: "white",
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
            <SchoolIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Öğr. Gör. Mehmet Nuri Öğüt
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              2025-2026 Güz Dönemi
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
            {currentTime.toLocaleTimeString('tr-TR')}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {currentTime.toLocaleDateString('tr-TR', { 
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );

  // Get chip styling based on lesson status
  const getChipStyling = (timeSlot, dayKey) => {
    const status = getLessonStatus(timeSlot, dayKey);
    const lesson = weeklySchedule[timeSlot][dayKey];
    
    switch (status) {
      case 'current':
        return {
          bgcolor: '#E8F5E8',
          color: '#27AE60',
          border: '2px solid #27AE60',
          fontWeight: 600,
          animation: 'pulse 2s infinite',
        };
      case 'upcoming':
        return {
          bgcolor: '#FFFBF0',
          color: '#B8860B',
          border: '1px solid #DAA520',
          fontWeight: 500,
        };
      case 'completed':
        return {
          bgcolor: '#F5F5F5',
          color: '#6C757D',
          border: '1px solid #ADB5BD',
          opacity: 0.8,
        };
      case 'holiday':
        return {
          bgcolor: '#FFE0B2',
          color: '#E65100',
          fontWeight: 500,
          border: '1px solid #FF9800',
        };
      case 'regular':
      default:
        return {
          bgcolor: '#E3F2FD',
          color: '#1565C0',
          border: '1px solid #90CAF9',
        };
    }
  };

  // Desktop Schedule Table
  const DesktopSchedule = () => (
    <Box sx={{ mt: 3 }}>
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 0, border: '1px solid #DEE2E6' }}>
        <Table sx={{ '& .MuiTableCell-root': { borderRight: '1px solid #DEE2E6' } }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8F9FA', borderBottom: '2px solid #DEE2E6' }}>
              <TableCell sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '0.875rem', py: 2 }}>Saat</TableCell>
              {days.map((day, index) => (
                <TableCell 
                  key={day} 
                  align="center" 
                  sx={{ 
                    fontWeight: 600, 
                    color: index === currentTime.getDay() - 1 ? '#1B2E6D' : '#2C3E50',
                    fontSize: '0.875rem',
                    py: 2,
                    bgcolor: index === currentTime.getDay() - 1 ? '#E3F2FD' : '#F8F9FA'
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
                  '&:hover': { bgcolor: '#F8F9FA' },
                  borderBottom: rowIndex < timeSlots.length - 1 ? '1px solid #DEE2E6' : 'none'
                }}
              >
                <TableCell 
                  sx={{ 
                    fontWeight: 500, 
                    color: '#1B2E6D', 
                    bgcolor: '#F8F9FA',
                    fontSize: '0.875rem',
                    py: 2.5,
                    minWidth: '80px'
                  }}
                >
                  {timeSlot}
                </TableCell>
                {dayKeys.map((dayKey, index) => {
                  const lesson = weeklySchedule[timeSlot][dayKey];
                  const chipStyling = getChipStyling(timeSlot, dayKey);
                  
                  return (
                    <TableCell key={dayKey} align="center" sx={{ p: 1.5, minHeight: '60px' }}>
                      {lesson ? (
                        <Chip
                          label={lesson.replace('\n', ' - ')}
                          size="small"
                          sx={{
                            maxWidth: '100%',
                            height: 'auto',
                            minHeight: '36px',
                            '& .MuiChip-label': {
                              display: 'block',
                              whiteSpace: 'normal',
                              textAlign: 'center',
                              padding: '8px 12px',
                              fontSize: '0.75rem',
                              lineHeight: 1.3,
                            },
                            ...chipStyling
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.disabled" sx={{ py: 1 }}>
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
      <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        <Chip size="small" label="Şu Anki Ders" sx={{ bgcolor: '#E8F5E8', color: '#27AE60', border: '2px solid #27AE60' }} />
        <Chip size="small" label="Gelecek Ders" sx={{ bgcolor: '#FFFBF0', color: '#B8860B', border: '1px solid #DAA520' }} />
        <Chip size="small" label="Tamamlanan Ders" sx={{ bgcolor: '#F5F5F5', color: '#6C757D', border: '1px solid #ADB5BD' }} />
        <Chip size="small" label="Normal Ders" sx={{ bgcolor: '#E3F2FD', color: '#1565C0', border: '1px solid #90CAF9' }} />
        <Chip size="small" label="Özel Gün/Tatil" sx={{ bgcolor: '#FFE0B2', color: '#E65100', border: '1px solid #FF9800' }} />
      </Box>
    </Box>
  );

  // Mobile Accordion Schedule
  const MobileSchedule = () => (
    <Box>
      {days.map((day, dayIndex) => {
        const dayClasses = timeSlots.filter(slot => weeklySchedule[slot][dayKeys[dayIndex]]);
        
        return (
          <Accordion
            key={day}
            expanded={expandedDay === day}
            onChange={handleAccordionChange(day)}
            sx={{ mb: 1, borderRadius: 2, '&:before': { display: 'none' } }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                bgcolor: dayIndex === currentTime.getDay() - 1 ? '#E3F2FD' : '#F8F9FA',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <CalendarIcon color={dayIndex === currentTime.getDay() - 1 ? 'primary' : 'disabled'} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {day}
                </Typography>
                <Badge 
                  badgeContent={dayClasses.length} 
                  color="primary" 
                  sx={{ ml: 'auto', mr: 2 }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {dayClasses.length > 0 ? (
                dayClasses.map(slot => (
                  <Card key={slot} sx={{ mb: 1, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <AccessTimeIcon color="primary" />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {slot} - {parseInt(slot.split(':')[0]) + 1}:{slot.split(':')[1]}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {weeklySchedule[slot][dayKeys[dayIndex]].replace('\n', ' - ')}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', py: 2 }}>
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
    <Container maxWidth="xl" sx={{ mt: 2, pb: 4 }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircleIcon sx={{ color: '#27AE60', fontSize: 16, animation: 'pulse 2s infinite' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#27AE60" }}>
                  Şu Anki Ders
                </Typography>
              </Box>
              <Chip
                label="DEVAM EDİYOR"
                size="small"
                sx={{
                  bgcolor: '#27AE60',
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}
              />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 500, color: "#1B2E6D", mb: 2 }}>
              {currentClass.lesson.replace('\n', ' - ')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {currentClass.time} - {parseInt(currentClass.time.split(':')[0]) + 1}:{currentClass.time.split(':')[1]}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, color: "#27AE60" }}>
                Kalan: {Math.floor(currentClass.remainingMinutes / 60)}:{(currentClass.remainingMinutes % 60).toString().padStart(2, '0')} dk
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
        
        {!currentClass && (() => {
          const nextClass = getNextClass();
          return nextClass && (
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AccessTimeIcon sx={{ color: '#F39C12', fontSize: 16 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#F39C12" }}>
                  Sıradaki Ders
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 500, color: "#1B2E6D", mb: 2 }}>
                {nextClass.lesson.replace('\n', ' - ')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {nextClass.time} - {Math.floor(nextClass.minutesUntil / 60)} saat {nextClass.minutesUntil % 60} dakika sonra
              </Typography>
            </Paper>
          );
        })()}
      </Box>

      {/* Tab Navigation for Mobile/Desktop */}
      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderRadius: '8px 8px 0 0' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            textColor="primary"
            indicatorColor="primary"
            sx={{ bgcolor: '#F8F9FA' }}
          >
            <Tab icon={<ScheduleIcon />} label="Ders Programı" />
            <Tab icon={<NotificationsIcon />} label="Bildirimler" />
          </Tabs>
        </AppBar>

        <TabPanel value={activeTab} index={0}>
          {isMobile ? <MobileSchedule /> : <DesktopSchedule />}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box>
            {notifications.map((notification) => (
              <Card key={notification.id} sx={{ mb: 2, p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <NotificationsIcon 
                    color={notification.type === 'warning' ? 'warning' : notification.type === 'success' ? 'success' : 'info'} 
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AnaSayfa;
