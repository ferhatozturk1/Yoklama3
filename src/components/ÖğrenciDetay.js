import React from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  ArrowBack, 
  Person, 
  School, 
  Email, 
  Phone, 
  LocationOn,
  Assessment,
  CheckCircle,
  Cancel,
  CalendarToday
} from '@mui/icons-material';

const ÖğrenciDetay = ({ student, course, onBack }) => {
  // Eğer student prop'u yoksa varsayılan veri kullan
  const studentData = student || {
    id: 1,
    name: 'Ahmet Taşlık',
    number: '2021001',
    class: 'GENG 1. sınıf',
    department: 'Bilgisayar Mühendisliği',
    email: 'ahmet.taslik@ogrenci.edu.tr',
    phone: '+90 555 123 4567',
    attendance: 23,
    total: 25,
    rate: 92,
    attendanceHistory: [
      { date: '2025-07-22', status: 'Katıldı', week: 15 },
      { date: '2025-07-21', status: 'Katıldı', week: 14 },
      { date: '2025-07-20', status: 'Katılmadı', week: 13 },
      { date: '2025-07-19', status: 'Katıldı', week: 12 },
      { date: '2025-07-18', status: 'Katıldı', week: 11 },
      { date: '2025-07-17', status: 'Katıldı', week: 10 },
      { date: '2025-07-16', status: 'Katılmadı', week: 9 },
      { date: '2025-07-15', status: 'Katıldı', week: 8 }
    ]
  };

  const courseData = course || {
    name: 'Matematik I',
    code: 'MAT101',
    instructor: 'Dr. Ayşe Kaya'
  };

  const getAttendanceStatusColor = (status) => {
    return status === 'Katıldı' ? 'success' : 'error';
  };

  const getAttendanceRate = () => {
    const attendedCount = studentData.attendanceHistory.filter(a => a.status === 'Katıldı').length;
    return Math.round((attendedCount / studentData.attendanceHistory.length) * 100);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      {/* Başlık ve Geri Butonu */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={onBack}
          sx={{ mr: 2, bgcolor: '#f5f5f5', '&:hover': { bgcolor: '#e0e0e0' } }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          Öğrenci Detayları
        </Typography>
      </Box>

      {/* Ders Bilgisi */}
      <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
        <Chip 
          icon={<School />} 
          label={`${courseData.code} - ${courseData.name}`} 
          color="primary" 
          sx={{ bgcolor: '#2196f3', color: 'white' }}
        />
        <Chip 
          icon={<Person />} 
          label={courseData.instructor} 
          color="secondary" 
          sx={{ bgcolor: '#9c27b0', color: 'white' }}
        />
      </Box>

      <Grid container spacing={4}>
        {/* Sol Taraf - Öğrenci Bilgileri */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: '#1a237e', 
                    fontSize: '2rem',
                    mr: 3
                  }}
                >
                  {studentData.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    {studentData.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {studentData.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {studentData.class}
                  </Typography>
                </Box>
              </Box>
              
              <List dense>
                <ListItem>
                  <ListItemIcon><School /></ListItemIcon>
                  <ListItemText 
                    primary="Bölüm" 
                    secondary={studentData.department} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Email /></ListItemIcon>
                  <ListItemText 
                    primary="E-posta" 
                    secondary={studentData.email} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Phone /></ListItemIcon>
                  <ListItemText 
                    primary="Telefon" 
                    secondary={studentData.phone} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Sağ Taraf - Katılım İstatistikleri */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ mr: 1, color: '#2196f3' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                  Katılım İstatistikleri
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Genel Katılım Oranı
                  </Typography>
                  <Chip 
                    label={`%${studentData.rate}`}
                    color={studentData.rate >= 80 ? 'success' : studentData.rate >= 60 ? 'warning' : 'error'}
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                
                <LinearProgress 
                  variant="determinate" 
                  value={studentData.rate}
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: studentData.rate >= 80 ? '#4caf50' : studentData.rate >= 60 ? '#ff9800' : '#f44336'
                    }
                  }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Katıldı: {studentData.attendance}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam: {studentData.total}
                  </Typography>
                </Box>
              </Box>

              {/* Katılım Durumu Özeti */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Box sx={{ textAlign: 'center', flex: 1, p: 2, bgcolor: '#e8f5e8', borderRadius: 2 }}>
                  <CheckCircle sx={{ color: '#4caf50', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                    {studentData.attendanceHistory.filter(a => a.status === 'Katıldı').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Katıldı
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center', flex: 1, p: 2, bgcolor: '#ffebee', borderRadius: 2 }}>
                  <Cancel sx={{ color: '#f44336', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                    {studentData.attendanceHistory.filter(a => a.status === 'Katılmadı').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Katılmadı
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Yoklama Geçmişi */}
      <Card elevation={2} sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CalendarToday sx={{ mr: 1, color: '#2196f3' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
              Yoklama Geçmişi
            </Typography>
          </Box>
          
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>Hafta</strong></TableCell>
                  <TableCell><strong>Tarih</strong></TableCell>
                  <TableCell><strong>Durum</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentData.attendanceHistory.map((attendance, index) => (
                  <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Hafta {attendance.week}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(attendance.date).toLocaleDateString('tr-TR')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={attendance.status}
                        color={getAttendanceStatusColor(attendance.status)}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Geri Dön Butonu */}
      <Box sx={{ mt: 4 }}>
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{ minWidth: 150 }}
        >
          Geri Dön
        </Button>
      </Box>
    </Container>
  );
};

export default ÖğrenciDetay;
