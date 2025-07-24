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

  // Weekly schedule data
  const weeklySchedule = {
    "08:40": {
      pazartesi: "MATH113/3\nYP-A1",
      salı: "",
      çarşamba: "",
      perşembe: "",
      cuma: "",
    },
    "09:50": {
      pazartesi: "",
      salı: "ENG101/8\nYP-D101",
      çarşamba: "23 Nisan\nUlusal Egemenlik\nve Çocuk\nBayramı",
      perşembe: "",
      cuma: "",
    },
    "11:00": {
      pazartesi: "",
      salı: "ENG101/8\nBMC3",
      çarşamba: "",
      perşembe: "BMC3\nLab-1",
      cuma: "",
    },
  };

  const timeSlots = ["08:40", "09:50", "11:00"];
  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];
  const dayKeys = ["pazartesi", "salı", "çarşamba", "perşembe", "cuma"];

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
        if (lesson) {
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

  // Desktop Schedule Table
  const DesktopSchedule = () => (
    <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#F8F9FA' }}>
            <TableCell sx={{ fontWeight: 600, color: '#2C3E50' }}>Saat</TableCell>
            {days.map((day) => (
              <TableCell key={day} align="center" sx={{ fontWeight: 600, color: '#2C3E50' }}>
                {day}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {timeSlots.map((timeSlot) => (
            <TableRow key={timeSlot} hover>
              <TableCell sx={{ fontWeight: 500, color: '#1B2E6D', bgcolor: '#F8F9FA' }}>
                {timeSlot}
              </TableCell>
              {dayKeys.map((dayKey, index) => {
                const lesson = weeklySchedule[timeSlot][dayKey];
                return (
                  <TableCell key={dayKey} align="center" sx={{ p: 1 }}>
                    {lesson ? (
                      <Chip
                        label={lesson.replace('\n', ' - ')}
                        size="small"
                        sx={{
                          maxWidth: '100%',
                          height: 'auto',
                          '& .MuiChip-label': {
                            display: 'block',
                            whiteSpace: 'normal',
                            textAlign: 'center',
                            padding: '6px 8px',
                            fontSize: '0.75rem',
                          },
                          bgcolor: lesson.includes('Bayram') ? '#FFE0B2' : '#E3F2FD',
                          color: lesson.includes('Bayram') ? '#E65100' : '#1565C0',
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.disabled">
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

      {/* Current Class Status */}
      {currentClass && (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            bgcolor: "#E8F5E8",
            borderLeft: "4px solid #27AE60",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#27AE60" }}>
              Şu Anki Ders
            </Typography>
            <Chip
              icon={<CircleIcon sx={{ fontSize: 12, animation: "pulse 2s infinite" }} />}
              label="DEVAM EDİYOR"
              color="success"
              variant="filled"
            />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 500, color: "#1B2E6D", mb: 2 }}>
            {currentClass.lesson}
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
            <Tab icon={<AttendanceIcon />} label="Yoklama Takibi" />
            <Tab icon={<NotificationsIcon />} label="Bildirimler" />
          </Tabs>
        </AppBar>

        <TabPanel value={activeTab} index={0}>
          {isMobile ? <MobileSchedule /> : <DesktopSchedule />}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            {attendanceStats.map((stat) => (
              <Grid item xs={12} sm={6} md={4} key={stat.course}>
                <Card sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {stat.course}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1B2E6D', mb: 1 }}>
                    %{stat.attendance}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <TrendingUpIcon color={stat.trend === 'up' ? 'success' : 'error'} />
                    <Typography variant="body2" color="text.secondary">
                      Katılım Oranı
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
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
