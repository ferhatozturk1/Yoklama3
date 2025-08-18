import React, { useState, useEffect } from 'react';
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
  ListItemIcon,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ArrowBack,
  Person,
  School,
  LocationOn,
  Assessment,
  CheckCircle,
  Cancel,
  CalendarToday
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const ÖğrenciDetay = ({ student, course, onBack, loading, error }) => {
  const { accessToken } = useAuth();
  const [studentDetail, setStudentDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Student ID'yi al
  const getStudentId = () => {
    if (student?.id) return student.id;
    if (student?.student_id) return student.student_id;
    if (student?.student_number) return student.student_number;
    return null;
  };

  // API'den öğrenci detaylarını getir
  const fetchStudentDetail = async (studentId) => {
    if (!studentId) {
      console.error('❌ Student ID bulunamadı:', student);
      setApiError('Öğrenci ID bulunamadı');
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const url = `http://127.0.0.1:8000/student_data/students/student_id/${studentId}/`;
      console.log('🔍 Öğrenci detayı getiriliyor:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Student Detail Response:', response.status);

      if (response.status === 404) {
        console.warn('⚠️ Öğrenci detayı bulunamadı (404)');
        setApiError('Bu öğrencinin detaylı bilgileri bulunamadı');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📊 Student Detail Data:', data);
      
      setStudentDetail(data);
      
    } catch (error) {
      console.error('❌ Öğrenci detayı fetch hatası:', error);
      setApiError(`Öğrenci detayı alınamadı: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Component mount olduğunda öğrenci detayını getir
  useEffect(() => {
    const studentId = getStudentId();
    if (studentId && accessToken) {
      fetchStudentDetail(studentId);
    }
  }, [student, accessToken]);

  // Loading state from parent
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            onClick={onBack}
            sx={{ 
              mr: 2, 
              bgcolor: '#1976d2', 
              color: 'white',
              '&:hover': { bgcolor: '#1565c0' }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            Öğrenci Detayları
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Öğrenci detayları yükleniyor...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Error state from parent
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            onClick={onBack}
            sx={{ 
              mr: 2, 
              bgcolor: '#1976d2', 
              color: 'white',
              '&:hover': { bgcolor: '#1565c0' }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
            Öğrenci Detayları
          </Typography>
        </Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={onBack}>
          Geri Dön
        </Button>
      </Container>
    );
  }

  // Merge student data with API detail
  const studentData = {
    // Base student data
    id: student?.id || student?.student_id,
    name: `${student?.first_name || ''} ${student?.last_name || ''}`.trim() || student?.name || 'İsimsiz Öğrenci',
    number: student?.student_number || student?.number || '-',
    department: student?.department_name || student?.department || 'Bölüm belirtilmemiş',
    email: student?.email || '-',
    year: student?.year || '-',
    
    // API'den gelen detay bilgileri
    ...studentDetail,
    
    // Fallback values
    attendance: studentDetail?.attendance || student?.attendance || 0,
    total: studentDetail?.total || student?.total || 0,
    rate: studentDetail?.rate || student?.rate || 0,
    attendanceHistory: Array.isArray(studentDetail?.attendanceHistory) 
      ? studentDetail.attendanceHistory 
      : Array.isArray(student?.attendanceHistory) 
        ? student.attendanceHistory 
        : []
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
    if (!Array.isArray(studentData.attendanceHistory) || studentData.attendanceHistory.length === 0) {
      return 0;
    }
    const attendedCount = studentData.attendanceHistory.filter(a => a.status === 'Katıldı').length;
    return Math.round((attendedCount / studentData.attendanceHistory.length) * 100);
  };

  // Güvenli string alma fonksiyonu
  const getFirstChar = (text) => {
    if (!text || typeof text !== 'string') return '?';
    return text.charAt(0).toUpperCase();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      {/* Başlık ve Geri Butonu */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton
          onClick={onBack}
          sx={{ 
            mr: 2, 
            bgcolor: '#1976d2', 
            color: 'white',
            '&:hover': { 
              bgcolor: '#1565c0',
              transform: 'scale(1.05)',
            }, 
            borderRadius: 3,
            boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
            transition: "all 0.2s ease-in-out",
          }}
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
          sx={{ bgcolor: '#2196f3', color: 'white', borderRadius: 3 }}
        />
        <Chip
          icon={<Person />}
          label={courseData.instructor}
          color="secondary"
          sx={{ bgcolor: '#9c27b0', color: 'white', borderRadius: 3 }}
        />
      </Box>

      <Grid container spacing={4}>
        {/* Sol Taraf - Öğrenci Bilgileri */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ mb: 3, borderRadius: 4 }}>
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
                  {getFirstChar(studentData.name)}
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
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Sağ Taraf - Katılım İstatistikleri */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ mb: 3, borderRadius: 4 }}>
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
                    borderRadius: 8,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: studentData.rate >= 80 ? '#4caf50' : studentData.rate >= 60 ? '#ff9800' : '#f44336',
                      borderRadius: 8
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
                <Box sx={{ textAlign: 'center', flex: 1, p: 2, bgcolor: '#e8f5e8', borderRadius: 3 }}>
                  <CheckCircle sx={{ color: '#4caf50', mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                    {studentData.attendanceHistory.filter(a => a.status === 'Katıldı').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Katıldı
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center', flex: 1, p: 2, bgcolor: '#ffebee', borderRadius: 3 }}>
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
      <Card elevation={2} sx={{ mt: 3, borderRadius: 4 }}>
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
                        {attendance.week || (index + 1)}. hafta
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
          variant="contained"
          color="primary"
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{ 
            minWidth: 150,
            bgcolor: "#1976d2",
            color: "white",
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
            "&:hover": {
              bgcolor: "#1565c0",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.4)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          Geri Dön
        </Button>
      </Box>
    </Container>
  );
};

export default ÖğrenciDetay;
