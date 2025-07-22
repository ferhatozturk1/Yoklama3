import React, { useState, useEffect } from 'react';
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
  LinearProgress
} from '@mui/material';
import { AccessTime, Circle } from '@mui/icons-material';

const AnaSayfa = ({ onSectionChange }) => {
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
    '08:40': { 
      pazartesi: 'MATH113/3\nYP-A1', 
      salı: '', 
      çarşamba: '', 
      perşembe: '', 
      cuma: '' 
    },
    '09:50': { 
      pazartesi: '', 
      salı: 'ENG101/8\nYP-D101', 
      çarşamba: '23 Nisan\nUlusal Egemenlik\nve Çocuk\nBayramı', 
      perşembe: '', 
      cuma: '' 
    },
    '10:40': { 
      pazartesi: '', 
      salı: '', 
      çarşamba: '', 
      perşembe: '', 
      cuma: '' 
    },
    '11:00': { 
      pazartesi: '', 
      salı: 'ENG101/8\nBMC3', 
      çarşamba: '', 
      perşembe: '', 
      cuma: '' 
    }
  });

  const timeSlots = ['08:40', '09:50', '10:40', '11:00'];
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
  const dayKeys = ['pazartesi', 'salı', 'çarşamba', 'perşembe', 'cuma'];

  // Şu anki dersi bul (canlı)
  const getCurrentClass = () => {
    const currentTimeNum = currentTime.getHours() * 100 + currentTime.getMinutes();
    const currentDay = dayKeys[currentTime.getDay() - 1]; // Pazartesi = 0

    if (!currentDay) return null;

    for (const timeSlot of timeSlots) {
      const [hour, minute] = timeSlot.split(':').map(Number);
      const slotTime = hour * 100 + minute;
      const endTime = slotTime + 50; // 50 dakikalık ders
      
      if (currentTimeNum >= slotTime && currentTimeNum <= endTime) {
        const lesson = weeklySchedule[timeSlot][currentDay];
        if (lesson) {
          const remainingMinutes = Math.floor((endTime - currentTimeNum) / 100) * 60 + 
                                  (endTime - currentTimeNum) % 100;
          const progressPercent = ((currentTimeNum - slotTime) / 50) * 100;
          
          return { 
            lesson, 
            time: timeSlot, 
            remainingMinutes: Math.max(0, remainingMinutes),
            progressPercent: Math.min(100, Math.max(0, progressPercent))
          };
        }
      }
    }
    return null;
  };

  // Bir sonraki dersi bul
  const getNextClass = () => {
    const currentTimeNum = currentTime.getHours() * 100 + currentTime.getMinutes();
    const currentDay = dayKeys[currentTime.getDay() - 1];

    if (!currentDay) return null;

    for (const timeSlot of timeSlots) {
      const [hour, minute] = timeSlot.split(':').map(Number);
      const slotTime = hour * 100 + minute;
      
      if (currentTimeNum < slotTime) {
        const lesson = weeklySchedule[timeSlot][currentDay];
        if (lesson) {
          const minutesUntil = Math.floor((slotTime - currentTimeNum) / 100) * 60 + 
                              (slotTime - currentTimeNum) % 100;
          return { lesson, time: timeSlot, minutesUntil };
        }
      }
    }
    return null;
  };

  // Ders durumunu kontrol et
  const getLessonStatus = (timeSlot, dayKey) => {
    const currentTimeNum = currentTime.getHours() * 100 + currentTime.getMinutes();
    const currentDay = dayKeys[currentTime.getDay() - 1];
    const [hour, minute] = timeSlot.split(':').map(Number);
    const slotTime = hour * 100 + minute;
    const endTime = slotTime + 50;

    if (currentDay !== dayKey) return 'inactive';
    
    if (currentTimeNum >= slotTime && currentTimeNum <= endTime) {
      return 'active'; // Şu anda devam ediyor
    } else if (currentTimeNum < slotTime) {
      return 'upcoming'; // Gelecek
    } else {
      return 'completed'; // Tamamlandı
    }
  };

  const currentClass = getCurrentClass();
  const nextClass = getNextClass();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      {/* Hoşgeldin Mesajı - Canlı Saat */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
          borderRadius: 3,
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Hoşgeldin Dr. Ayşe Kaya! 👩‍🏫
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime />
              {currentTime.toLocaleTimeString('tr-TR')}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {currentDate.toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>
        </Box>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Günlük ders programınız aşağıda - Canlı takip aktif
        </Typography>
      </Paper>

      {/* Şu Anki Ders - Canlı */}
      {currentClass && (
        <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: '#e8f5e8', borderLeft: '4px solid #4caf50' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
              🎯 Şu Anki Ders - CANLI
            </Typography>
            <Chip 
              icon={<Circle sx={{ fontSize: 12, animation: 'pulse 2s infinite' }} />}
              label="DEVAM EDİYOR" 
              color="success" 
              variant="filled"
              sx={{ 
                fontWeight: 'bold',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                  '100%': { opacity: 1 }
                }
              }}
            />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 2 }}>
            {currentClass.lesson}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body1" color="text.secondary">
              ⏰ {currentClass.time} - {parseInt(currentClass.time.split(':')[0]) + 1}:{currentClass.time.split(':')[1]}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
              Kalan: {Math.floor(currentClass.remainingMinutes / 60)}:{(currentClass.remainingMinutes % 60).toString().padStart(2, '0')} dk
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={currentClass.progressPercent} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: '#c8e6c9',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#4caf50'
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Ders İlerlemesi: %{Math.round(currentClass.progressPercent)}
          </Typography>
        </Paper>
      )}

      {/* Bir Sonraki Ders */}
      {!currentClass && nextClass && (
        <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: '#fff3e0', borderLeft: '4px solid #ff9800' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f57c00', mb: 1 }}>
            ⏳ Bir Sonraki Ders
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            {nextClass.lesson}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ⏰ {nextClass.time} - {nextClass.minutesUntil} dakika sonra başlayacak
          </Typography>
        </Paper>
      )}

      {/* Akademik Takvim - Haftalık Ders Programı */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            📅 Haftalık Ders Programı - CANLI TAKİP
          </Typography>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="ders programı">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold', width: '100px' }}>Saat</TableCell>
                {days.map((day) => (
                  <TableCell key={day} align="center" sx={{ fontWeight: 'bold' }}>
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {timeSlots.map((timeSlot) => (
                <TableRow key={timeSlot} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                  <TableCell 
                    component="th" 
                    scope="row" 
                    sx={{ 
                      fontWeight: 'bold', 
                      bgcolor: '#e3f2fd',
                      borderRight: '2px solid #2196f3'
                    }}
                  >
                    {timeSlot}
                  </TableCell>
                  {dayKeys.map((dayKey) => {
                    const lesson = weeklySchedule[timeSlot][dayKey];
                    const lessonStatus = getLessonStatus(timeSlot, dayKey);
                    const isCurrentLesson = lessonStatus === 'active';
                    const isUpcoming = lessonStatus === 'upcoming';
                    const isCompleted = lessonStatus === 'completed';
                    
                    let cellBgColor = 'inherit';
                    let cellBorder = 'inherit';
                    
                    if (isCurrentLesson) {
                      cellBgColor = '#e8f5e8';
                      cellBorder = '3px solid #4caf50';
                    } else if (isUpcoming && lesson) {
                      cellBgColor = '#fff3e0';
                      cellBorder = '2px solid #ff9800';
                    } else if (isCompleted && lesson) {
                      cellBgColor = '#f5f5f5';
                      cellBorder = '1px solid #9e9e9e';
                    }
                    
                    return (
                      <TableCell 
                        key={dayKey} 
                        align="center"
                        sx={{
                          height: '80px',
                          verticalAlign: 'middle',
                          bgcolor: cellBgColor,
                          border: cellBorder,
                          position: 'relative',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {lesson && (
                          <Box sx={{ 
                            p: 1, 
                            bgcolor: lesson.includes('Bayram') 
                              ? '#fff3e0' 
                              : isCurrentLesson 
                                ? '#c8e6c9' 
                                : isCompleted 
                                  ? '#f0f0f0' 
                                  : '#e3f2fd',
                            borderRadius: 1,
                            border: lesson.includes('Bayram') 
                              ? '1px solid #ff9800' 
                              : isCurrentLesson 
                                ? '2px solid #4caf50' 
                                : '1px solid #2196f3',
                            minHeight: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isCompleted ? 0.7 : 1,
                            transform: isCurrentLesson ? 'scale(1.05)' : 'scale(1)',
                            transition: 'all 0.3s ease'
                          }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: isCurrentLesson ? 'bold' : 'normal',
                                fontSize: isCurrentLesson ? '0.8rem' : '0.75rem',
                                textAlign: 'center',
                                whiteSpace: 'pre-line',
                                color: lesson.includes('Bayram') 
                                  ? '#f57c00' 
                                  : isCurrentLesson 
                                    ? '#2e7d32' 
                                    : isCompleted 
                                      ? '#666' 
                                      : '#1976d2'
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
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: '#4caf50',
                              color: 'white',
                              borderRadius: '50%',
                              width: 24,
                              height: 24,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              animation: 'pulse 2s infinite',
                              '@keyframes pulse': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.1)' },
                                '100%': { transform: 'scale(1)' }
                              }
                            }}
                          >
                            ●
                          </Box>
                        )}
                        
                        {isUpcoming && lesson && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: '#ff9800',
                              color: 'white',
                              borderRadius: '50%',
                              width: 20,
                              height: 20,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.6rem'
                            }}
                          >
                            ⏳
                          </Box>
                        )}
                        
                        {isCompleted && lesson && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: '#9e9e9e',
                              color: 'white',
                              borderRadius: '50%',
                              width: 20,
                              height: 20,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.6rem'
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
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
            📊 Canlı Durum Göstergeleri
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Circle sx={{ color: '#4caf50', fontSize: 16, animation: 'pulse 2s infinite' }} />
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Şu Anda Devam Ediyor</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: '#fff3e0', border: '2px solid #ff9800', borderRadius: 0.5 }} />
              <Typography variant="caption">Yaklaşan Ders</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: '#f5f5f5', border: '1px solid #9e9e9e', borderRadius: 0.5 }} />
              <Typography variant="caption">Tamamlanan Ders</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: '#e3f2fd', border: '1px solid #2196f3', borderRadius: 0.5 }} />
              <Typography variant="caption">Normal Ders</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: '#fff3e0', border: '1px solid #ff9800', borderRadius: 0.5 }} />
              <Typography variant="caption">Özel Gün/Tatil</Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
            ⚡ Otomatik güncelleme aktif - Her saniye yenilenir
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AnaSayfa;