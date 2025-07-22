import React, { useState } from 'react';
import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton
} from '@mui/material';
import { 
  Edit,
  School,
  LocationOn,
  Groups
} from '@mui/icons-material';
import DersDetay from './DersDetay';

const Derslerim = () => {
  // View state - 'list' veya 'detail'
  const [currentView, setCurrentView] = useState('list');
  const [selectedDers, setSelectedDers] = useState(null);

  const [dersler] = useState([
    {
      id: 1,
      name: 'Matematik',
      code: 'MAT113/3',
      section: 'A1',
      sectionFull: 'YP-A1',
      building: 'A Blok',
      room: 'A101',
      class: '10-A',
      instructor: 'Dr. Ayşe Kaya',
      schedule: {
        pazartesi: [{ startTime: '08:40', endTime: '09:30', room: 'A101' }],
        çarşamba: [{ startTime: '14:00', endTime: '14:50', room: 'A101' }],
        cuma: [{ startTime: '10:00', endTime: '10:50', room: 'A101' }]
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 32,
      attendanceStatus: 'not_taken',
      lastAttendance: null,
      attendanceRate: 0,
      files: []
    },
    {
      id: 2,
      name: 'İngilizce',
      code: 'ENG101/8',
      section: 'D101',
      sectionFull: 'YP-D101',
      building: 'D Blok',
      room: 'D101',
      class: '10-B',
      instructor: 'Dr. Ayşe Kaya',
      schedule: {
        salı: [{ startTime: '09:50', endTime: '10:40', room: 'D101' }],
        perşembe: [{ startTime: '11:00', endTime: '11:50', room: 'D101' }]
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 28,
      attendanceStatus: 'not_taken',
      lastAttendance: null,
      attendanceRate: 0,
      files: []
    },
    {
      id: 3,
      name: 'Bilgisayar Mühendisliği',
      code: 'BMC3',
      section: '1',
      sectionFull: 'Lab-1',
      building: 'B Blok',
      room: 'B205',
      class: '11-A',
      instructor: 'Dr. Ayşe Kaya',
      schedule: {
        perşembe: [{ startTime: '11:00', endTime: '11:50', room: 'B205' }]
      },
      totalWeeks: 15,
      currentWeek: 8,
      studentCount: 24,
      attendanceStatus: 'not_taken',
      lastAttendance: null,
      attendanceRate: 0,
      files: []
    }
  ]);



  // Event handlers
  const handleDersClick = (ders) => {
    setSelectedDers(ders);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedDers(null);
  };

  const getDaysText = (schedule) => {
    return Object.keys(schedule).join(', ');
  };

  // Detay görünümü için DersDetay bileşenini kullan
  if (currentView === 'detail' && selectedDers) {
    return <DersDetay ders={selectedDers} onBack={handleBackToList} />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 4 }}>
        📚 Derslerim
      </Typography>

      <Grid container spacing={3}>
        {dersler.map((ders) => (
          <Grid item xs={12} sm={6} md={4} key={ders.id}>
            <Card 
              elevation={3} 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                },
                borderRadius: 2
              }}
              onClick={() => handleDersClick(ders)}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                {/* Ders Kodu */}
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
                  {ders.code}
                </Typography>
                
                {/* Section */}
                <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                  Section - {ders.section}
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                  {ders.sectionFull}
                </Typography>

                {/* Katılım Oranı */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                    Henüz yoklama alınmadı
                  </Typography>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    border: '4px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    bgcolor: '#f8f9fa'
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#999' }}>
                      %0
                    </Typography>
                  </Box>
                </Box>

                {/* Ders Bilgileri - Basit Format */}
                <Box sx={{ textAlign: 'left', mb: 3 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Ders:</strong> {ders.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Günler:</strong> {getDaysText(ders.schedule)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Öğrenci Sayısı:</strong> {ders.studentCount}
                  </Typography>
                </Box>

                {/* Dersi Düzenle Butonu */}
                <Button 
                  variant="outlined" 
                  startIcon={<Edit />}
                  fullWidth
                  sx={{ 
                    borderColor: '#1a237e',
                    color: '#1a237e',
                    '&:hover': {
                      borderColor: '#1a237e',
                      bgcolor: 'rgba(26, 35, 126, 0.04)'
                    }
                  }}
                >
                  Dersi Düzenle
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {dersler.map((ders) => (
          <Grid item xs={12} key={ders.id}>
            <Card elevation={3} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 4 }}>
                {/* Ders Başlığı ve Temel Bilgiler */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
                      {ders.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                      <Chip icon={<School />} label={`${ders.code} - ${ders.section}`} color="primary" />
                      <Chip icon={<LocationOn />} label={`${ders.building} ${ders.room}`} color="secondary" />
                      <Chip icon={<Groups />} label={`${ders.studentCount} Öğrenci`} color="info" />
                    </Box>
                  </Box>
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <MoreVert />
                  </IconButton>
                </Box>

                <Grid container spacing={3}>
                  {/* Sol Taraf - Ders Bilgileri */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1a237e' }}>
                      📋 Ders Bilgileri
                    </Typography>
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon><School /></ListItemIcon>
                        <ListItemText 
                          primary="Ders Kodu" 
                          secondary={`${ders.code} - ${ders.section}`} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><LocationOn /></ListItemIcon>
                        <ListItemText 
                          primary="Derslik" 
                          secondary={`${ders.building} - ${ders.room}`} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Person /></ListItemIcon>
                        <ListItemText 
                          primary="Öğretim Görevlisi" 
                          secondary={ders.instructor} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Groups /></ListItemIcon>
                        <ListItemText 
                          primary="Öğrenci Sayısı" 
                          secondary={`${ders.studentCount} öğrenci`} 
                        />
                      </ListItem>
                    </List>

                    {/* Haftalık Program */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 1, color: '#1a237e' }}>
                      📅 Haftalık Program
                    </Typography>
                    {Object.entries(ders.schedule).map(([day, schedules]) => (
                      <Box key={day} sx={{ mb: 1, p: 1, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                          {day}: {schedules.map(s => 
                            `${s.startTime}-${s.endTime} (${s.room})`
                          ).join(', ')}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>

                  {/* Sağ Taraf - Yoklama ve İstatistikler */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1a237e' }}>
                      ✅ Yoklama Durumu
                    </Typography>
                    
                    <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Son Yoklama Durumu:
                        </Typography>
                        <Chip 
                          label={getAttendanceStatusText(ders.attendanceStatus)}
                          color={getAttendanceStatusColor(ders.attendanceStatus)}
                          size="small"
                        />
                      </Box>
                      
                      {ders.lastAttendance && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Son Yoklama: {new Date(ders.lastAttendance).toLocaleDateString('tr-TR')}
                        </Typography>
                      )}
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Genel Katılım Oranı: %{ders.attendanceRate}
                      </Typography>

                      {/* Yoklama Butonları */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {ders.attendanceStatus === 'not_taken' ? (
                          <Button 
                            variant="contained" 
                            color="success"
                            startIcon={<PlayArrow />}
                            onClick={() => handleYoklamaBasla(ders)}
                            size="small"
                          >
                            Yoklama Başlat
                          </Button>
                        ) : (
                          <Button 
                            variant="outlined" 
                            color="primary"
                            startIcon={<Refresh />}
                            onClick={() => handleYoklamaYenile(ders)}
                            size="small"
                          >
                            Yoklamayı Yenile
                          </Button>
                        )}
                        <Button 
                          variant="outlined" 
                          color="secondary"
                          startIcon={<CalendarToday />}
                          onClick={() => handleTelafiDers(ders)}
                          size="small"
                        >
                          Telafi Ders
                        </Button>
                      </Box>
                    </Box>

                    {/* Hafta İlerlemesi */}
                    <Box sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2, mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        📊 Dönem İlerlemesi: {ders.currentWeek}/{ders.totalWeeks} Hafta
                      </Typography>
                      <Box sx={{ width: '100%', bgcolor: '#e0e0e0', borderRadius: 1, mb: 1 }}>
                        <Box 
                          sx={{ 
                            width: `${(ders.currentWeek / ders.totalWeeks) * 100}%`, 
                            bgcolor: '#1a237e', 
                            height: 8, 
                            borderRadius: 1 
                          }} 
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        %{Math.round((ders.currentWeek / ders.totalWeeks) * 100)} tamamlandı
                      </Typography>
                    </Box>

                    {/* Dosyalar */}
                    <Box sx={{ p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          📁 Ders Dosyaları
                        </Typography>
                        <Badge badgeContent={ders.files.length} color="primary">
                          <InsertDriveFile />
                        </Badge>
                      </Box>
                      {ders.files.length > 0 ? (
                        <Typography variant="caption" color="text.secondary">
                          {ders.files.length} dosya yüklendi
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Henüz dosya yüklenmedi
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
              
              {/* Alt Butonlar */}
              <CardActions sx={{ p: 3, pt: 0, bgcolor: '#f8f9fa' }}>
                <Button 
                  variant="outlined" 
                  startIcon={<Groups />}
                  onClick={() => handleStudentList(ders)}
                  sx={{ mr: 1 }}
                >
                  Öğrenci Listesi
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<CloudUpload />}
                  onClick={() => handleFileManagement(ders)}
                  sx={{ mr: 1 }}
                >
                  Dosya Yönetimi
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<Assessment />}
                  onClick={() => handleGenerateReport(ders)}
                >
                  Rapor Oluştur
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

    </Container>
  );
};

export default Derslerim;