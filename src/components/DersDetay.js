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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  LinearProgress,
  Badge,
  TextField,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  School,
  LocationOn,
  Groups,
  Assessment,
  CloudUpload,
  FileDownload,
  CheckCircle,
  Refresh,
  CalendarToday,
  InsertDriveFile,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  Add,
  Schedule
} from '@mui/icons-material';
import ÖğrenciDetay from './ÖğrenciDetay';

const DersDetay = ({ ders, onBack }) => {
  // Dialog states
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [openYoklamaYenileDialog, setOpenYoklamaYenileDialog] = useState(false);

  // Student list states
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('list');
  const [canEdit, setCanEdit] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Student detail states
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDetail, setShowStudentDetail] = useState(false);

  // Add student dialog state
  const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    department: ''
  });

  // Sample students data
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      number: '2021001',
      class: '10-A',
      department: 'Matematik Bölümü',
      order: 1,
      attendance: 23,
      total: 25,
      rate: 92,
      lastAttendanceStatus: 'Katıldı',
      attendanceHistory: [
        { date: '2025-07-22', status: 'Katıldı' },
        { date: '2025-07-21', status: 'Katıldı' },
        { date: '2025-07-20', status: 'Katılmadı' },
        { date: '2025-07-19', status: 'Katıldı' }
      ]
    },
    {
      id: 2,
      name: 'Ayşe Kaya',
      number: '2021002',
      class: '10-A',
      department: 'Matematik Bölümü',
      order: 2,
      attendance: 24,
      total: 25,
      rate: 96,
      lastAttendanceStatus: 'Katıldı',
      attendanceHistory: [
        { date: '2025-07-22', status: 'Katıldı' },
        { date: '2025-07-21', status: 'Katıldı' },
        { date: '2025-07-20', status: 'Katıldı' },
        { date: '2025-07-19', status: 'Katıldı' }
      ]
    }
  ]);

  // Event handlers
  const handleYoklamaYenile = () => {
    setOpenYoklamaYenileDialog(true);
  };

  const handleConfirmYoklamaYenile = () => {
    console.log('Yoklama yenileniyor - onaylandı');
    setOpenYoklamaYenileDialog(false);
    // Burada yoklama yenileme işlemi yapılacak
  };

  const handleTelafiDers = () => {
    console.log('Telafi ders');
  };

  const handleStudentList = () => {
    setOpenStudentDialog(true);
  };

  const handleFileManagement = () => {
    setOpenFileDialog(true);
  };

  const handleGenerateReport = () => {
    setOpenReportDialog(true);
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'not_taken': return 'error';
      default: return 'default';
    }
  };

  const getAttendanceStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'pending': return 'Beklemede';
      case 'not_taken': return 'Alınmadı';
      default: return 'Bilinmiyor';
    }
  };

  const getSortedStudents = () => {
    const sorted = [...students].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name, 'tr');
      } else {
        return b.name.localeCompare(a.name, 'tr');
      }
    });
    return sorted;
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleEditModeToggle = () => {
    if (canEdit) {
      setEditMode(!editMode);
    }
  };

  const checkEditPermission = () => {
    return canEdit;
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowStudentDetail(true);
    setOpenStudentDialog(false);
  };

  const handleBackFromStudentDetail = () => {
    setShowStudentDetail(false);
    setSelectedStudent(null);
    setOpenStudentDialog(true);
  };

  // Öğrenci ekleme fonksiyonları
  const handleAddStudent = () => {
    setOpenAddStudentDialog(true);
  };

  const handleCloseAddStudentDialog = () => {
    setOpenAddStudentDialog(false);
    setNewStudent({
      name: '',
      department: ''
    });
  };

  const handleStudentInputChange = (field, value) => {
    setNewStudent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveStudent = () => {
    const yeniOgrenci = {
      id: students.length + 1,
      name: newStudent.name,
      department: newStudent.department || 'Matematik Bölümü',
      order: students.length + 1,
      attendance: 0,
      total: 0,
      rate: 0,
      lastAttendanceStatus: 'Henüz Katılmadı',
      attendanceHistory: []
    };

    setStudents(prev => [...prev, yeniOgrenci]);
    handleCloseAddStudentDialog();
  };

  // Eğer öğrenci detayı gösteriliyorsa ÖğrenciDetay bileşenini render et
  if (showStudentDetail && selectedStudent) {
    return (
      <ÖğrenciDetay
        student={selectedStudent}
        course={ders}
        onBack={handleBackFromStudentDetail}
      />
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Compact Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
        p: 1.5,
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={onBack}
            size="small"
            sx={{ bgcolor: '#f5f5f5', '&:hover': { bgcolor: '#e0e0e0' } }}
          >
            <ArrowBack fontSize="small" />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e' }}>
            {ders.name}
          </Typography>
          <Chip
            label={ders.code}
            size="small"
            color="primary"
            sx={{ ml: 1 }}
          />
        </Box>
        <IconButton size="small">
          <MoreVert />
        </IconButton>
      </Box>



      {/* 3-Column Grid Layout */}
      <Grid container spacing={2}>
        {/* Left Column - Course Information */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <School sx={{ mr: 1, color: '#1976d2', fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  Ders Bilgileri
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School sx={{ fontSize: 16, color: '#666' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {ders.code} - {ders.section}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ fontSize: 16, color: '#666' }} />
                  <Typography variant="body2">
                    {ders.building} - {ders.room}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Groups sx={{ fontSize: 16, color: '#666' }} />
                  <Typography variant="body2">
                    {ders.studentCount} öğrenci
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Weekly Schedule - Compact */}
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Schedule sx={{ mr: 1, color: '#1976d2', fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  Haftalık Program
                </Typography>
              </Box>

              {Object.entries(ders.schedule).map(([day, schedules]) => (
                <Box key={day} sx={{
                  mb: 1,
                  p: 1.5,
                  bgcolor: '#f8f9fa',
                  borderRadius: 1,
                  border: '1px solid #e9ecef'
                }}>
                  <Typography variant="body2" sx={{
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: '0.875rem'
                  }}>
                    {day}:
                  </Typography>
                  {schedules.map((s, index) => (
                    <Typography key={index} variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {s.startTime}-{s.endTime} ({s.room})
                    </Typography>
                  ))}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Middle Column - Attendance Status */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <CheckCircle sx={{ mr: 1, color: '#4caf50', fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  Yoklama Durumu
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Son Durum:
                </Typography>
                <Chip
                  label={getAttendanceStatusText(ders.attendanceStatus)}
                  color={getAttendanceStatusColor(ders.attendanceStatus)}
                  size="small"
                />
              </Box>

              {ders.lastAttendance && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Son alınan: {new Date(ders.lastAttendance).toLocaleDateString('tr-TR')}
                </Typography>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Katılım Oranı:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                  %{ders.attendanceRate}
                </Typography>
              </Box>

              {/* Progress Indicator */}
              <Box sx={{
                p: 1.5,
                bgcolor: '#e3f2fd',
                borderRadius: 1,
                mb: 2,
                border: '1px solid #bbdefb'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                    Dönem İlerlemesi
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {ders.currentWeek}/{ders.totalWeeks}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(ders.currentWeek / ders.totalWeeks) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#1976d2'
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  %{Math.round((ders.currentWeek / ders.totalWeeks) * 100)} tamamlandı
                </Typography>
              </Box>

              {/* Files Info */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                bgcolor: '#fff3e0',
                borderRadius: 1,
                border: '1px solid #ffcc02'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InsertDriveFile sx={{ fontSize: 16, color: '#ff9800' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                    Ders Dosyaları
                  </Typography>
                </Box>
                <Badge badgeContent={ders.files?.length || 0} color="primary">
                  <InsertDriveFile sx={{ fontSize: 16 }} />
                </Badge>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                Hızlı İşlemler
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Groups />}
                  onClick={handleStudentList}
                  fullWidth
                  size="small"
                  sx={{
                    bgcolor: '#4caf50',
                    '&:hover': { bgcolor: '#388e3c' },
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1
                  }}
                >
                  Öğrenciler ({ders.studentCount})
                </Button>

                <Button
                  variant="contained"
                  startIcon={<CloudUpload />}
                  onClick={handleFileManagement}
                  fullWidth
                  size="small"
                  sx={{
                    bgcolor: '#ff9800',
                    '&:hover': { bgcolor: '#f57c00' },
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1
                  }}
                >
                  Dosyalar ({ders.files?.length || 0})
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Assessment />}
                  onClick={handleGenerateReport}
                  fullWidth
                  size="small"
                  sx={{
                    bgcolor: '#9c27b0',
                    '&:hover': { bgcolor: '#7b1fa2' },
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1
                  }}
                >
                  Rapor Oluştur
                </Button>

                <Divider sx={{ my: 1 }} />

                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleYoklamaYenile}
                  fullWidth
                  size="small"
                  sx={{
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': {
                      bgcolor: '#1976d2',
                      color: 'white'
                    },
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1
                  }}
                >
                  Yoklamayı Yenile
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<CalendarToday />}
                  onClick={handleTelafiDers}
                  fullWidth
                  size="small"
                  sx={{
                    borderColor: '#9c27b0',
                    color: '#9c27b0',
                    '&:hover': {
                      bgcolor: '#9c27b0',
                      color: 'white'
                    },
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 1
                  }}
                >
                  Telafi Ders
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>



      {/* Student List Dialog */}
      <Dialog
        open={openStudentDialog}
        onClose={() => {
          setOpenStudentDialog(false);
          setEditMode(false);
          setViewMode('list');
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              👥 Öğrenci Listesi - {ders?.name} ({ders?.code})
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={`${students.length} Öğrenci`}
                color="primary"
                size="small"
              />
              {checkEditPermission() && (
                <Chip
                  label={editMode ? "Düzenleme Modu" : "Görüntüleme Modu"}
                  color={editMode ? "warning" : "default"}
                  size="small"
                />
              )}
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {/* Control Panel - Compact */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            p: 1.5,
            bgcolor: '#f8f9fa',
            borderRadius: 2
          }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                Görünüm:
              </Typography>
              <Button
                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleViewModeChange('list')}
                startIcon={<Groups />}
                sx={{ textTransform: 'none', minWidth: 'auto', px: 1.5 }}
              >
                Liste
              </Button>
              <Button
                variant={viewMode === 'attendance' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleViewModeChange('attendance')}
                startIcon={<CheckCircle />}
                sx={{ textTransform: 'none', minWidth: 'auto', px: 1.5 }}
              >
                Yoklama
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleSortChange}
                sx={{ textTransform: 'none', minWidth: 'auto', px: 1.5 }}
              >
                {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
              </Button>

              <Button
                variant="contained"
                size="small"
                color="success"
                onClick={handleAddStudent}
                startIcon={<Add />}
                sx={{ textTransform: 'none', px: 1.5 }}
              >
                Öğrenci Ekle
              </Button>

              {checkEditPermission() && (
                <Button
                  variant={editMode ? 'contained' : 'outlined'}
                  size="small"
                  color={editMode ? 'warning' : 'primary'}
                  onClick={handleEditModeToggle}
                  startIcon={<Edit />}
                  sx={{ textTransform: 'none', px: 1.5 }}
                >
                  {editMode ? 'Düzenlemeyi Bitir' : 'Düzenle'}
                </Button>
              )}
            </Box>
          </Box>

          {/* Student List View - Compact Table */}
          {viewMode === 'list' && (
            <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600, py: 1 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 1 }}>Öğrenci Adı</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 1 }}>Bölüm</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 1 }}>İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getSortedStudents().map((student, index) => (
                    <TableRow
                      key={student.id}
                      sx={{
                        '&:hover': { bgcolor: '#f8f9fa', cursor: 'pointer' },
                        cursor: 'pointer'
                      }}
                      onClick={() => handleStudentClick(student)}
                    >
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: '#1a237e', fontSize: '0.875rem' }}>
                            {student.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {student.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {student.department}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStudentClick(student);
                            }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                          {editMode && (
                            <>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Toplam: {students.length} öğrenci |
                Ort. Katılım: %{Math.round(students.reduce((acc, s) => acc + s.rate, 0) / students.length)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                onClick={() => {
                  setOpenStudentDialog(false);
                  setEditMode(false);
                  setViewMode('list');
                }}
              >
                Kapat
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileDownload />}
                size="small"
              >
                Excel'e Aktar
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Add Student Dialog - Compact */}
      <Dialog
        open={openAddStudentDialog}
        onClose={handleCloseAddStudentDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
            👤 Yeni Öğrenci Ekle
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Öğrenci Adı Soyadı"
              value={newStudent.name}
              onChange={(e) => handleStudentInputChange('name', e.target.value)}
              sx={{ mb: 2 }}
              size="small"
              required
            />
            <TextField
              fullWidth
              label="Öğrenci Numarası"
              value={newStudent.number}
              onChange={(e) => handleStudentInputChange('number', e.target.value)}
              sx={{ mb: 2 }}
              size="small"
              required
            />
            <TextField
              fullWidth
              label="Sınıf"
              value={newStudent.class}
              onChange={(e) => handleStudentInputChange('class', e.target.value)}
              placeholder="Örn: 10-A"
              sx={{ mb: 2 }}
              size="small"
            />
            <TextField
              fullWidth
              label="Bölüm"
              value={newStudent.department}
              onChange={(e) => handleStudentInputChange('department', e.target.value)}
              placeholder="Örn: Matematik Bölümü"
              sx={{ mb: 2 }}
              size="small"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseAddStudentDialog} size="small">
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveStudent}
            disabled={!newStudent.name || !newStudent.number}
            sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
            size="small"
          >
            Öğrenciyi Ekle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog - Compact */}
      <Dialog
        open={openYoklamaYenileDialog}
        onClose={() => setOpenYoklamaYenileDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Refresh sx={{ color: '#ff9800', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
              Yoklamayı Yenile
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body1" sx={{ mb: 1.5 }}>
            Bu işlem, <strong>{ders.name}</strong> dersi için mevcut tüm yoklama bilgilerini sıfırlayacaktır.
          </Typography>
          <Typography variant="body2" color="error" sx={{ mb: 1.5 }}>
            ⚠️ <strong>Dikkat:</strong> Bu ders için diğer yoklama bilgileriniz silinecektir ve bu işlem geri alınamaz.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Devam etmek istediğinizden emin misiniz?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenYoklamaYenileDialog(false)}
            variant="outlined"
            size="small"
          >
            İptal
          </Button>
          <Button
            onClick={handleConfirmYoklamaYenile}
            variant="contained"
            color="warning"
            startIcon={<Refresh />}
            size="small"
          >
            Evet, Yenile
          </Button>
        </DialogActions>
      </Dialog>


    </Container>
  );
};

export default DersDetay;